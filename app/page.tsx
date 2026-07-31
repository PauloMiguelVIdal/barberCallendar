'use client'

import Callendar from "./components/Callendar"
import CallendarWeek from "./components/CallendarWeek"
import CallendarMonth from "./components/CallendarMonth"
import Appointments from "./components/appointments"
import logo from '../public/logo.png'
import Image from 'next/image'
import {
  CentralDadosProvider,
  useCentralDados
} from "./components/PersistData"

import {
  Calendar,
  Calendar1,
  CalendarDays,
  CalendarCheck
} from 'lucide-react'


export default function Home() {

  return (

    <CentralDadosProvider>

      <HomeContent />

    </CentralDadosProvider>

  )

}


function HomeContent() {

  const {
    interfaceView,
    setInterfaceView
  } = useCentralDados()


  return (

 <div className="h-dvh w-full max-w-[600px] mx-auto flex flex-col bg-[#121212] relative">
      {/* =================================================
          HEADER - FIXO NO TOPO
      ================================================= */}

      <header className="flex-shrink-0">

        <div className="h-[100px] border-b border-[#2A2A2A] bg-[#121212] flex items-center justify-center">

          <div className="flex items-center justify-around w-full max-w-[400px]">
            <span className="text-[40px] text-[#D3AF37] font-bold tracking-wider">
              BRAVE
            </span>
            
            <Image 
              src={logo}
              alt="Logo"
              height={40}
              width={40}
              className="h-[40px] w-auto object-contain"
            />
            
            <span className="text-[40px] text-[#D3AF37] font-bold tracking-wider">
              BOSS
            </span>
          </div>

        </div>

      </header>


      {/* =================================================
          CONTEÚDO - ROLÁVEL
      ================================================= */}

      <main className="flex-1 overflow-y-auto p-0 w-full bg-[#121212] pb-[80px]">

        {interfaceView === 'day' && (
          <Callendar />
        )}

        {interfaceView === 'week' && (
          <CallendarWeek />
        )}

        {interfaceView === 'month' && (
          <CallendarMonth />
        )}

        {interfaceView === 'appointments' && (
          <Appointments />
        )}
      </main>


      {/* =================================================
          FOOTER - FIXO NA PARTE INFERIOR
      ================================================= */}

      <footer className="
        border-t 
        border-[#2A2A2A] 
        bg-[#121212] 
        px-2 
        py-3 
        flex-shrink-0 
        absolute 
        bottom-0 
        left-0 
        right-0 
        z-10
         pb-[calc(0.75rem+env(safe-area-inset-bottom))]
      ">

        <div className="flex w-full justify-around items-center">

          {/* DIA */}
          <button

            onClick={() =>
              setInterfaceView('day')
            }

            className={`
              flex
              justify-center
              rounded-xl
              border-2
              items-center
              min-w-[48px]
              min-h-[48px]
              w-[48px]
              h-[48px]
              transition-all
              duration-200
              touch-manipulation

              ${
                interfaceView === 'day'

                  ? 'bg-[#1E1E1E] border-[#D3AF37] shadow-lg shadow-[#D3AF37]/20'

                  : 'bg-[#1E1E1E] border-[#333333] hover:border-[#757575]'
              }
            `}
          >

            <Calendar1 
              color={interfaceView === 'day' ? '#D3AF37' : '#757575'} 
              size={24}
              strokeWidth={2}
            />

          </button>

          {/* SEMANA */}
          <button

            onClick={() =>
              setInterfaceView('week')
            }

            className={`
              flex
              justify-center
              rounded-xl
              border-2
              items-center
              min-w-[48px]
              min-h-[48px]
              w-[48px]
              h-[48px]
              transition-all
              duration-200
              touch-manipulation

              ${
                interfaceView === 'week'

                  ? 'bg-[#1E1E1E] border-[#D3AF37] shadow-lg shadow-[#D3AF37]/20'

                  : 'bg-[#1E1E1E] border-[#333333] hover:border-[#757575]'
              }
            `}
          >

            <Calendar 
              color={interfaceView === 'week' ? '#D3AF37' : '#757575'} 
              size={24}
              strokeWidth={2}
            />

          </button>

          {/* MÊS */}
          <button

            onClick={() =>
              setInterfaceView('month')
            }

            className={`
              flex
              justify-center
              rounded-xl
              border-2
              items-center
              min-w-[48px]
              min-h-[48px]
              w-[48px]
              h-[48px]
              transition-all
              duration-200
              touch-manipulation

              ${
                interfaceView === 'month'

                  ? 'bg-[#1E1E1E] border-[#D3AF37] shadow-lg shadow-[#D3AF37]/20'

                  : 'bg-[#1E1E1E] border-[#333333] hover:border-[#757575]'
              }
            `}
          >

            <CalendarDays 
              color={interfaceView === 'month' ? '#D3AF37' : '#757575'} 
              size={24}
              strokeWidth={2}
            />

          </button>

          {/* AGENDAMENTOS */}
          <button

            onClick={() =>
              setInterfaceView('appointments')
            }

            className={`
              flex
              justify-center
              rounded-xl
              border-2
              items-center
              min-w-[48px]
              min-h-[48px]
              w-[48px]
              h-[48px]
              transition-all
              duration-200
              touch-manipulation

              ${
                interfaceView === 'appointments'

                  ? 'bg-[#1E1E1E] border-[#D3AF37] shadow-lg shadow-[#D3AF37]/20'

                  : 'bg-[#1E1E1E] border-[#333333] hover:border-[#757575]'
              }
            `}
          >

            <CalendarCheck
              color={interfaceView === 'appointments' ? '#D3AF37' : '#757575'} 
              size={24}
              strokeWidth={2}
            />

          </button>

        </div>

      </footer>

    </div>

  )

}