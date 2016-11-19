var global = window;
require(['process'], (process) => {
    global.process = process;
})
define('prefoundation', ['jquery'], ($) => {
    global.jQuery = $;
});