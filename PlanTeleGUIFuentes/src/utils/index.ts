export function formatToDzn(input: string) {
	const keys = input.split('\n');

	let num_actores = parseInt(keys[0]);
	let num_actores_iter = num_actores;
	const actores = keys[1];
	const num_escenas = parseInt(keys[2]);

	let escenas = '';
	let index = 3;
	while (num_actores_iter > 0) {
		escenas += num_actores_iter === 1 ? `|${keys[index]}` : `|${keys[index]}\n`;
		index++;
		num_actores_iter--;
	}

	const duracion = keys[index];
	index++;

	if (!keys[index]) {
		return `N = ${num_actores};
		
		ACTORES = { ${actores} };
		
		M = ${num_escenas};
	
		Escenas =
		[${escenas}|];
		
		Duracion =
		[ ${duracion} ];`;
	}

	const d = keys[index].split(',');
	const a = actores.split(',');
	let disponibilidad = '';
	for (let i = 0; i < d.length; i++) {
		disponibilidad += i === d.length - 1 ? `|${a[i]},${d[i]}` : `|${a[i]},${d[i]}\n`;
	}

	index++;
	const E = parseInt(keys[index]);
	let E_iter = E;
	index++;
	let evitar = '';
	while (E_iter > 0) {
		evitar += E_iter === 1 ? `|${keys[index]}` : `|${keys[index]}\n`;
		index++;
		E_iter--;
	}

	return `N = ${num_actores};
		
		ACTORES = { ${actores} };
		
		M = ${num_escenas};
	
		Escenas =
		[${escenas}|];
		
		Duracion =
		[ ${duracion} ];
		
		Disponibilidad =
		[${disponibilidad}|];
		
		E = ${E};
		
		Evitar =
		[${evitar}|];`;
}