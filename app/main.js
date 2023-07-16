	const { app, BrowserWindow, ipcMain } = require('electron');

	const fs = require('fs');
	const path = require('path');

	// **** ipcMain handlers ****
	ipcMain.handle('open-file', (event, file) => openFile(BrowserWindow.getFocusedWindow(), file));
	ipcMain.handle('read-dropped-file', (event, file, browserWindowId) => readDroppedFile(file, browserWindowId));

	// **** Main Process Functions ****
	const readDroppedFile = (file, browserWindowId) => {
		let targetWindow = BrowserWindow.getFocusedWindow();
		if (!targetWindow) { // no focused window was found, so we'll use browserWindowId	

			if (browserWindowId < 0) { console.log('Invalid browser id'); return; }

			// we get the window using the static BrowserWindow.fromId() function
			targetWindow = BrowserWindow.fromId(browserWindowId);

			if (!targetWindow) { console.log('Unable to identify which window to use'); return; }
		}

		targetWindow.show();  // targetWindow.focus(); ?

		openFile(targetWindow, file);
	}

	const createWindow = (continuation) => {
		let newWindow = new BrowserWindow(
		{
			show: false,
			width:800,
			height: 600,
			webPreferences: {
				preload: path.join(__dirname, 'preload.js'),
			},
		});

		newWindow.loadFile('./app/index.html');

		newWindow.once('ready-to-show', () => {
			newWindow.show();
			newWindow.webContents.openDevTools();

			// raise event on channel 'browser-window-created' for renderer process
			newWindow.webContents.send('browser-window-created', newWindow.id);
		});

		newWindow.on('closed', () => newWindow = null);

		if (continuation)	// this would be run on MacOS from the app's icon if no window is open
			continuation(newWindow);
	};

	app.whenReady().then(() => {
		createWindow();

		app.on('activate', (event, hasVisibleWindows) => {
			if (!hasVisibleWindows) createWindow();
		});
	});

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') app.quit();
	});

	// nice app listener event for launching file from the app icon's recent files menu
	app.on('will-finish-launching', () => {
		app.on('open-file', (event, file) => {
			createWindow((targetWindow) => {
				targetWindow.once('ready-to-show', () => openFile(targetWindow, file));
			});
		});
	});
	const openFile = (targetWindow, file) => {

		const content = fs.readFileSync(file).toString();

		// nice features to set
		app.addRecentDocument(file);
		targetWindow.setRepresentedFilename(file);

		// raise envent on channel 'file-opened' for renderer process
		targetWindow.webContents.send('file-opened', file, content);
	}