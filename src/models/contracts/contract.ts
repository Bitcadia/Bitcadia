import { Container } from 'aurelia-framework';
import { DataContext } from './dataContext';

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

/**
 * The base contract implementation
 */
export abstract class Contract<I extends IContract> implements IContract {
  constructor(dataContext: DataContext, entity?: I) {
    Object.assign(this, entity);
    this.signatures = this.signatures || [];
    this.roles = dataContext.getRegistry(this.constructor).roles;
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
}
