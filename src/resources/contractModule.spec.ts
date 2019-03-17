import { User } from './../models/contracts/users/user';
import { ContractModule } from './contractModule';
import { expect } from 'chai';

describe('app', () => {
  it('should render navigation', function (done) {
    expect(ContractModule.getView(new User(null), 'view')[0]).to.equal("users/user.view.html");
    expect(ContractModule.getView(new User(null), 'edit')[0]).to.equal("users/user.edit.html");
    done();
  });
});
