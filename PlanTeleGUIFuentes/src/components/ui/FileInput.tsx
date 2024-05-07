import React from 'react';

interface FileInputProps extends React.HTMLProps<HTMLInputElement> {
	id: string;
	handleFile: (file: File) => void;
}

function FileInput({ id, handleFile, ...props }: FileInputProps) {

	const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files![0];
		if (!file) return;

		handleFile(file);
	};

	return (
		<input
			className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
			id={ id }
			{ ...props }
			type="file"
			onChange={ onInputChange }
		/>
	);
}

export default FileInput;