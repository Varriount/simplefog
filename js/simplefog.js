import SimplefogLayer from '../classes/SimplefogLayer.js';
import sightLayerRefresh from './sightLayerRefresh.js';
import SimplefogMigrations from '../classes/SimplefogMigrations.js';
import config from './config.js';
import { simplefogLog } from './helpers.js';

Hooks.once('init', () => {
  // eslint-disable-next-line no-console
  simplefogLog('Initializing simplefog', true);

  // Register global module settings
  config.forEach((cfg) => {
    game.settings.register('simplefog', cfg.name, cfg.data);
  });
});

Hooks.once('canvasInit', () => {
  // Add SimplefogLayer to canvas
  const layerct = canvas.stage.children.length;
  canvas.simplefog = canvas.stage.addChildAt(new SimplefogLayer(), layerct);
});

Hooks.on('canvasInit', () => {
  canvas.simplefog.init();
});

/*
 * Apply compatibility patches
 */
Hooks.once('ready', () => {
  // Check if any migrations need to be performed
  SimplefogMigrations.check();
  // Monkeypatch SightLayer to check simplefog vision on refresh
  if (game.data.version.startsWith('0.6')) {
    const origRefresh = canvas.sight.refresh;
    canvas.sight.refresh = function refresh(...args) {
      origRefresh.call(this, ...args);
      sightLayerRefresh();
    };
    canvas.sight.refresh();
  }
  else {
    const origRefresh = canvas.sight.refresh;
    canvas.sight.refresh = function refresh(...args) {
      origRefresh.call(this, ...args);
      sightLayerRefresh();
    };
    canvas.sight.refresh();
  }
});
