import { Sidebar } from './components/Sidebar';
import { Calendar } from './components/Calendar'; 

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8 relative">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-white">Visão Geral dos Agendamentos</h2>
          <p className="text-zinc-400 mt-1">Gerencie seus horários e serviços prestados.</p>
        </header>

        {/* Substituímos o texto antigo pelo componente real */}
        <Calendar /> 
      </main>

    </div>
  );
}