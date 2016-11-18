var global = window;
require(['process'], (process) => {
    global.process = process;
});