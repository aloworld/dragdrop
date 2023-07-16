	

	let browserWindowId = -1;

	const markdownView = document.querySelector('#markdown');

	let draggedFilename = '';

	// **** DOM event listeners *** 
	document.addEventListener('dragstart', event => {
		event.preventDefault();
		event.dataTransfer.effectAllowed = "all";
		event.dataTransfer.dropEffect = "move";
	});
	document.addEventListener('dragover', event => event.preventDefault());
	document.addEventListener('dragleave', event => event.preventDefault());
	document.addEventListener('drop', event => event.preventDefault());

	markdownView.addEventListener('dragover', (event) => {
	    const file = event.dataTransfer.items[0];

		if (fileTypeIsSupported(file)) {
			markdownView.classList.add('drag-over');
		} else {
			markdownView.classList.add('drag-error');
		}
	})

	markdownView.addEventListener('dragleave', () => {
		removeMarkdownDropStyle();
	})

	markdownView.addEventListener('drop', (event) => {
		removeMarkdownDropStyle();
		const file = event.dataTransfer.files[0];
		draggedFilename = file.name;
		if (fileTypeIsSupported(event.dataTransfer.items[0])) {
			getDroppedFile(file.path);
		}
	})

	// **** Renderer Process Functions ****
	const removeMarkdownDropStyle = () => {
		draggedFilename = '';
		markdownView.classList.remove('drag-over');
		markdownView.classList.remove('drag-error');
	}

	const fileTypeIsSupported = (file) => {
		console.log(`file dragged: ${draggedFilename}`);
		return file.type ?  
			['text/plain', 'text/markdown'].includes(file.type) : 
			/\.(md|markdown|txt)$/i.test(draggedFilename);
	}

	const getDroppedFile = (file) => {
		// call main process API to open the dropped file, 
		// as defined by the bridge (of same name) on preload.js
		window.electronAPI.readDroppedFile(file, browserWindowId);
	}

	// **** Main process event listeners ****
	// Listener for file opened event 
	// Attention: input should be sanitized first
	// Sanitization not implemented
	window.electronAPI.onFileOpened(async(_event, file, content) => {
		// markdownView.value = DOMPurify.sanitize(content);  // eg. of sanitization
		markdownView.value = content;
	})

	// Listener for browser window created event: that's where we get the browser for this renderer process
	window.electronAPI.onBrowserWindowCreated (async(_event, winId) => {
		browserWindowId = winId;
		console.log(`browser window id = ${browserWindowId}`);
	})