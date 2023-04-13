const markdownView = document.querySelector('#markdown');

document.addEventListener('dragstart', event => event.preventDefault());
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
})

const removeMarkdownDropStyle = () => {
	markdownView.classList.remove('drag-over');
	markdownView.classList.remove('drag-error');
}

const fileTypeIsSupported = (file) => {
	return ['text/plain', 'text/markdown'].includes(file.type);
}