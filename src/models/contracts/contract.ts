import Reflect = require("reflect-metadata");
import _ = require('lodash');
import Q = require('bluebird')
import PouchDB = require('pouchdb');
import Find = require('pouchdb-find');
import Transform = require('transform-pouch');

PouchDB.plugin(Transform);
PouchDB.plugin(Find);

/**
 * A Contract class 
 */
export interface IContract {
  /**
   * The contract id
   */
  _id: string;
  /**
   * The roles of the contract
   */
  roles?: string[];

  /**
   * The signatures on the contract
   */
  signatures?: string[];
}

function getOrReturnInstance(idOrInstance: string | Contract<IContract>): Promise<IContract> {
  return _.isString(idOrInstance) ?
    Contract.DataContext.getInstance().get<IContract>(idOrInstance).catch(() => null) :
    new Promise((res) => res(idOrInstance));
}
/**
 * The base contract implementation
 */
export abstract class Contract<I extends IContract = IContract> implements IContract {
  constructor(entity: I) {
    Object.assign(this, entity);
    this.signatures = this.signatures || [];
    this.roles = this.roles || Contract.DataContext.getRegistry((<any>this).constructor).roles;
  }

  /**
   * The contract lookup
   */
  public _id: string

  /**
   * The contract revision
   */
  public _rev: string

  /**
   * The roles the contract fills
   */
  public roles: string[]

  /**
   * The signatures on the contract
   */
  public signatures: string[]

  /**
   * Sign the contract adn save
   * @param key The key used to sign the contract
   */
  public signAndSave(key?: Key) {
    key = key || Key.currentKey;
    key.sign(this);
  }
}
export module Contract {

  export interface ContractConstructor<T extends Contract = Contract, I extends IContract = IContract> {
    new(contract: I): I
  }
  export interface IRegistry {
    contractConstructor: ContractConstructor;
    transformProperties?: string[];
    roles: string[];
  }
  export class DataContext {
    public static instance: PouchDB.Database<IContract>;
    public static getContracts<
      TContract extends IContract,
      TCtor extends Contract<TContract> = Contract<TContract>
    >(contractCtor: ContractConstructor<TCtor>): Promise<TContract[]> {
      return Contract.DataContext.getInstance().allDocs({
        include_docs: true,
        attachments: true
      }).then((results) => {
        return results.rows.map((item) => <any>item.doc as TContract)
          .filter(ref => {
            var roles = ref.roles;
            return ~roles.indexOf(_.last(DataContext.getRegistry(contractCtor).roles));
          });
      });
    }
    public static getInstance(): PouchDB.Database<IContract> {
      var instance = DataContext.instance || (DataContext.instance = new PouchDB('contract', {
        adapter: "idb"
      }),
        (<any>DataContext.instance).transform({
          incoming: (contract: IContract) => {
            return DataContext.save(contract);
          },
          outgoing: function (contract: IContract) {
            return DataContext.load(contract);
          }
        })
        , DataContext.instance);
      return instance;
    }
    private static save(contract: IContract): IContract {
      var registry: IRegistry;
      var cloneContract: IContract = JSON.parse(JSON.stringify(contract));
      var promises = _(cloneContract.roles).reduce((previousValue, currentValue, index, array) => {
        var currentRegistry = DataContext.registryStringMap[currentValue];
        previousValue.push(registry = currentRegistry);
        return previousValue;
      }, <IRegistry[]>[]).map((registry) => {
        return _(registry.transformProperties)
          .map((path) => {
            var lastContractObjs: any[];
            var lastPath: string;
            var contracts = _([
              _(path).split("[]").reduce((previous, current, index) => {
                if (!current) {
                  return previous;
                }
                lastContractObjs = _.flatten(previous);
                lastPath = current;
                return _.map(lastContractObjs, current);
              }, [cloneContract])
            ]).flatten();
            var pairs = contracts.zip(lastContractObjs);
            pairs.each((item) => item.push(lastPath));
            return pairs.value().map((pair: [IContract, Object]): { contract: IContract, obj: Object, path: string } => {
              return { contract: pair[0], obj: pair[1], path: lastPath };
            });
          })
          .flatten<{ contract: IContract, obj: Object, path: string }>()
          .filter("contract")
          .each((pair) => {
            if (_.isArray(pair.contract))
              return _.set(pair.obj, pair.path, _(pair.contract).filter().map("_id").value());
            _.set(pair.obj, pair.path, _(pair.contract).result("_id"));
          });
      });
      return cloneContract;

    }
    private static load(contract: IContract): Q.Thenable<IContract> {
      var registry: IRegistry;
      var promises = _(contract.roles).reduce((previousValue, currentValue, index) => {
        var currentRegistry = DataContext.registryStringMap[<any>currentValue];
        previousValue.push(registry = currentRegistry);
        return previousValue;
      }, <IRegistry[]>[]).map((registry: IRegistry) => {
        let thing = _(registry.transformProperties).map(path => {
          var lastContractObjs: any[];
          var lastPath: string;
          var ids = _([
            _(path).split("[]").reduce((previous, current, index) => {
              if (!current) {
                return previous;
              }
              lastContractObjs = _.flatten(previous);
              lastPath = current;
              return _.map(lastContractObjs, current);
            }, [contract])
          ]).flatten();
          var pairs = ids.zip(lastContractObjs);
          pairs.each((item) => item.push(lastPath));
          return pairs.map((pair: [string, Object, string]) => {
            return { id: pair[0], obj: pair[1], path: lastPath };
          }).value();
        });
        return _(registry.transformProperties)
          .map((path) => {
            var lastContractObjs: any[];
            var lastPath: string;
            var ids = _([
              _(path).split("[]").reduce((previous, current, index) => {
                if (!current) {
                  return previous;
                }
                lastContractObjs = _.flatten(previous);
                lastPath = current;
                return _.map(lastContractObjs, current);
              }, [contract])
            ]).flatten();
            var pairs = ids.zip(lastContractObjs);
            pairs.each((item) => item.push(lastPath));
            return pairs.value().map((pair: [string, Object]): { id: string, obj: Object, path: string } => {
              return { id: pair[0], obj: pair[1], path: lastPath };
            });
          })
          .flatten<{ id: string | string[], obj: Object, path: string }>()
          .filter("id")
          .map((pair) => {
            if (_.isArray(pair.id)) {
              return Q.all(pair.id.filter(_.identity).map(getOrReturnInstance))
                .then(childContracts => _.set(pair.obj, pair.path, childContracts));
            }
            return getOrReturnInstance(<string>pair.id).then((childContract) => {
              _.set(pair.obj, pair.path, childContract);
            });
          })
          .value();
      });
      return Q.all(_.flatten(<any>promises)).then(() =>
        new registry.contractConstructor(contract)
      );
    }
    private static registryStringMap: { [id: string]: IRegistry; } = {};
    private static registryCtorMap = [] as [ContractConstructor, IRegistry][];
    private static registerCallBack = [] as Function[];
    public static register<TContract>(name: string, baseCtors: Contract.ContractConstructor[] = []) {
      return (constructor: ContractConstructor) => {
        var proto: any;
        var contractNames: string[] = [];

        var registry = DataContext.registryStringMap;
        baseCtors.forEach((baseCtor) => {
          contractNames = contractNames.concat(registry[(<any>baseCtor).contractName].roles);
          Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            name === "constructor" || (constructor.prototype[name] = baseCtor.prototype[name]);
          });
        });
        (<any>constructor).contractName = name;
        contractNames = _.uniq(contractNames).concat(name);

