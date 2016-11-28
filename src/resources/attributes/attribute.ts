import { inject, customAttribute, dynamicOptions } from 'aurelia-framework';
import jq =require('jquery');

type func = () => any;
@customAttribute('attribute')
@inject(Element)
@dynamicOptions()
export class Attribute {
  el: JQuery;
  constructor(el) {
    this.el = <any>jq(el);
  }
  propertyChanged(name, newValue, oldValue){
     this.el.prop(name,newValue);
  }
}