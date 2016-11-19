import { bindable, customElement } from 'aurelia-framework';

@customElement('menu')
export class Menu {
    @bindable tabs = null;

    constructor(el) {
        this.id = el.id;
    }

    attached() {
        //$(`#${this.id}`).dropdown();
    }
}