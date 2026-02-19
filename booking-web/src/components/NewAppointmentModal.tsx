import { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../services/api';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDateTime: Date | null;
  onSuccess: () => void;
}

export function NewAppointmentModal({ isOpen, onClose, selectedDateTime, onSuccess }: NewAppointmentModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Se o modal estiver fechado ou não houver data selecionada, não renderiza nada
  if (!isOpen || !selectedDateTime) return null;

  // Assumimos que cada serviço demora 1 hora por padrão
  const endDateTime = addHours(selectedDateTime, 1);

  async function handleCreateAppointment(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/Appointments', {
        clientName,
        clientEmail,
        serviceName,
        startTime: selectedDateTime,
        endTime: endDateTime
      });

      alert('Agendamento criado com sucesso!');
      
      // Limpa o formulário
      setClientName('');
      setClientEmail('');
      setServiceName('');
      
      onSuccess(); // Vai servir para atualizar o calendário mais à frente
      onClose();   // Fecha o modal

    } catch (error: any) {
      // Aqui tratamos o erro 409 (Conflito) que criámos no C#!
      if (error.response?.status === 409) {
        alert('Atenção: ' + error.response.data.message);
      } else {
        alert('Ocorreu um erro ao tentar agendar. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">Novo Agendamento</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Resumo da Data/Hora selecionada */}
        <div className="bg-zinc-800/50 p-4 mx-6 mt-6 rounded-lg border border-zinc-700/50 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-300">
            <CalendarIcon className="w-4 h-4 text-[#01fbb9]" />
            <span className="font-medium capitalize">
              {format(selectedDateTime, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Clock className="w-4 h-4 text-[#01fbb9]" />
            <span className="font-medium">
              {format(selectedDateTime, "HH:mm")} às {format(endDateTime, "HH:mm")}
            </span>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleCreateAppointment} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Nome do Cliente</label>
            <input 
              required
              type="text" 
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#01fbb9]"
              placeholder="Ex: João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">E-mail</label>
            <input 
              required
              type="email" 
              value={clientEmail}
              onChange={e => setClientEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#01fbb9]"
              placeholder="joao@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Serviço</label>
            <select 
              required
              value={serviceName}
              onChange={e => setServiceName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#01fbb9] appearance-none"
            >
              <option value="" disabled>Selecione um serviço...</option>
              <option value="Consultoria Técnica">Consultoria Técnica</option>
              <option value="Reunião de Alinhamento">Reunião de Alinhamento</option>
              <option value="Suporte VIP">Suporte VIP</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-zinc-400 hover:text-white font-medium transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-[#10ebb9] hover:bg-[#01fbb9] disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              {isLoading ? 'A Guardar...' : 'Confirmar'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}