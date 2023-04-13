const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	openFile: (file) => ipcRenderer.invoke('open-file', file),
	onFileOpened: (callback) => ipcRenderer.on('opened-file', callback),
});
