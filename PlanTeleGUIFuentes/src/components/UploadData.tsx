import React from 'react';
import { FileInput } from './ui';
import { useAppStore } from '../store/appStore';

function UploadData() {
	const { setDznFile } = useAppStore();

	return (
		<>
			<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="dzn_input">Ingresa los datos de entrada</label>
			<FileInput
				id='dzn_input'
				handleFile={ setDznFile }
			/>
		</>
	);
}

export default UploadData;