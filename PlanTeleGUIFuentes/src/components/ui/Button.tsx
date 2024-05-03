import React from 'react';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	color: keyof typeof COLORS;
}

const COLORS = {
	'green': 'text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800',
	'red': 'text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
};

function Button(props: ButtonProps) {
	const { className, color, ...allProps } = props;
	return (
		<button
			type="button"
			className={
				["focus:outline-none focus:ring-4 font-medium rounded-md text-sm px-5 py-2.5 text-center",
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