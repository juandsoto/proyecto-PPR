import { Sidebar, BasicTable, ExtendedTable } from "./components";
import { useAppStore } from "./store/appStore";

function App() {
	const { basicResult, extendedResult, isLoading } = useAppStore();

	return (
		<div className="flex min-h-screen max-w-screen-2xl mx-auto">
			<div className="flex-1 p-1 sm:p-4">
				<h1>Planificación de ensayos en una telenovela</h1>
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
			<Sidebar />
		</div>
	);
}

export default App;
