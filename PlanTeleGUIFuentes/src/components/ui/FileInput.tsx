import React from 'react';

interface FileInputProps {
	title: string;
	handleFile: (file: File) => void;
}

function FileInput(props: FileInputProps) {

	const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files![0];
		if (!file) return;

		props.handleFile(file);
	};

	return (
		<>
			<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">{ props.title }</label>
			<input
				className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
				id="file_input"
				type="file"
				onChange={ onChange }
			/>
		</>
	);
}

export default FileInput;