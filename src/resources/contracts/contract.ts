import Reflect = require("reflect-metadata");
import PouchDB = require('pouchdb');
import _ = require('lodash');
import Q = require('bluebird')
import Transform = require('transform-pouch');

/**
 * A Contract class 
 */
export interface IContract {
    /**
     * The roles of the contract
     */
    roles: string[];

    /**
     * The signatures on the contract
     */
    signatures: string[];
}

/**
 * The backing entity
 */
export interface IEntity<T> {
    //The backing db entity
    entity: T;
}

/**
 * The base contract implementation
 */
export abstract class Contract<T extends IContract> implements IContract, IEntity<T> {
    public entity: T;
    private roleList: string[] = [];
    private promiseQueue: Q.Thenable<any>[] = [];

    constructor(entity: T) {
        this.entity = entity;
        this.entity["id"] = this.entity["id"] || guid();
        this.signatures = this.signatures || [];
        this.roles = this.roles || [];
    }

    /**
     * The roles the contract fills
     */
    public get roles() {
        return this.entity.roles;
    }
    public set roles(v: string[]) {
        this.entity.roles = v;
    }

    /**
     * The signatures on the contract
     */
    public get signatures() {
        return this.entity.signatures;
    }
    public set signatures(v: string[]) {
        this.entity.signatures = v;
    }

    private get id(): string {
        this.signatures = this.signatures || [];
        return this.signatures.join(',');
    }

    /**
     * Sign the contract adn save
     * @param key The key used to sign the contract
     */
    public signAndSave(key?: Key) {
        key = key || Key.currentKey;
        key.sign(this);
    }

    /**
     * Register the role of the contract
     */
    protected registerRole(role: string) {
        ~this.roles.indexOf(role) && this.roles.push(role);
    }

    private toJSON(prop): IContract | string {
        return prop.length ? this.id : this;
    }
}
export module Contract {
    interface IRegistry {
        contractConstructor: ObjectConstructor;
        subRegistry: { [id: string]: IRegistry; },
        transformProperties?: [string];
    }
    export class DataContext {
        public static instance: PouchDB.Database<IContract>;
        public static getInstance(): PouchDB.Database<IContract> {
            var instance = DataContext.instance || (DataContext.instance = new PouchDB('contract'),
                (<any>DataContext.instance).transform({
                    incoming: (contract: IContract) => {
                        return DataContext.load(contract);
                    },
                    outgoing: function (contract: IContract) {
                        return contract;
                    }
                })
                , DataContext.instance);
            return instance;
        }

        private static load(contract: IContract): Q.Thenable<IContract> {
            var registry: IRegistry;
            var promises = _(contract.roles).reduce<IRegistry[]>((previousValue, currentValue, index, array) => {
                var currentRegistry = _(previousValue).map<IRegistry>(`subRegistry.${currentValue}`).last() || DataContext.registry[currentValue];
                previousValue.push(registry = currentRegistry);
                return previousValue;
            }, []).map((registry) => {
                return _(registry.transformProperties)
                    .map((path) => {
                        var lastContractObjs: any[];
                        var lastPath: string;
                        var ids = _(<string[]>[_(path).split("[]").reduce((previous, current, index) => {
                            lastContractObjs = _.flatten(previous);
                            lastPath = current;
                            return _(lastContractObjs).map(current);
                        }, [contract])]).flatten();
                        var pairs = ids.zip(lastContractObjs);
                        pairs.each((item) => item.push(lastPath));
                        return pairs.map((pair: [string, Object, string]) => {
                            return { id: pair[0], obj: pair[1], path: [2] };
                        }).value();
                    })
                    .flatten<{ id: string, obj: Object, path: string }>()
                    .map((pair) => {
                        return DataContext.getInstance().get(pair.id).then((childContract) => {
                            _(pair.obj).set(pair.path, childContract);
                        });
                    })
                    .value();
            });
            return Q.all(_.flatten(promises)).then(() => <IContract>new registry.contractConstructor(contract));
        }
        private static registry: { [id: string]: IRegistry; } = {};
        public static register(name: string) {
            return (constructor: Function) => {
                var names: [[string, ObjectConstructor]] = [[(<any>constructor).contractName = name, <ObjectConstructor>constructor]];
                while ((constructor = Object.getPrototypeOf(constructor.prototype).constructor).name) {
                    names.push([(<any>constructor).contractName, <ObjectConstructor>constructor]);
                }
                var registry = DataContext.registry;
                names.reverse().forEach((pair) => {
                    if (!registry[pair[0]])
                        registry[pair[0]] = { contractConstructor: pair[1], subRegistry: {} };
                    if (registry[pair[0]].contractConstructor != pair[1]) {
                        throw new Error(`A contract has already registered the name ${pair[0]}`);
                    }
                    registry = registry[pair[0]].subRegistry;
                });
            }
        }
        public static entityProperty(path?: string) {
            return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<IContract>) => {

            };
        }
    }
}

var guid = () => {
    var s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};
export class Key {
    public static currentKey: Key;
    constructor(key?: Key) {
        if (key) {
            this.pubKey = key.pubKey || this.pubKey;
            this.name = key.name
        }
    }
    public pubKey: string = guid();
    public name: string;
    public sign(contract: IContract): string {
        return `${new Date().toISOString()}#${this.pubKey}`;
    }
}
export module Key {
    class DataContext {
        public static instance: PouchDB.Database<Key>;
        public static getInstance(): PouchDB.Database<Key> {
            return DataContext.instance || new PouchDB('key');
        }
    }
}