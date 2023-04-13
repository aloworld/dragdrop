const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	createWindow: () => ipcRenderer.invoke('create-window'),
});
