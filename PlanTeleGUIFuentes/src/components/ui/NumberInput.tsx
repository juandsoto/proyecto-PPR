import React from 'react';

interface Props {
	label: string;
	value: string;
	onChange: (value: string) => void;
}

function NumberInput(props: Props) {
	return (
		<div className='flex flex-col items-center'>
			<label htmlFor="quantity-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{ props.label }</label>
			<input
				className="bg-gray-50 border-x-0 border-gray-300 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block py-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-md"
				type="number"
				id="quantity-input"
				min={ 0.0 }
				max={ 1.0 }
				step={ 0.1 }
				value={ props.value }
				onChange={ (e) => props.onChange(e.target.value) }
			/>
		</div>
	);
}

export default NumberInput;