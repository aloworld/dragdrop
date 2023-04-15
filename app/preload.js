	// preload script to make the bridge between main and renderer processes

	const { contextBridge, ipcRenderer } = require('electron');

	// contextBridge exposes functions and events to be called or listened to, respectively, by the renderer process
	contextBridge.exposeInMainWorld('electronAPI', {

		// main process function available to renderer which, is picked up by ipcMain handler when invoked
		readDroppedFile: (file, browserWindowId) => ipcRenderer.invoke('read-dropped-file', file, browserWindowId),

		// events that are sent to renderer process
		onFileOpened: (callback) => ipcRenderer.on('file-opened', callback),
		onBrowserWindowCreated: (callback) => ipcRenderer.on('browser-window-created', callback),
	});
