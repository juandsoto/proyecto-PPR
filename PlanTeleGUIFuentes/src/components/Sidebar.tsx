import React, { useState } from 'react';
import UploadDzn from './UploadDzn';
import { Button, Select } from './ui';
import { useAppStore } from '../store/appStore';

function Sidebar() {
	const { dznFile } = useAppStore();
	const [model, setModel] = useState<'basic' | 'extended'>('basic');

	const runModel = async () => {
		if (!dznFile) return;

		const data: string = await dznFile?.text();
		// if (model === 'basic') return execute(data);

		return alert('no implementado');
	};

	return (
		<div className='w-96 py-4 px-4'>
			<div className="max-w-96">
				<UploadDzn />
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