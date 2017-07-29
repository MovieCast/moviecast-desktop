/* eslint-disable global-require */
import { app, dialog } from 'electron';
import { promisifyAll } from 'bluebird';
import path from 'path';
import jsonStorage from 'electron-json-storage';

import StoreFactory, { SCOPE_MAIN } from '../shared/store/StoreFactory';
import WindowFactory from './WindowFactory';
import MenuFactory from './MenuFactory';
import ExtensionFactory from './ExtensionFactory';

export default class Application {
  /**
   * Bootstrap application, will return the Application instance
   * @return {Promise<Application>}
   */
  static async bootstrap() {
    return new Application().start();
  }

  /**
   * Automatically handle errors
   * TODO: Make sure we do a clean exit!
   * @param {Error} err - The error instance
   */
  static onError(err) {
    dialog.showErrorBox('An error occured', `Please report the following error:\n${err.stack || err.message || err}`);
  }

  constructor() {
    this.storage = promisifyAll(jsonStorage);
    this.store = null;
    this.mainWindow = null;

    // No better way atm sorry :(
    global.state = {};
  }

  /**
   * Start the application
   * @return {Promise<Application>}
   */
  async start() {
    try {
      if (process.env.NODE_ENV === 'production') {
        const sourceMapSupport = require('source-map-support');
        sourceMapSupport.install();
      }

      if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
        require('electron-debug')();
        const p = path.join(__dirname, '..', 'app', 'node_modules');
        require('module').globalPaths.push(p);
      }

      await this.configureStore();

      app.on('ready', this.onReady.bind(this));

      app.on('activate', () => {
        if (this.mainWindow === null) {
          this.createMainWindow();
        }
      });

      app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit();
        }
      });

      return this;
    } catch (err) {
      Application.onError(err);
    }
  }

  async onReady() {
    try {
      if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      // Install needed extensions
        await ExtensionFactory.installExtensions();
      }

      await this.createMainWindow();
    } catch (err) {
      Application.onError(err);
    }
  }

  /**
   * Configure Redux Store and automatically save
   * the current state.
   * @private
   */
  async configureStore() {
    try {
      global.state = await this.storage.get('state');

      const storeFactory = new StoreFactory(SCOPE_MAIN);
      this.store = storeFactory.configureStore(global.state);

      this.store.subscribe(async () => {
        global.state = this.store.getState();

        await this.storage.set('state', global.state);
      });
    } catch (err) {
      Application.onError(err);
    }
  }

  /**
   * Creates a new main window instance and
   * assigns it to the private mainWindow variable
   * @private
   */
  async createMainWindow() {
    try {
      // Create a new main window instance
      this.mainWindow = await WindowFactory.createMainWindow({
        url: `file://${path.join(__dirname, '../renderer/app.html')}`
      });

      // Create menu stuff
      MenuFactory.makeMenu(this.mainWindow);

      // Other crap thats needed
      this.mainWindow.webContents.on('did-finish-load', () => {
        this.mainWindow.show();
        this.mainWindow.focus();
      });

      this.mainWindow.on('closed', () => {
        this.mainWindow = null;
      });
    } catch (err) {
      Application.onError(err);
    }
  }

  getStore() {
    return this.store;
  }
}