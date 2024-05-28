import { Sidebar, BasicTable, ExtendedTable } from "./components";
import { useAppStore } from "./store/appStore";

function App() {
	const { basicResult, extendedResult, isLoading } = useAppStore();

	return (
		<div id="app">
			<div className="flex min-h-screen max-w-screen-2xl mx-auto">
				<div className="flex-1 p-1 sm:p-4">
					<div>
						<h1 className="whitespace-nowrap h-12">Planificación de ensayos en una telenovela</h1>
						{ isLoading ? (
							<p className="mt-12">Generando resultado...</p>
						) : basicResult ? (
							<div className="mt-12">
								<BasicTable data={ basicResult } />
							</div>
						) : extendedResult && (
							<div className="mt-12">
								<ExtendedTable data={ extendedResult } />
							</div>
						) }
					</div>
					{ extendedResult && (
						<>
							<div className='bg-gray-800 h-[.1px] my-6 rounded-full'></div>
							<div className='space-y-4'>
								<h5 className='text-xl text-yellow-400'>Actores que se evitan</h5>
								<div className='space-y-1 text-gray-400'>
									{ extendedResult.evitan.length === 0 ? (
										<p>No hay actores que intentan evitarse</p>
									) : extendedResult.evitan.map((couple, i) => (
										<p key={ `${couple[0].e}-${couple[1].e}` }>
											<span>{ couple[0].e }</span>
											<span className='mx-2 text-sm'>evita a</span>
											<span>{ couple[1].e }</span>
											<span className='ml-2 text-sm'>| comparten { extendedResult.tiempo_compartido[i] } { extendedResult.tiempo_compartido[i] === 1 ? 'hora' : 'horas' } en set</span>
										</p>
									)) }
								</div>
							</div>
						</>
					) }
				</div>
				<Sidebar />
			</div>
		</div>
	);
}

export default App;
