define('jqglobal', [
    'jquery/src/core',
    'jquery/src/css',
    'jquery/src/data',
    'jquery/src/event',
    'jquery/src/wrap',
    'jquery/src/manipulation',
    'jquery/src/offset',
    'jquery/src/effects',
    'jquery/src/effects/animatedSelector',
    'jquery/src/css/hiddenVisibleSelectors',
    'jquery/src/event/focusin',
    'jquery/src/event/alias',
    'jquery/src/event/trigger',
    'jquery/src/attributes',
    'jquery/src/core/init',
    'jquery/src/core/parseHTML'], ($) => {
    global.jQuery = $;
    return $;
});