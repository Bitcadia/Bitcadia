import { bindable, customElement } from 'aurelia-framework';
import * as marked from 'marked';

marked.setOptions({ sanitize: true });
@customElement('markdown')
export class Markdown {
  @bindable value;
  public content: string;

  constructor() {
    this.content = marked.parse("");
  }
  valueChanged(newValue, oldValue) {
    this.content = marked.parse(newValue || "");
  }
}

