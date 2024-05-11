import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color?: keyof typeof COLORS;
	variant?: keyof typeof TYPES;
}

const COLORS = {
	'': '',
	'green': 'text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800',
	'red': 'text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
};

const TYPES = {
	'fill': 'focus:outline-none focus:ring-4 font-medium rounded-md text-sm px-5 py-2.5 text-center',
	'outline': 'text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800'
};

function Button(props: ButtonProps) {
	const { className, color = '', variant = "fill", ...allProps } = props;



	return (
		<button
			type="button"
			className={
				[TYPES[variant],
				COLORS[color],
					className
				].join(' ')
			}
			{ ...allProps }
		>
			{ props.children }
		</button>
	);
}

export default Button;