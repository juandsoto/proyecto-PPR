interface Actor {
	e: string;
}
export interface BasicResult {
	escenas: number[][];
	orden_escenas: number[];
	costo: number;
	costo_por_actor: number[];
	actores: Actor[];
	duracion: number[];
	costo_hora: number[];
}

export interface ExtendedResult {
	escenas: number[][];
	orden_escenas: number[];
	costo: number;
	costo_por_actor: number[];
	actores: Actor[];
	duracion: number[];
	costo_hora: number[];
	disponibilidad: number[];
	tiempo_juntos: number[];
	evitan: Array<[Actor, Actor]>;
}