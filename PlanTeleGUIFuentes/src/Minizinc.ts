import * as MiniZinc from 'minizinc';

MiniZinc.init({
	workerURL: 'http://localhost:5173/node_modules/minizinc/dist/minizinc-worker.js',
	wasmURL: 'http://localhost:5173/node_modules/minizinc/dist/minizinc.wasm',
	dataURL: 'http://localhost:5173/node_modules/minizinc/dist/minizinc.data'
}).then(() => {
	console.log('Ready');
});

function readModel(data: string, model: string) {

	const Model = new MiniZinc.Model();

	Model.addDznString(data);
	Model.addFile('model.mzn', model);

	return Model;
}

function solveModel(model: MiniZinc.Model) {
	return model.solve({
		options: {
			solver: 'coin-bc',
			'all-solutions': true,
		}
	});
}

async function run(data: string, model: string): Promise<any | null> {
	let Model: MiniZinc.Model;
	let result: Awaited<MiniZinc.SolveProgress>;
	try {
		Model = await readModel(data, model);
		result = await solveModel(Model);
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