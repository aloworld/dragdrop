const { app, BrowserWindow, ipcMain } = require('electron');

const fs = require('fs');
const path = require('path');

let mainWindow = null;

ipcMain.handle('open-file', (event, file) => openFile(BrowserWindow.getFocusedWindow(), file));


const createWindow = () => {
	mainWindow = new BrowserWindow(
	{
		show: false,
		width:800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	mainWindow.loadFile('./app/index.html');

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.webContents.openDevTools();
	});

	mainWindow.on('closed', () => mainWindow = null);
};

app.whenReady().then(() => {
	createWindow();

	app.on('activate', (event, hasVisibleWindows) => {
		if (!hasVisibleWindows) createWindow();
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.Quit();
});

const openFile = (targetWindow, file) => {
	const contents = fs.readFileSync(file).toString();
	console.log(contents);
	// targetWindow.setRepresentedFilename(file);
	targetWindow.webContents.send('opened-file', file, contents);
}