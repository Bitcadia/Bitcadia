import { SignedActor } from '../../../src/models/contracts/actors/signed';
import { FreeActor } from '../../../src/models/contracts/actors/free';
import { ContractModule } from '../../../src/resources/contractModule';
import { expect } from 'chai'
describe('app', () => {
  it('should render navigation', function (done) {
    expect(ContractModule.getView(new FreeActor(null), 'view')).to.equal("users/free-actor.view.html");
    expect(ContractModule.getView(new SignedActor(null), 'view')).to.equal("users/signed-actor.view.html");
    expect(ContractModule.getView(new FreeActor(null), 'edit')).to.equal("users/free-actor.edit.html");
    expect(ContractModule.getView(new SignedActor(null), 'edit')).to.equal("users/signed-actor.edit.html");
    done();
  });
});