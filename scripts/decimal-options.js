const MODULE_ID = 'decimal-options';

// Wrapper for the standard distance Ruler
function _getWaypointLabelContext_Ruler_Wrapper(wrapped, waypoint, state) {
    const context = wrapped(waypoint, state);
    if ( !context ) return context;

    const nearest = game.settings.get(MODULE_ID, 'ruler-accuracy');
    const {measurement} = waypoint;

    context.distance.total = measurement.distance.toNearest(nearest).toLocaleString(game.i18n.lang);
    if ( context.distance.delta !== undefined ) {
        context.distance.delta = measurement.backward.distance.toNearest(nearest).signedString();
    }

    return context;
}

// Wrapper for the token-movement TokenRuler (also adjusts cost display)
function _getWaypointLabelContext_TokenRuler_Wrapper(wrapped, waypoint, state) {
    const context = wrapped(waypoint, state);
    if ( !context ) return context;

    const nearest = game.settings.get(MODULE_ID, 'ruler-accuracy');
    const {measurement} = waypoint;

    context.distance.total = measurement.distance.toNearest(nearest).toLocaleString(game.i18n.lang);
    if ( context.distance.delta !== undefined ) {
        context.distance.delta = measurement.backward.distance.toNearest(nearest).signedString();
    }

    const cost = measurement.cost;
    const deltaCost = waypoint.cost;
    context.cost.total = Number.isFinite(cost) ? cost.toNearest(nearest).toLocaleString(game.i18n.lang) : "\u221e";
    if ( context.cost.delta !== undefined ) {
        context.cost.delta = Number.isFinite(deltaCost) ? deltaCost.toNearest(nearest).signedString() : "\u221e";
    }

    return context;
}

Hooks.once('init', function () {
    game.settings.register(MODULE_ID, 'option-permission', {
        name: 'Can be set by:',
        hint: 'GM can force the setting to all players or they can be allowed to change it for themselves. Change reloads the world!',
        scope: 'world',
        config: true,
        type: String,
        choices: {
            world: 'GM only',
            client: 'Everyone for themselves',
        },
        default: 'world',
        onChange: () => location.reload(),
    });

    const optionPermission = game.settings.get(MODULE_ID, 'option-permission');

    game.settings.register(MODULE_ID, 'ruler-accuracy', {
        name: 'Ruler text accuracy:',
        hint: 'All measurements are still done with full accuracy, but the distance texts get rounded for better visibility. Especially useful on gridless scenes.',
        scope: optionPermission,
        config: true,
        type: Number,
        choices: {
            1:    '1 unit',
            0.5:  '0.5 units',
            0.1:  '0.1 units',
            0.01: '0.01 units (Foundry default)',
        },
        default: 0.01,
    });
});

Hooks.once('setup', function () {
    libWrapper.register(MODULE_ID, 'Ruler.prototype._getWaypointLabelContext', _getWaypointLabelContext_Ruler_Wrapper, 'WRAPPER');
    libWrapper.register(MODULE_ID, 'foundry.canvas.placeables.tokens.TokenRuler.prototype._getWaypointLabelContext', _getWaypointLabelContext_TokenRuler_Wrapper, 'WRAPPER');

    // Some game systems (e.g. D&D 5e) register a TokenRuler subclass that overrides
    // _getWaypointLabelContext without calling super, bypassing the base-class wrapper above.
    // Detect that case and patch the active ruler class directly.
    const rulerClass = CONFIG.Token.rulerClass;
    const baseRulerClass = foundry.canvas.placeables.tokens.TokenRuler;
    if ( rulerClass !== baseRulerClass
            && Object.prototype.hasOwnProperty.call(rulerClass.prototype, '_getWaypointLabelContext') ) {
        const original = rulerClass.prototype._getWaypointLabelContext;
        rulerClass.prototype._getWaypointLabelContext = function(waypoint, state) {
            return _getWaypointLabelContext_TokenRuler_Wrapper(original.bind(this), waypoint, state);
        };
    }

    console.log(`Decimal Options v4.0 | initialized`);
});
