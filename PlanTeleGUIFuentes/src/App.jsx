import { Sidebar } from "./components";

function App() {
	return (
		<div className="min-h-screen flex">
			<div className="flex-1 p-1 sm:p-4">
				<h1>Planificación de ensayos en una telenovela</h1>
			</div>
			<Sidebar />
		</div>
	);
}

export default App;
