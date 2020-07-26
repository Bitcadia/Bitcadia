import _ = require('lodash');
import { singleton, autoinject } from "aurelia-framework";
import Q = require('bluebird');
import PouchDB = require('pouchdb');
import Find = require('pouchdb-find');
import Transform = require('transform-pouch');
import { IContract, Contract } from "./contract";

PouchDB.plugin(Transform);
PouchDB.plugin(Find);
type PouchDBExt = PouchDB.Database<IContract> & {
  transform?(opts: {
    incoming(contract: IContract): PromiseLike<IContract>;
    outgoing(contract: IContract): PromiseLike<IContract>;
  }): PouchDBExt;
};

interface IDBType {
  Cart?: PouchDB.Database<IContract>;
  Signed?: PouchDB.Database<IContract>;
  Account?: PouchDB.Database<IContract>;
}
export type DBType = keyof IDBType;
function getOrReturnInstance(context: DataContext,
  idOrInstance: string | Contract<IContract>,
  dbtype: DBType): Promise<IContract> {
  return _.isString(idOrInstance) ?
    context.getInstance(dbtype).get<IContract>(idOrInstance).catch(() => null) :
    new Promise((res) => res(idOrInstance));
}

export interface IContractCtor<TIContract extends IContract, TContract extends Contract<TIContract>> {
  contractName: string;
  new(dataContext: DataContext, contract: TIContract): TContract;
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
function traverseContract<TIContract extends IContract>(obj: ContractMap<TIContract> | true, contract: TIContract | string): SaveOrLoad[] {
  return Object.keys(obj || {}).reduce<SaveOrLoad[]>((previous, key) => {
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
  }, []);
}

@singleton()
@autoinject()
export class DataContext {
  private static registrationCallbacks: ((context: DataContext) => void)[] = [];
  private static propertyCallbacks: ((context: DataContext) => void)[] = [];
  private static instances: DataContext[] = [];
  constructor() {
    DataContext.registrationCallbacks
      .concat(DataContext.propertyCallbacks)
      .forEach((cb) => cb(this));

    DataContext.instances.push(this);
  }
  public instance: IDBType = {};
  public async getContracts<TIContract extends IContract>(contractCtor: IContractCtor<TIContract, Contract<TIContract>>, dbtype: DBType): Promise<TIContract[]> {
    const results = await this.getInstance(dbtype).allDocs({
      include_docs: true,
      attachments: true
    });
    return results.rows.map((item) => (item.doc as any) as TIContract)
      .filter((ref) => {
        const roles = ref.roles as string[];
        return ~roles.indexOf(_.last(this.getRegistry(contractCtor).roles));
      });
  }
  public getInstance(dbtype: DBType,): PouchDB.Database<IContract> {
    if (this.instance[dbtype]) {
      return this.instance[dbtype];
    }
    const instance: PouchDBExt = new PouchDB(dbtype, {
      adapter: "idb"
    });
    instance.transform({
      incoming: (contract: IContract) => {
        return this.save(contract);
      },
      outgoing: (contract: IContract) => {
        return this.load(contract, dbtype);
      }
    });
    return this.instance[dbtype] = instance;
  }

  private async save(contract: IContract) {
    const cloneContract: IContract = JSON.parse(JSON.stringify(contract));
    _(cloneContract.roles).reduce((previousValue, currentValue) => {
      const currentRegistry = this.registryStringMap[currentValue];
      previousValue.push(currentRegistry);
      return previousValue;
    }, [] as IRegistry[]).map((registry) => {
      traverseContract(registry.transformProperties, contract).forEach((saveOrLoad) => {
        saveOrLoad.location[saveOrLoad.key] = (saveOrLoad.val as IContract)._id;
      });
    });
    await cloneContract.roles;
    return cloneContract;
  }

  private load(contract: IContract, dbtype: DBType): Q.Thenable<IContract> {
    let registry: IRegistry;
    const promises = _(contract.roles).reduce((previousValue, currentValue, index) => {
      const currentRegistry = this.registryStringMap[<any>currentValue];
      previousValue.push(registry = currentRegistry);
      return previousValue;
    }, [] as IRegistry[]).map((registry: IRegistry) => {
      return Q.all(traverseContract(registry.transformProperties, contract).map((saveOrLoad) => {
        return getOrReturnInstance(this, (saveOrLoad.val as IContract)._id, dbtype)
          .then((contract) => saveOrLoad.location[saveOrLoad.key] = contract);
      }));
    });
    return Q.all(promises).then(() => new registry.contractConstructor(this, contract));
  }
  private registryStringMap: { [id: string]: IRegistry; } = {};
  private registryCtorMap = [] as [IContractCtor<IContract, Contract<IContract>>, IRegistry][];
  private registerCallBack = [] as Function[];

  public static register(baseCtors: IContractCtor<IContract, Contract<IContract>>[] = []) {
    return (constructor: IContractCtor<IContract, Contract<IContract>>) => {
      const callback = (dx: DataContext) => {
        const name = constructor.name;
        let contractNames: string[] = [];
        const registry = dx.registryStringMap;
        baseCtors.forEach((baseCtor) => {
          contractNames = contractNames.concat(registry[(baseCtor).contractName].roles);
          Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            name === "constructor" || (constructor.prototype[name] = baseCtor.prototype[name]);
          });
        });
        contractNames = _.uniq(contractNames).concat(name);

        if (!registry[name] || !registry[name].roles) {
          dx.putRegistry(constructor, { roles: contractNames });
        }
        else if (registry[name].contractConstructor != constructor) {
          throw new Error(`A contract has already registered the name ${name}`);
        }
        const regPromise = Q.all(dx.registerCallBack.map((func) => func()));
        dx.registerCallBack = [] as Function[];
        return regPromise;
      };
      DataContext.registrationCallbacks.push(callback);
      DataContext.instances.forEach(callback);
    };
  }

  public static entityProperties<TIContract extends IContract, TContract extends Contract<TIContract> = Contract<TIContract>>(visitor: ContractMap<TContract extends Contract<TIContract> ? TIContract : IContract>) {
    return function (constructor: TIContract extends IContract ?
      IContractCtor<TIContract, TContract extends Contract<TIContract> ?
        TContract : Contract<TIContract>> : never) {
      const callback = (dx: DataContext) => {
        dx.putRegistry(constructor, { transformProperties: visitor });
      };
      DataContext.propertyCallbacks.push(callback);
      DataContext.instances.forEach(callback);
    };
  }
  private putRegistry(constructor: IContractCtor<IContract, Contract<IContract>>, create: { transformProperties?: ContractMap<IContract>, roles?: string[] }) {
    const name = constructor.name;
    const registry = this.registryStringMap;
    if (!registry[name]) {
      registry[name] = {
        contractConstructor: constructor,
        transformProperties: null,
        roles: null,
      };
      this.registryCtorMap.push([
        constructor,
        registry[name]
      ]);
    }
    Object.assign(registry[name], create);
  }
  public getRegistry(constructor: Function): IRegistry {
    const pair = _(this.registryCtorMap).filter((pair) => pair[0] === constructor).first();
    return pair && pair[1];
  }
}

type ContractMap<TIContract extends IContract> = DeepContractMap<TIContract>;
type DeepContractMap<Type> = {
  [Key in keyof Type]?: Type[Key] extends Primitive ? never :
  Type[Key] extends Array<infer ArrayType> ? (ArrayType extends IContract ? [true] : [DeepContractMap<ArrayType>]) :
  Type[Key] extends Object ? (Type[Key] extends IContract ? true : DeepContractMap<Type[Key]>) : never
};
