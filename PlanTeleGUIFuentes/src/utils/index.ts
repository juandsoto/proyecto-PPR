export function formatToDzn(input: string) {
	const keys = input.split('\n');

	let num_actores = parseInt(keys[0]);
	const actores = keys[1];

	let escenas = '';
	let escena = 3;
	while (num_actores > 0) {
		escenas += num_actores === 1 ? `|${keys[escena]}` : `|${keys[escena]}\n`;
		escena++;
		num_actores--;
	}

	const duracion = keys[escena];

	return `ACTORES = { ${actores} };

	Escenas =
	[${escenas}|];
	
	Duracion =
	[ ${duracion} ];`;
}