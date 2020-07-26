import { autoinject } from 'aurelia-dependency-injection';
import { AppRouter } from 'aurelia-router';
import { View } from '../resources/contractModule';
import { RouteNames } from '../app';

@autoinject
export default class RegistrationView implements View {
  public fullView: RouteNames;
  constructor(public appRouter: AppRouter) { }
  public activate() { }
}
