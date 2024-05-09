export function formatToDzn(input: string) {
	const keys = input.split('\n');

	let num_actores = parseInt(keys[0]);
	let num_actores_iter = num_actores;
	const num_escenas = parseInt(keys[2]);
	console.log({ num_escenas });

	const actores = keys[1];


	let escenas = '';
	let escena = 3;
	while (num_actores_iter > 0) {
		escenas += num_actores_iter === 1 ? `|${keys[escena]}` : `|${keys[escena]}\n`;
		escena++;
		num_actores_iter--;
	}

	const duracion = keys[escena];

	return `CANTIDAD_ACTORES = ${num_actores};
	
	ACTORES = { ${actores} };
	
	CANTIDAD_ESCENAS = ${num_escenas};

	Escenas =
	[${escenas}|];
	
	Duracion =
	[ ${duracion} ];`;
}