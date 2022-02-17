const MODULE_ID = 'decimal-options';

function _getSegmentLabel_Override(segmentDistance, totalDistance, isTotal) {
    const units = canvas.scene.data.gridUnits;
    const rulerAccuracy = 100 / (game.settings.get(MODULE_ID, 'ruler-accuracy'));
    let label = `${Math.round(segmentDistance * rulerAccuracy) / rulerAccuracy} ${units}`;
    if ( isTotal ) {
      label += ` [${Math.round(totalDistance * rulerAccuracy) / rulerAccuracy} ${units}]`;
    }
    return label;
  }

Hooks.once('init', function () {
  game.settings.register(MODULE_ID, 'ruler-accuracy', {
    name: 'Ruler text accuracy:',
    hint: 'All measurements are still done with 0.01 units accuracy, but the distance texts get rounded for better visibility. Especially useful on gridless scenes.',
    scope: 'client',
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

libWrapper.register(MODULE_ID, 'Ruler.prototype._getSegmentLabel', _getSegmentLabel_Override, "OVERRIDE")

console.log(`Ruler Decimals | initialized`)
})


