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

	index++;
	const E = parseInt(keys[index]);
	let E_iter = E;
	index++;
	let evitar = '';
	const actores_array = actores.split(',');
	while (E_iter > 0) {
		const [a1, a2] = keys[index].split(',');
		const [index1, index2] = [actores_array.indexOf(a1) + 1, actores_array.indexOf(a2) + 1];
		evitar += E_iter === 1 ? `|${index1},${index2}` : `|${index1},${index2}\n`;
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
		
		Maximo_tiempo_actores =
		[${d}];
		
		E = ${E};
		
		Actores_separados =
		[${evitar}|];
		
		c_weight = 1.0;

		t_weight = 1.0;`;
}

export function replaceWeights(dzn: string, cost: string, evitar: string) {
	const costRegexp = /c_weight = .+?;/;
	const evitarRegexp = /t_weight = .+?;/;

	return dzn.replace(costRegexp, `c_weight = ${cost};`).replace(evitarRegexp, `t_weight = ${evitar};`);
}