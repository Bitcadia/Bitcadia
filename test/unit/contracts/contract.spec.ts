import { Contract, IContract } from '../../../src/models/contracts/contract';
export interface ITest extends IContract {
    property: string;
}
export interface ISubTest extends ITest {
    subProperty: ITest;
}

describe('The Contract', () => {
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
    var registry: { [id: string]: Contract.IRegistry; } = (<any>Contract.DataContext).registry
    it('Registers itself', () => {
        expect((<any>Test).contractName).toBe("Test");
        expect(registry["Test"].contractConstructor).toBe(Test);
        expect(registry["Test"].subRegistry["SubTest"].contractConstructor).toBe(SubTest);
        expect(registry["Test"].subRegistry["SubTest"].transformProperties).toContain("subProperty");
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