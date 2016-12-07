import { util } from '~chai/lib/Chai';
import { expect } from 'chai';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { ContractModule } from '../../../../src/resources/contractModule';
import * as testUtil from '../../util.js';
import * as jq from 'jquery';
import { TemplateRegistryEntry } from 'aurelia-loader';

describe('Element "contract"', () => {
    let component;
    let model;
    before(() => {
        global['define']('text!thing.edit.html', ['module'], (module) =>
            module.exports = `<template bindable="contract"><input type="text" class="firstName" value.bind="contract.name"/></template>`);
        global['define']('text!thing.view.html', ['module'], (module) =>
            module.exports = `<template bindable="contract"><span class="firstName">\${contract.name}</span></template>`);
        /*        var edit = new TemplateRegistryEntry("thing.edit.html");
                var view = new TemplateRegistryEntry("thing.view.html");*/

        var map: Map<string, string>;
        ContractModule.instance["map"].set("edit", map = new Map());
        map.set(["Thing"].join('.'), 'thing.html');

        ContractModule.instance["map"].set("view", map = new Map());
        map.set(["Thing"].join('.'), 'thing.html');
    });
    beforeEach((done) => {
        component = StageComponent
            .withResources('resources/elements/contract')
            .inView(`<contract contract.bind="contract" type.bind="edit?'edit':'view'"></contract>`)
            .boundTo(model = {
                contract: {
                    roles: ["Thing"],
                    name: ""
                },
                edit: false
            });
        component.create(bootstrap).then(() => done());
    });
    it('should set html', function (done) {
        expect(component.element).to.exist;
        testUtil.waitUntil(() => !!component.element.innerHTML)
            .then((htmlFound) => {
                expect(htmlFound).to.be.true;
                model.contract.name = "SomeName";
                return testUtil.waitUntil(() => !!~component.element.innerHTML.indexOf("SomeName"))
            }).then((foundName) => {
                expect(foundName).to.true;
                model.edit = true;
                return testUtil.waitUntil(() => !!~component.element.innerHTML.indexOf("input"))
            }).then((foundInput) => {
                expect(foundInput).to.be.true;
                var input = document.querySelector("input");
                input.value = "Other";
                input.dispatchEvent(new Event('input'));
                return testUtil.waitUntil(() => model.contract.name == "Other")
            }).then((valueChanged) => {
                expect(valueChanged).to.be.true;
                done()
            });
    });
    afterEach(() => {
        component.dispose();
    });
    after(() => {
        global["require"]["undef"]('text!thing.edit.html')
        global["require"]["undef"]('text!thing.edit.html')
        ContractModule.instance["map"] = new Map();
    });
});