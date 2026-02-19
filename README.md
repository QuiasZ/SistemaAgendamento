# 🗓️ BookingPro - Sistema de Agendamento Full-Stack

Um sistema completo de agendamentos desenvolvido para gerir marcações de serviços, com uma interface interativa em formato de calendário e uma API robusta que impede conflitos de horários (overbooking).

## 🚀 Tecnologias Utilizadas

### Backend (API)
* **C# & .NET 9:** Construção da API RESTful.
* **Entity Framework Core:** ORM para mapeamento e gestão do banco de dados.
* **SQLite:** Banco de dados relacional leve e rápido.
* **Swagger:** Documentação interativa da API.

### Frontend (Web)
* **React + TypeScript (Vite):** Construção da interface de utilizador de alta performance.
* **Tailwind CSS:** Estilização utilitária para um design moderno e responsivo.
* **Date-fns:** Manipulação e formatação avançada de datas e horas.
* **Axios:** Comunicação HTTP com o backend.
* **Lucide React:** Biblioteca de ícones.

## ✨ Principais Funcionalidades

* **Grelha de Calendário Interativa:** Visualização semanal dinâmica, onde o utilizador pode navegar por semanas, meses e identificar visualmente os dias e horas disponíveis.
* **Prevenção de Colisão (Overlapping):** Regra de negócio estrita no C# que valida as datas e impede que dois clientes reservem exatamente o mesmo bloco de tempo, retornando um erro `409 Conflict`.
* **Criação de Agendamentos:** Modal intuitivo que capta automaticamente o dia e a hora clicados na grelha.
* **Cancelamento de Agendamentos:** Gestão de estados na base de dados (Soft Delete/Status Update) ao clicar num agendamento existente.

## 🛠️ Como executar o projeto na sua máquina

Para rodar este projeto, você precisará ter o [Node.js](https://nodejs.org/) e o [.NET 9 SDK](https://dotnet.microsoft.com/) instalados.

### 1. Rodando a API (Backend)
Abra o seu terminal e navegue até a pasta da API:
```bash
cd Booking.Api
