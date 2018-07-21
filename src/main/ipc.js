import { app, ipcMain as ipc } from 'electron';

import * as windows from './windows';
import * as logger from './logger';
import { installUpdate } from './updater';

module.exports = {
  init
};

function init() {
  ipc.once('ipcReady', () => {
    app.ipcReady = true;

    ipcBridge();

    // Streamer communication
    ipc.on('stream:start', (event, torrentInfo) => {
      app.streamer.start(torrentInfo);
    });

    ipc.on('stream:stop', app.streamer.stop.bind(app.streamer));

    app.emit('ipcReady');
  });

  ipc.on('installUpdate', () => {
    installUpdate();
  });
}

/**
* Setup IPC and the IPC bridge between renderer and torrent engine
*/
function ipcBridge() {
  logger.info('ipc: Baking IPC bridge...');

  /**
  * IPC Bridge
  * Inspired by WebTorrent Desktop
  *
  * We actually just extend the default ipc.emit function
  */
  const defaultEmit = ipc.emit;
  ipc.emit = (name, e, ...args) => {
    if (name.startsWith('te-')) {
      if (e.sender.browserWindowOptions.title === 'MovieCast Torrent Engine') {
        // Send message to main window
        windows.app.send(name, ...args);
        logger.debug(`ipc: ipcBridge: torrentWindow -> mainWindow: ${name}`);
      } else {
        // Send message to webtorrent window
        windows.engine.send(name, ...args);
        logger.debug(`ipc: ipcBridge: mainWindow -> torrentWindow: ${name}`);
      }
    }

    // Emit all other events normally
    defaultEmit.call(ipc, name, e, ...args);
  };

  logger.info('ipc: IPC bridge baked.');
}