        if (!registry[name]) {
          registry[name] = {
            contractConstructor: constructor,
            transformProperties: [] as string[],
            roles: contractNames
          };
          this.registryCtorMap.push([
            constructor,
            registry[name]
          ]);
        }
        else if (registry[name].contractConstructor != constructor) {
          throw new Error(`A contract has already registered the name ${name}`);
        }
        this.registerCallBack.forEach((func) => func());
        this.registerCallBack = [] as Function[];
      }
    }

    public static entityProperty<TContract extends Contract, TKey extends keyof TContract = keyof TContract>(path: TKey) {
      const paths = [path] as string[];
      let _this = this;
      let visitor: RegisterType & VisitorMixin<TContract, TKey>;
      let pluck: VisitorMixin<TContract, TKey> = {
        Pluck: (path) => { paths.push(`.${path}`); return <any>visitor },
        ArrPluck: (path) => { paths.push(`[]${path}`); return <any>visitor }
      };

      visitor = Object.assign(<RegisterType>function <TSub, TSubKey extends keyof TSub>(constructor: ContractConstructor) {
        _this.registerCallBack.push(() => {
          _this.getRegistry(constructor).transformProperties.push(paths.join(""));
        });
      }, pluck);
      return visitor;
    }

    public static getRegistry(constructor: Function): IRegistry {
      return _(this.registryCtorMap).filter((pair) => pair[0] === constructor).first()[1]
    }
  }
  export type RegisterType = (constructor: ContractConstructor) => void;
  export interface VisitorMixin<T, K extends keyof T> {
    Pluck(path: K): RegisterType & VisitorMixin<T[K], keyof T[K]>,
    ArrPluck<TA, KA extends keyof TA = keyof TA>(path: KA | ""): RegisterType & VisitorMixin<TA[KA], keyof TA[KA]>;
  };
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
