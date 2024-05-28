import React from 'react';
import { formatToDzn } from '../../utils';
import { rtfToTxt } from '../../utils/converter.js';

interface FileInputProps extends React.HTMLProps<HTMLInputElement> {
	id: string;
	handleFile: (filename: string, filecontent: string) => void;
}

function FileInput({ id, handleFile, ...props }: FileInputProps) {

	const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files![0];
		if (!file) return handleFile('', '');

		let data: string = await file.text();

		if (file.name.includes('.rtf')) {
			console.log(rtfToTxt(data));

			data = formatToDzn(rtfToTxt(data));
		}

		console.log(data);
		handleFile(file.name.split('.')[0], data);
	};

	return (
		<input
			className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:border-gray-600 dark:placeholder-gray-400"
			id={ id }
			{ ...props }
			type="file"
			onChange={ onInputChange }
			onClick={ e => e.currentTarget.value = '' }
		/>
	);
}

export default FileInput;