import { customAttribute, inject } from 'aurelia-framework';
import { RenderedError } from 'aurelia-validation';
import { BindingEngine, Disposable } from 'aurelia-binding';

@inject(Element, BindingEngine)
@customAttribute('valid')
export class valid {
  value: RenderedError[];
  lastValue: RenderedError[];
  arrSubscription: Disposable;
  propSubscription: Disposable;
  constructor(private element: HTMLInputElement, private engine: BindingEngine) {
  }
  bind() {
    if (!this.value) {
      return;
    }
    if (this.value !== this.lastValue) {
      this.arrSubscription && this.arrSubscription.dispose();
      this.propSubscription && this.propSubscription.dispose();
      this.arrSubscription = this.engine.collectionObserver(this.value).subscribe(this.bind.bind(this));
      this.propSubscription = this.engine.propertyObserver(this, 'value').subscribe(this.bind.bind(this));
      this.lastValue = this.value;
    }
    if (this.value.length) {
      this.element.setCustomValidity(this.value[0].error.message);
      this.element.classList.add('is-invalid');
    }
    else {
      this.element.setCustomValidity('');
      this.element.classList.remove('is-invalid');
    }
  }
}