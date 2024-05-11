function useDownloadFile() {

	const download = (filename: string, content: string) => {
		const element = document.createElement("a");
		const file = new Blob([content], { type: 'text/plain' });
		element.href = URL.createObjectURL(file);
		element.download = filename;
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	return {
		download
	};
}

export default useDownloadFile;