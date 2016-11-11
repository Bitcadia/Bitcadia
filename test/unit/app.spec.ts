import { App } from '../../src/app';
import { expect } from 'chai';

describe('the app', () => {
  it('says hello', () => {
    expect(new App().message).to.equal('Hello World!');
  });
});
