const MODULE_ID = 'decimal-options';

function _getSegmentLabel_Override(segment, totalDistance) {
    const units = canvas.scene.grid.units;
    const rulerAccuracy = 100 / (game.settings.get(MODULE_ID, 'ruler-accuracy'));
    let label = `${Math.round(segment.distance * rulerAccuracy) / rulerAccuracy} ${units}`;
    if ( segment.last ) {
      label += ` [${Math.round(totalDistance * rulerAccuracy) / rulerAccuracy} ${units}]`;
    }
    return label;
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
    })

const optionPermission = (game.settings.get(MODULE_ID, 'option-permission'));

    game.settings.register(MODULE_ID, 'ruler-accuracy', {
        name: 'Ruler text accuracy:',
        hint: 'All measurements are still done with 0.01 units accuracy, but the distance texts get rounded for better visibility. Especially useful on gridless scenes.',
        scope: optionPermission,
        config: true,
        type: Number,
        choices: {
            1: '0.01 distance units (Foundry default)',
            10: '0.1 distance units',
            50: '0.5 distance units',
            100: '1 distance unit',
        },
        default: 1,
    })
})

Hooks.once('setup', function () {

    libWrapper.register(MODULE_ID, 'Ruler.prototype._getSegmentLabel', _getSegmentLabel_Override, "OVERRIDE")

    console.log(`Decimal Options v2.0 | initialized`)
})


