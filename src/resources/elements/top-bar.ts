///<amd-dependency path="foundation"/>
import { bindable, customElement, containerless, inject } from 'aurelia-framework';
import * as $ from 'jquery';

@customElement('top-bar')
@inject(Element)
export class TopBar {
    @bindable navigation;
    public el:string;
    constructor(el:string) {
        this.el = el;
    }

    attached() {
         (<any>$(this.el)).foundation();
    }
}