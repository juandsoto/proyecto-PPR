import * as MiniZinc from 'minizinc';

//@ts-ignore
const IS_PROD = import.meta.env.PROD;

const BASE_URL = IS_PROD ? 'https://proyecto-ppr.vercel.app' : 'http://localhost:5173';

MiniZinc.init({
	workerURL: `${BASE_URL}/node_modules/minizinc/dist/minizinc-worker.js`,
	wasmURL: `${BASE_URL}/node_modules/minizinc/dist/minizinc.wasm`,
	dataURL: `${BASE_URL}/node_modules/minizinc/dist/minizinc.data`
}).then(() => {
	console.log('Minizinc worker ready!');
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
			solver: 'gecode',
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