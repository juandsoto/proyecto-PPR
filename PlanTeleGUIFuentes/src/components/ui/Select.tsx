import React from 'react';

interface Option<T extends number | string> {
	text: string;
	value: T;
}
interface SelectProps<T extends number | string> {
	id: string;
	options: Option<T>[];
	onSelect: (value: Option<T>) => void;
}

function Select<T extends number | string>(props: SelectProps<T>) {
	return (
		<form className="max-w-sm">
			<label htmlFor={ props.id } className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selecciona una opción</label>
			<select id={ props.id } className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				{ props.options.map(option => (<option key={ option.value } value={ option.value }>{ option.text }</option>)) }
			</select>
		</form>
	);
}

export default Select;