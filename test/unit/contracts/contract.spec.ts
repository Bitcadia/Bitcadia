
        /*      },
      {
        "name": "test-bundle.js",
        "dependencies": [
          {
            "name": "pouchdb-memory",
            "path": "../node_modules/pouchdb/dist/",
            "main": "pouchdb.memory",
            "deps": [
              "pouchdb-browser"
            ]
          }
        ]*/
import { Contract, IContract } from '../../../src/models/contracts/contract';
export interface ITest extends IContract {
    property: string;
}
export interface ISubTest extends ITest {
    subProperty: ITest;
}

@Contract.DataContext.register("Test")
class Test<T extends ITest> extends Contract<T> implements ITest {
    public get property(): string {
        return this.entity.property;
    }
    public set property(v: string) {
        this.entity.property = v;
    }
}

@Contract.DataContext.register("SubTest")
class SubTest extends Test<ISubTest> implements ISubTest {
    public get property(): string {
        return this.entity.property;
    }
    public set property(v: string) {
        this.entity.property = v;
    }

    @Contract.DataContext.entityProperty("subProperty")
    public get subProperty(): ITest {
        return this.entity.subProperty;
    }
    public set subProperty(v: ITest) {
        this.entity.subProperty = v;
    }
}
describe('The Contract', () => {
    var registry: { [id: string]: Contract.IRegistry; } = (<any>Contract.DataContext).registry
    it('Registers itself', () => {
        expect((<any>Test).contractName).toBe("Test");
        expect(registry["Test"].contractConstructor).toBe(Test);
        expect(registry["Test"].subRegistry["SubTest"].contractConstructor).toBe(SubTest);
        expect(registry["Test"].subRegistry["SubTest"].transformProperties).toContain("subProperty");
    });
    it('Initializes', () => {
        var test = new Test({ signatures: [], property: "Thing", roles: null });
        expect(test.roles).toContain("Test");
        expect(test.property).toBe("Thing");
    });
    it('Fails to Register', () => {
        try {
            @Contract.DataContext.register("Test")
            class Test2 extends Contract<ITest> implements ITest {
                public get property(): string {
                    return this.entity.property;
                }
                public set property(v: string) {
                    this.entity.property = v;
                }
            }
        }
        catch (err) {
            expect(err.message).toBe(`A contract has already registered the name Test`)
        }
    });
});

/*describe("The DataContext", () => {
    it('Loads a contract', () => {
        Contract.DataContext.getInstance({ adapter: 'memory' }).get("subTest1").then((value) => {
            expect((<any>value).constructor).toBe(SubTest);
        })
    })
})*/