import { Judge } from './../models/contracts/judges/judge';
import { User } from './../models/contracts/users/user';
import { DataContext } from '../models/contracts/dataContext';
import { ContractModule, ViewType } from './contractModule';
import { expect } from 'chai';
import { Container } from 'aurelia-framework';

describe('app', () => {
  it('should render navigation', function (done) {
    const container = new Container();
    container.registerInstance(DataContext, container.invoke(DataContext));
    container.registerInstance(ContractModule, container.invoke(ContractModule));
    const contractModule = container.get(ContractModule);
    const newUser = new User(container.get(DataContext));
    expect(contractModule.getView(newUser, ViewType.display))
      .to.deep.equal({
        viewModule: "users/user.view.html",
        viewModelModule: "users/user.view"
      });
    expect(contractModule.getView(newUser, ViewType.edit))
      .to.deep.equal({
        viewModule: "users/user.edit.html",
        viewModelModule: "users/user.edit"
      });

    const newJudge = new Judge(container.get(DataContext));
    expect(contractModule.getView(newJudge, ViewType.display))
      .to.deep.equal({
        viewModule: "users/judges/judge.view.html",
        viewModelModule: undefined
      });
    expect(contractModule.getView(newJudge, ViewType.edit))
      .to.deep.equal({
        viewModule: "users/judges/judge.edit.html",
        viewModelModule: "users/judges/judge.edit"
      });
    done();
  });
});
