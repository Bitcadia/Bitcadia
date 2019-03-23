import _ = require('lodash');
import Q = require('bluebird');
import PouchDB = require('pouchdb');
import Find = require('pouchdb-find');
import Transform = require('transform-pouch');
import { _isAllWhitespace } from "../../../scripts/aurelia-templating/dist/commonjs/aurelia-templating";

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
export abstract class Contract<I extends IContract> implements IContract {
  constructor(entity?: I) {
    Object.assign(this, entity);
    this.signatures = this.signatures || [];
    this.roles = this.roles || Contract.DataContext.getRegistry((<any>this).constructor).roles;
  }

  /**
   * The contract lookup
   */
  public _id: string;

  /**
   * The contract revision
   */
  public _rev: string;

  /**
   * The roles the contract fills
   */
  public roles: string[];

  /**
   * The signatures on the contract
   */
  public signatures: string[];

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

  export interface IContractCtor<TIContract extends IContract, TContract extends Contract<TIContract>> {
    new(contract: TIContract): TContract;
  }
  export interface IRegistry {
    contractConstructor: IContractCtor<IContract, Contract<IContract>>;
    transformProperties?: ContractMap<IContract>;
    roles: string[];
  }

  interface SaveOrLoad {
    key: string | number;
    location: Object | Array<any>;
    val?: IContract | string;
  }
  function traverseContract<TIContract extends IContract>(obj: ContractMap<TIContract> | true, contract: TIContract | string) {
    return Object.keys(obj).reduce((previous, key) => {
      if (obj[key] === true) {
        return contract[key] ? previous.concat({
          key: key,
          location: contract,
          val: contract[key]
        }) : previous;
      }
      if (_.isArray(obj[key])) {
        return (contract[key] as Array<any>).reduce((previous, subContract, indexKey) => {
          if (!subContract) {
            return previous;
          }
          return obj[key][0] === true ?
            previous.concat({ key: indexKey, location: contract[key], val: subContract }) :
            previous.concat(traverseContract(obj[key][0], subContract));
        }, previous);
      }
      if (_.isObject(obj[key])) {
        return previous.concat(traverseContract(obj[key], contract[key]));
      }
      return previous;
    }, [] as SaveOrLoad[]);
  }

  export class DataContext {
    public static instance: PouchDB.Database<IContract>;
    public static getContracts<TIContract extends IContract>(contractCtor: IContractCtor<TIContract, Contract<TIContract>>): Promise<TIContract[]> {
      return Contract.DataContext.getInstance().allDocs({
        include_docs: true,
        attachments: true
      }).then((results) => {
        return results.rows.map((item) => <any>item.doc as TIContract)
          .filter((ref) => {
            const roles = ref.roles;
            return ~roles.indexOf(_.last(DataContext.getRegistry(contractCtor).roles));
          });
      });
    }
    public static getInstance(): PouchDB.Database<IContract> {
      const instance = DataContext.instance || (DataContext.instance = new PouchDB('contract', {
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
      const cloneContract: IContract = JSON.parse(JSON.stringify(contract));
      _(cloneContract.roles).reduce((previousValue, currentValue, index, array) => {
        const currentRegistry = DataContext.registryStringMap[currentValue];
        previousValue.push(currentRegistry);
        return previousValue;
      }, <IRegistry[]>[]).map((registry) => {
        traverseContract(registry.transformProperties, contract).forEach((saveOrLoad) => {
          saveOrLoad.location[saveOrLoad.key] = (saveOrLoad.val as IContract)._id;
        });
      });
      return cloneContract;
    }

    private static load(contract: IContract): Q.Thenable<IContract> {
      let registry: IRegistry;
      const promises = _(contract.roles).reduce((previousValue, currentValue, index) => {
        const currentRegistry = DataContext.registryStringMap[<any>currentValue];
        previousValue.push(registry = currentRegistry);
        return previousValue;
      }, <IRegistry[]>[]).map((registry: IRegistry) => {
        return Q.all(traverseContract(registry.transformProperties, contract).map((saveOrLoad) => {
          return getOrReturnInstance((saveOrLoad.val as IContract)._id)
            .then((contract) => saveOrLoad.location[saveOrLoad.key] = contract);
        }));
      });
      return Q.all(promises).then(() => new registry.contractConstructor(contract));
    }
    private static registryStringMap: { [id: string]: IRegistry; } = {};
    private static registryCtorMap = [] as [IContractCtor<IContract, Contract<IContract>>, IRegistry][];
    private static registerCallBack = [] as Function[];
    public static register(name: string, baseCtors: Contract.IContractCtor<IContract, Contract<IContract>>[] = []) {
      return (constructor: IContractCtor<IContract, Contract<IContract>>) => {
        let contractNames: string[] = [];

        const registry = DataContext.registryStringMap;
        baseCtors.forEach((baseCtor) => {
          contractNames = contractNames.concat(registry[(<any>baseCtor).contractName].roles);
          Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            name === "constructor" || (constructor.prototype[name] = baseCtor.prototype[name]);
          });
        });
        (<any>constructor).contractName = name;
        contractNames = _.uniq(contractNames).concat(name);

        if (!registry[name]) {
          registry[name] = {
            contractConstructor: constructor,
            transformProperties: {} as ContractMap<IContract>,
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
      };
    }

    public static entityProperties<TIContract extends IContract, TContract extends Contract<TIContract>=Contract<TIContract>>(visitor: ContractMap<TContract extends Contract<TIContract> ? TIContract : IContract>) {
      const _this = this;
      return function (constructor: TIContract extends IContract ?
        IContractCtor<TIContract, TContract extends Contract<TIContract> ?
          TContract : Contract<TIContract>> : never) {
        _this.registerCallBack.push(() => {
          _this.getRegistry(constructor).transformProperties = visitor;
        });
      };
    }

    public static getRegistry(constructor: Function): IRegistry {
      return _(this.registryCtorMap).filter((pair) => pair[0] === constructor).first()[1];
    }
  }

  type ContractMap<TIContract extends IContract> = DeepContractMap<TIContract>;
  type DeepContractMap<Type> = {
    [Key in keyof Type]?: Type[Key] extends Primitive ? never :
    Type[Key] extends Array<infer ArrayType> ? (ArrayType extends IContract ? [true] : [DeepContractMap<ArrayType>]) :
    Type[Key] extends Object ? (Type[Key] extends IContract ? true : DeepContractMap<Type[Key]>) : never
  };
}

const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};
export class Key {
  public static currentKey: Key;
  constructor(key?: Key) {
    if (key) {
      this.pubKey = key.pubKey || this.pubKey;
      this.name = key.name;
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
