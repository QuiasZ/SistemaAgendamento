import { useState, useEffect, Fragment } from 'react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, setHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NewAppointmentModal } from './NewAppointmentModal';
import { api } from '../services/api'; 

interface Appointment {
  id: number;
  clientName: string;
  serviceName: string;
  startTime: string;
  endTime: string;
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  async function fetchAppointments() {
    try {
      const response = await api.get('/Appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function handleCancelAppointment(e: React.MouseEvent, id: number, clientName: string) {
    // Isto impede que o clique "vaze" para o quadrado de trás e abra o modal de Novo Agendamento
    e.stopPropagation(); 
    
    // O window.confirm cria aquele alerta nativo do navegador com "OK" e "Cancelar"
    const confirmCancel = window.confirm(`Tem a certeza que deseja cancelar o agendamento de ${clientName}?`);
    
    if (confirmCancel) {
      try {
        await api.delete(`/Appointments/${id}`);
        // Se der sucesso, recarrega a lista para o cartão desaparecer imediatamente
        fetchAppointments(); 
      } catch (error) {
        console.error("Erro ao cancelar:", error);
        alert('Ocorreu um erro ao tentar cancelar o agendamento.');
      }
    }
  }

  function handleTimeSlotClick(day: Date, hour: number) {
    const exactDateTime = setHours(day, hour);
    setSelectedDateTime(exactDateTime);
    setIsModalOpen(true);
  }

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = [...Array(7)].map((_, i) => addDays(startDate, i));
  const hours = Array.from({ length: 11 }, (_, i) => i + 8);

  function nextWeek() { setCurrentDate(addWeeks(currentDate, 1)); }
  function prevWeek() { setCurrentDate(subWeeks(currentDate, 1)); }

  return (
    <>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-[700px] shadow-2xl">
        
        {/* Cabeçalho */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
          <h2 className="text-xl font-bold text-white capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevWeek} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1.5 text-sm font-medium hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-lg transition-all text-zinc-300">
              Hoje
            </button>
            <button onClick={nextWeek} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grade do Calendário */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-8 min-w-[800px]">
            
            <div className="border-b border-r border-zinc-800 p-3 bg-zinc-900 sticky top-0 z-20"></div>
            
            {/* Linha 1: Dias da Semana */}
            {weekDays.map(day => {
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              return (
                <div key={day.toISOString()} className={`border-b border-r border-zinc-800 p-3 text-center sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-sm ${isToday ? 'text-[#01fbb9]' : 'text-zinc-400'}`}>
                  <div className="text-xs font-medium uppercase tracking-wider">{format(day, 'EEE', { locale: ptBR })}</div>
                  <div className={`text-xl font-bold mt-1 mx-auto w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-[#01fbb9] text-zinc-950' : ''}`}>
                    {format(day, 'dd')}
                  </div>
                </div>
              );
            })}

            {/* Linhas Seguintes: Horas e Células Vazias */}
            {hours.map(hour => (
              <Fragment key={hour}>
                <div className="border-b border-r border-zinc-800 p-2 text-xs text-zinc-500 font-medium text-right sticky left-0 bg-zinc-900 z-10">
                  {`${hour.toString().padStart(2, '0')}:00`}
                </div>
                
                {/* 7 Células de Agendamento */}
                {weekDays.map(day => {
                  // 5. Filtramos os agendamentos que pertencem a ESTE dia e a ESTA hora
                  const slotAppointments = appointments.filter(app => {
                    const appDate = new Date(app.startTime);
                    return (
                      appDate.getDate() === day.getDate() &&
                      appDate.getMonth() === day.getMonth() &&
                      appDate.getFullYear() === day.getFullYear() &&
                      appDate.getHours() === hour
                    );
                  });

                  return (
                    <div 
                      key={`${day.toISOString()}-${hour}`} 
                      className="border-b border-r border-zinc-800 h-16 hover:bg-zinc-800/60 transition-colors cursor-pointer relative group"
                      onClick={() => handleTimeSlotClick(day, hour)}
                    >
                      {/* Ícone de + (Fica escondido até passar o rato) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[#01fbb9] font-bold text-xl pointer-events-none">
                        +
                      </div>

                      {/* 6. Renderizamos os Cartões dos Agendamentos encontrados */}
                      {slotAppointments.map(app => (
                        <div 
                          key={app.id}
                          className="absolute inset-x-1 top-1 bottom-1 bg-brand-dark/90 border border-[#01fbb9] rounded p-1.5 text-xs overflow-hidden z-10 flex flex-col justify-center shadow-lg hover:bg-brand-dark cursor-pointer transition-colors"
                          onClick={(e) => handleCancelAppointment(e, app.id, app.clientName)}
                          title="Clique para cancelar agendamento"
                        >
                          <span className="font-bold text-brand-light truncate">{app.clientName}</span>
                          <span className="text-brand-light/70 truncate text-[10px]">{app.serviceName}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </Fragment>
            ))}
            
          </div>
        </div>
      </div>

      <NewAppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDateTime={selectedDateTime}
        // 7. Quando houver sucesso no Modal, recarregamos a lista de agendamentos!
        onSuccess={fetchAppointments} 
      />
    </>
  );
}