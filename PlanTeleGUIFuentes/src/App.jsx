import { Sidebar, BasicTable } from "./components";
import { useAppStore } from "./store/appStore";

function App() {
	const { basicResult, isLoading } = useAppStore();

	return (
		<div className="flex min-h-screen max-w-screen-2xl mx-auto">
			<div className="flex-1 p-1 sm:p-4">
				<h1>Planificación de ensayos en una telenovela</h1>
				{ isLoading ? (
					<p className="mt-12">Generando resultado...</p>
				) : basicResult && (
					<div className="mt-12">
						<BasicTable data={ basicResult } />
					</div>
				) }
			</div>
			<Sidebar />
		</div>
	);
}

export default App;
