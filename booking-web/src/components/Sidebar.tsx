import { Calendar, Users, Settings, Clock } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full">
      {/* Logo e Nome da Empresa */}
      <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
        <div className="bg-[#01fbb9] p-2 rounded-lg text-zinc-950">
          <Clock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Booking<span className="text-[#01fbb9]">Pro</span></h1>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4 space-y-2">
        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-cyan-500/10 text-[#01fbb9] rounded-lg transition-colors border border-cyan-500/20">
          <Calendar className="w-5 h-5" />
          <span className="font-medium">Agenda</span>
        </a>
        
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
          <Users className="w-5 h-5" />
          <span className="font-medium">Clientes</span>
        </a>
        
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configurações</span>
        </a>
      </nav>

      {/* Perfil do Usuário Logado (Fictício por enquanto) */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[#01fbb9] font-bold border border-zinc-700">
            E
          </div>
          <div>
            <p className="text-sm font-bold text-white">Ezequias</p>
            <p className="text-xs text-[#01fbb9]">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
}