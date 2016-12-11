import { ParentNavModel } from '../../../../src/app';
import { expect } from 'chai';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';

import * as testUtil from '../../util.js';

/**
 * Make all nested properties in T optional
 */
type NestedPartial<T> = {
[P in keyof T]?: NestedPartial<T[P]>;
};

describe('Element "nav-bar"', () => {
    let component;
    let model: { groupedNavigation: NestedPartial<ParentNavModel>[] };
    beforeEach((done) => {
        component = StageComponent
            .withResources('resources/elements/nav-bar')
            .inView(`<nav-bar navigation.bind="groupedNavigation"></nav-bar>`)
            .boundTo(model = {
                groupedNavigation: [
                    {
                        settings: {
                            group: "Thing",
                            children: [
                                {
                                    isActive: false,
                                    title: "shell:C1",
                                    href: "#Stuff"
                                },
                                {
                                    isActive: false,
                                    title: "shell:C2",
                                    href: "#OtherStuff"
                                }
                            ]
                        },
                        isActive: false,
                        title: "shell:P1",
                        href: "#"
                    }]
            });
        component.configure = (aurelia) => {
            return aurelia.use.standardConfiguration().plugin('aurelia-i18n', () => { });
        };
        component.create(bootstrap).then(() => done());
    });
    it('should submit', function (done) {
        expect(component.element).to.exist;
        testUtil.waitUntil(() => !!component.element.innerHTML)
            .then((htmlFound) => {
                expect(htmlFound).to.be.true;
                expect(~component.element.innerHTML.indexOf(`href="#"`)).to.not.eq(0);
                expect(~component.element.innerHTML.indexOf(`href="#Stuff"`)).to.not.eq(0);
                expect(~component.element.innerHTML.indexOf(`href="#OtherStuff"`)).to.not.eq(0);
                done();
            });
    });
    afterEach(() => {
        component.dispose();
    });
});