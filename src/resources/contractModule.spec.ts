import { Federation } from './../models/contracts/federations/federation';
import { Challenge } from './../models/contracts/challenges/challenge';
import { Claim } from './../models/contracts/claims/claim';
import { Judge } from './../models/contracts/judges/judge';
import { User } from './../models/contracts/users/user';
import { ContractModule, ViewType } from './contractModule';
import { expect } from 'chai';

describe('app', () => {
  it('should render navigation', function (done) {
    expect(ContractModule.getView(new User(null), ViewType.view)[0]).to.equal("users/user.view.html");
    expect(ContractModule.getView(new User(null), ViewType.edit)[0]).to.equal("users/user.edit.html");
    expect(ContractModule.getView(new Judge(null), ViewType.view)[0]).to.equal("judges/judge.view.html");
    expect(ContractModule.getView(new Judge(null), ViewType.edit)[0]).to.equal("judges/judge.edit.html");
    expect(ContractModule.getView(new Claim(null), ViewType.view)[0]).to.equal("claims/claim.view.html");
    expect(ContractModule.getView(new Claim(null), ViewType.edit)[0]).to.equal("claims/claim.edit.html");
    expect(ContractModule.getView(new Challenge(null), ViewType.view)[0]).to.equal("challenges/challenge.view.html");
    expect(ContractModule.getView(new Challenge(null), ViewType.edit)[0]).to.equal("challenges/challenge.edit.html");
    expect(ContractModule.getView(new Federation(null), ViewType.view)[0]).to.equal("federations/federation.view.html");
    expect(ContractModule.getView(new Federation(null), ViewType.edit)[0]).to.equal("federations/federation.edit.html");
    done();
  });
});
