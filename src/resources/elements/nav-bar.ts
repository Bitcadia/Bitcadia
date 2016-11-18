import { bindable, customElement, containerless, inject } from 'aurelia-framework';
import jq = require('jquery');

@inject(Element)
@containerless()
@customElement('nav-bar')
export class NavBar {
    @bindable navigation;
    @bindable group;
    parents: any[]=[];
    constructor(el){
    }
}