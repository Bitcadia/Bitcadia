import { RouterConfiguration, Router, AppRouter } from 'aurelia-router';

export class UserRouter {
    router: Router;

    public static configureRouter(config: RouterConfiguration, router: Router): void {
        config.title = "shell:users";
        config.map([
            { route: '', name: 'users', title: 'shell:users', moduleId: 'users/index', nav: true },
            { route: 'users/create', name: 'create', title: 'shell:create', moduleId: 'users/create', nav: true },
            { route: 'users/:id/detail', name: 'userDetail', title: 'shell:userDetail', moduleId: 'users/detail' },
        ]);
        config.mapUnknownRoutes('not-found');
    }
    public configureRouter(config: RouterConfiguration, router: Router): void {
        this.router = router;
        UserRouter.configureRouter(config, router);
    }
}
