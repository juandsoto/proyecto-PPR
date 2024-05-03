import * as MiniZinc from 'minizinc';
import { MODEL } from './constants/model';

function readModel(data: string) {

	const model = new MiniZinc.Model();

	model.addDznString(data);
	model.addFile('model.mzn', MODEL);

	return model;
}

function solveModel(model: MiniZinc.Model) {
	return model.solve({
		options: {
			solver: 'coin-bc',
			'all-solutions': true,
		}
	});
}

async function run(data: string) {
	await MiniZinc.init();
	let model: MiniZinc.Model;
	let solution;
	try {
		model = await readModel(data);
		solution = await solveModel(model);

	} catch (e) {
		console.error(e);
	}
	console.log({ solution });

	return solution.result?.solution?.output.json;
}

export const Minizinc = {
	run
};