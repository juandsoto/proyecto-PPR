import React from 'react';
import { FileInput } from './ui';
import { useAppStore } from '../store/appStore';

function UploadDzn() {
	const { setDznFile } = useAppStore();

	return (
		<FileInput
			title='Ingresa los datos de entrada'
			handleFile={ setDznFile }
		/>
	);
}

export default UploadDzn;