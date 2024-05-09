import React, { useState } from 'react';
import UploadData from './UploadData';
import { Button, Select } from './ui';
import { useAppStore } from '../store/appStore';
import { Minizinc } from '../Minizinc';

function Sidebar() {
	const { dznFile, setBasicResult } = useAppStore();
	const [model, setModel] = useState<'basic' | 'extended'>('basic');

	const runModel = async () => {
		if (!dznFile) return;

		if (model === 'basic') {
			const result = await Minizinc.run(dznFile);
			setBasicResult(result);
			return;
		}

		return alert('no implementado');
	};

	return (
		<div className='w-96 py-4 px-4'>
			<div className="max-w-96">
				<UploadData />
			</div>
			{ dznFile && (
				<div className="mt-4 flex items-end gap-4">
					<div className="flex-1">
						<Select
							id='models'
							onSelect={ option => setModel(option.value) }
							options={ [
								{ text: 'Solver Básico', value: 'basic' },
								{ text: 'Solver Extendido', value: 'extended' },
							] }
						/>
					</div>
					<Button className='mb-[.5px]' color='green' onClick={ runModel }>Run</Button>
				</div>
			) }
		</div>
	);
}

export default Sidebar;