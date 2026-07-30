'use client'

import Callendar from "./components/Callendar"
import CallendarWeek from "./components/CallendarWeek"
import CallendarMonth from "./components/CallendarMonth"
import Appointments from "./components/appointments"

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

    <div className="h-screen w-full max-w-[600px] mx-auto flex flex-col bg-zinc-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <header>

        <div className="h-[100px] border-b bg-black">

          <h1 className="text-center text-[40px] text-white p-4">
            BRAVE BOSS
          </h1>

        </div>

      </header>


      {/* =================================================
          CONTEÚDO
      ================================================= */}

      <main className="flex-1 overflow-y-auto p-8 w-full">

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
          FOOTER
      ================================================= */}

      <footer className="border-t bg-black p-4">

        <div className="flex w-full justify-between">


          {/* =============================================
              NAVEGAÇÃO
          ============================================= */}

          <div className="flex w-[60%] justify-between">


            {/* DIA */}

            <button

              onClick={() =>
                setInterfaceView('day')
              }

              className={`
                flex
                justify-center
                rounded-xl
                border
                border-white
                items-center
                w-[50px]
                aspect-square

                ${interfaceView === 'day'

                  ? 'bg-linear-to-br from-black to-[#D3AF37]'

                  : 'bg-linear-to-br from-black to-white/40'
                }
              `}
            >

              <Calendar1 color="white" />

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
                border
                border-white
                items-center
                w-[50px]
                aspect-square

                ${interfaceView === 'week'

                  ? 'bg-linear-to-br from-black to-[#D3AF37]'

                  : 'bg-linear-to-br from-black to-white/40'
                }
              `}
            >

              <Calendar color="white" />

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
                border
                border-white
                items-center
                w-[50px]
                aspect-square

                ${interfaceView === 'month'

                  ? 'bg-linear-to-br from-black to-[#D3AF37]'

                  : 'bg-linear-to-br from-black to-white/40'
                }
              `}
            >

              <CalendarDays color="white" />

            </button>


          </div>


          {/* =============================================
              AGENDAMENTOS
          ============================================= */}

<button

    onClick={() =>
        setInterfaceView('appointments')
    }

    className={`
        flex
        justify-center
        rounded-xl
        border
        border-white
        items-center
        w-[50px]
        aspect-square

        ${
            interfaceView === 'appointments'

                ? 'bg-linear-to-br from-black to-[#D3AF37]'

                : 'bg-linear-to-br from-black to-white/40'
        }
    `}

>

    <CalendarCheck
        color="white"
    />

</button>


        </div>

      </footer>

    </div>

  )

}