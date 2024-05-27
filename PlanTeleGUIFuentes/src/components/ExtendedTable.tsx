import React from 'react';
import { ExtendedResult } from '../types';

interface ExtendedTableProps {
	data: ExtendedResult;
}

function ExtendedTable({ data }: ExtendedTableProps) {
	return (
		<div className="relative overflow-x-auto">
			<table className="w-full rtl:text-right text-center text-white">
				<thead className="text-xs uppercase">
					<tr>
						<th scope="col" className="px-6 py-3" />
						{ data.orden_escenas.map(escena => (
							<th key={ `escena ${escena}` } scope="col" className="px-6 py-3">
								Escena { escena }
							</th>
						)) }
						<th scope="col" className="px-6 py-3">
							Disponibilidad
						</th>
						<th scope="col" className="px-6 py-3">
							Costo hora
						</th>
						<th scope="col" className="px-6 py-3">
							Costo total
						</th>
					</tr>
				</thead>
				<tbody>
					{ Array.from({ length: data.actores.length }).map((_, actor) => (
						<tr key={ `actor ${actor}` }>
							<th scope="row" className="px-6 py-4 font-medium text-left whitespace-nowrap">
								{ data.actores[actor].e }
							</th>
							{ data.orden_escenas.map(escena => (
								<td key={ `actor ${actor} - escena ${escena - 1}` } className="">
									{ data.escenas[actor][escena - 1] ? (
										<div className='size-8 bg-green-500 rounded-md mx-auto'></div>
									) : (
										<div className='size-8 bg-red-500 rounded-md mx-auto'></div>
									) }
								</td>
							)) }
							<td className="px-6 py-4">
								{ data.disponibilidad[actor] === 0 ? 'Ilimitada' : data.disponibilidad[actor] }
							</td>
							<td className="px-6 py-4">
								{ data.costo_hora[actor] }
							</td>
							<td className="px-6 py-4">
								{ data.costo_por_actor[actor] }
							</td>
						</tr>
					)) }
					<tr>
						<th scope="row" className="px-6 py-4 font-medium text-left whitespace-nowrap">
							Duración
						</th>
						{ data.orden_escenas.map(escena => (
							<td key={ `duracion escena ${escena - 1}` } className="px-6 py-4">
								{ data.duracion[escena - 1] }
							</td>
						)) }
						<td className="px-6 py-4" />
						<td className="px-6 py-4" />
					</tr>
					<tr>
						<th scope="row" className="px-6 py-4 font-medium text-left whitespace-nowrap">
							Total
						</th>
						{ Array.from({ length: data.orden_escenas.length + 2 }).map((_, i) => <td key={ `duracion escena ${i + 1}` } className="px-6 py-4" />) }
						<td className="px-6 py-4 text-black font-bold text-lg bg-yellow-500 rounded-lg">
							Costo { data.costo }
						</td>
					</tr>
				</tbody>
			</table>
			<div className='bg-gray-800 h-[.1px] my-6 rounded-full'></div>
			<div className='space-y-4'>
				<h5 className='text-xl text-yellow-400'>Actores que se evitan</h5>
				<div className='space-y-1 text-gray-400'>
					{ data.actores.length === 0 ? (
						<p>No hay actores que intentan evitarse</p>
					) : data.evitan.map((couple, i) => (
						<p key={ `${couple[0].e}-${couple[1].e}` }>
							<span>{ couple[0].e }</span>
							<span className='mx-2 text-sm'>evita a</span>
							<span>{ couple[1].e }</span>
							<span className='ml-2 text-sm'>| comparten { data.tiempo_compartido[i] } { data.tiempo_compartido[i] === 1 ? 'hora' : 'horas' } en set</span>
						</p>
					)) }
				</div>
			</div>
		</div>
	);
}

export default ExtendedTable;