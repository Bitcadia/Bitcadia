import * as Q from 'bluebird';
import * as bs from 'bootstrap';
import { inject, customAttribute, DOM, dynamicOptions } from 'aurelia-framework';
import * as $ from 'jquery';
import * as _ from 'lodash';

type func = () => any;
@customAttribute('fo-attach')
@inject(Element)
@dynamicOptions()
export class bsAttach {
  el: any;
  options: any = {};
  attachFunc: func;
  throttleUpdate: (attach:func)=>any;
  reflow: boolean;
  constructor(el) {
    this.el = $(el);
  }
  attached() {
    this.throttleUpdate = _.debounce((func)=>{
      this.reflow = true;
      func();
    },5000);
    this.attachFunc && this.throttleUpdate(this.attachFunc);
  }
  propertyChanged(name, newValue, oldValue){
    this.options[name] = newValue;    
    let func = this.attachFunc = () => {
      let plugin = this.options['plugin'];
      if (plugin && !this.el.data('zfPlugin')) {
        bs[plugin] ? new bs[plugin](this.el, this.options) : this.el.bs();
      }
      if(this.reflow){
        (<any>bs).reflow(this.el,this.options['plugin']);
        this.reflow=false;
      }
      if (!newValue) {
        this.el.clear();
      }
    };
    this.throttleUpdate && this.throttleUpdate(func);    
  }
}