import * as MiniZinc from 'minizinc';
import { MODEL } from './constants/model';

MiniZinc.init({
	workerURL: 'http://localhost:5173/node_modules/minizinc/dist/minizinc-worker.js',
	wasmURL: 'http://localhost:5173/node_modules/minizinc/dist/minizinc.wasm',
	dataURL: 'http://localhost:5173/node_modules/minizinc/dist/minizinc.data'
}).then(() => {
	console.log('Ready');
});

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

async function run(data: string): Promise<any | null> {
	let model: MiniZinc.Model;
	let result: Awaited<MiniZinc.SolveProgress>;
	try {
		model = await readModel(data);
		result = await solveModel(model);
		console.log(result.solution?.output.json);

		return result.solution?.output.json;
	} catch (e) {
		console.error(e);
	}
	return null;
}

export const Minizinc = {
	run
};