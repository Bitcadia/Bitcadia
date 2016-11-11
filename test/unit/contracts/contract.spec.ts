import { Contract, IContract } from '../../../src/models/contracts/contract';
import { expect } from 'chai';
import _ from 'lodash';
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
        expect((<any>Test).contractName).to.equal("Test");
        expect(registry["Test"].contractConstructor).to.equal(Test);
        expect(registry["Test"].subRegistry["SubTest"].contractConstructor).to.equal(SubTest);
        expect(registry["Test"].subRegistry["SubTest"].transformProperties).to.contain("subProperty");
        expect(registry["Test"].roles).to.members(["Test"]);
        expect(registry["Test"].subRegistry["SubTest"].roles).to.members(["Test", "SubTest"]);
    });
    it('Initializes', () => {
        var test = new Test({ signatures: [], property: "Thing", roles: null });
        expect(test.roles).to.contain("Test");
        expect(test.property).to.equal("Thing");
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
            expect(err.message).to.equal(`A contract has already registered the name Test`)
        }
    });
});

describe("The DataContext", () => {
    before(() => {
        var subTest1 = new SubTest({ property: "thing", signatures: [], subProperty: null });
        return Contract.DataContext.getInstance().destroy().then(() => {
            Contract.DataContext.instance = null;
            return Contract.DataContext.getInstance().put(Object.assign(subTest1, { _id: "subTest1" }));
        })
    });
    it('Loads a contract', () => {
        return Contract.DataContext.getInstance().get("subTest1").then((value) => {
            expect((<any>value).constructor).to.equal(SubTest);
        })
    });
});