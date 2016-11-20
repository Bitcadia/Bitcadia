define('jqglobal', [
    'jquery/src/core',
    'jquery/src/css',
    'jquery/src/data',
    'jquery/src/attributes',
    'jquery/src/manipulation',
    'jquery/src/event/trigger',
    'jquery/src/core/init',
    'jquery/src/core/parseHTML'], ($) => {
    global.jQuery = $;
    return $;
});