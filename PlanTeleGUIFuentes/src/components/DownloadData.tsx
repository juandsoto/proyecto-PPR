import React from 'react';
import useDownloadFile from '../hooks/useDownloadFile';
import { useAppStore } from '../store/appStore';
import { Button } from './ui';

function DownloadData() {
	const { filename, dznFile, basicResult, extendedResult } = useAppStore();
	const file = useDownloadFile();

	return (
		<div className='flex flex-col items-end gap-4'>
			<Button
				className='flex items-center gap-2'
				variant='outline'
				onClick={ () => file.download(`${filename}.dzn`, dznFile!) }
			>
				<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
					<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01" />
				</svg>
				Entrada
			</Button>
			<Button
				className='flex items-center gap-2'
				variant='outline'
				onClick={ () => {
					let result: string = '';

					if (!!basicResult) {
						result = `Escenas = ${basicResult?.orden_escenas}\nCosto = ${basicResult?.costo}`;
					} else {
						result = `Escenas = ${extendedResult?.orden_escenas}\nCosto = ${extendedResult?.costo}\n\nTiempo Compartido:\n\n${extendedResult?.evitan.map((couple, i) => `${couple[0].e}, ${couple[1].e} = ${extendedResult.tiempo_compartido[i]}`).join('\n')}`;
					}

					file.download(`${filename}.txt`, result);
				} }
			>
				<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
					<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01" />
				</svg>
				Resultado
			</Button>
		</div>
	);
}

export default DownloadData;