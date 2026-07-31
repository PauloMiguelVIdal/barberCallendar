'use client'

import {
ArrowBigLeft,
ArrowBigRight
} from 'lucide-react'

import {
useCentralDados
} from './PersistData'

export default function CallendarMonth() {

// =========================================================
// CONTEXT
// =========================================================

const {

dataVisualizada,

definirDataVisualizada,

setInterfaceView,

proximoMes,

mesAnterior

} = useCentralDados()

// =========================================================
// DATA ATUAL
// =========================================================

const hoje = new Date()

hoje.setHours(
0,
0,
0,
0
)

const anoAtual =
hoje.getFullYear()

const mesAtual =
hoje.getMonth()

const diaAtual =
hoje.getDate()

// =========================================================
// MÊS VISUALIZADO
// =========================================================

const mesVisualizado =
dataVisualizada.getMonth()

const anoVisualizado =
dataVisualizada.getFullYear()

// =========================================================
// NOME DOS MESES
// =========================================================

const months: string[] = [

'Janeiro',

'Fevereiro',

'Março',

'Abril',

'Maio',

'Junho',

'Julho',

'Agosto',

'Setembro',

'Outubro',

'Novembro',

'Dezembro'

]

// =========================================================
// DIAS DA SEMANA
// =========================================================

const diaSemanaNome = [

'Domingo',

'Segunda-feira',

'Terça-feira',

'Quarta-feira',

'Quinta-feira',

'Sexta-feira',

'Sábado'

]

// =========================================================
// NAVEGAÇÃO DO MÊS
// =========================================================

function setProximoMes() {

proximoMes()

}

function setAnteriorMes() {

mesAnterior()

}

// =========================================================
// DIAS DO MÊS
// =========================================================

const diasNoMes = new Date(

anoVisualizado,

mesVisualizado + 1,

0

).getDate()

// =========================================================
// PRIMEIRO DIA DA SEMANA
// =========================================================

const primeiroDiaSemana = new Date(

anoVisualizado,

mesVisualizado,

1

).getDay()

// =========================================================
// DIAS DO MÊS ANTERIOR
// =========================================================

const diasMesAnterior = new Date(

anoVisualizado,

mesVisualizado,

0

).getDate()

// =========================================================
// CALENDÁRIO
// =========================================================

const calendario: {

dia: number

atual: boolean

hoje: boolean

passado: boolean

data: Date

}[] = []

// =========================================================
// MÊS ANTERIOR
// =========================================================

for (

let i =
  diasMesAnterior -
  primeiroDiaSemana +
  1;

i <= diasMesAnterior;

i++

) {

const data = new Date(

  anoVisualizado,

  mesVisualizado - 1,

  i

)


calendario.push({

  dia: i,

  atual: false,

  hoje: false,

  passado: true,

  data

})

}

// =========================================================
// MÊS ATUAL
// =========================================================

for (

let i = 1;

i <= diasNoMes;

i++

) {

const data = new Date(

  anoVisualizado,

  mesVisualizado,

  i

)


data.setHours(

  0,
  0,
  0,
  0

)


const ehHoje =

  i === diaAtual &&

  mesVisualizado === mesAtual &&

  anoVisualizado === anoAtual


const ehPassado =

  data.getTime() <

  hoje.getTime()


calendario.push({

  dia: i,

  atual: true,

  hoje: ehHoje,

  passado: ehPassado,

  data

})

}

// =========================================================
// PRÓXIMO MÊS
// =========================================================

let proxDia = 1

while (

calendario.length < 42

) {

const data = new Date(

  anoVisualizado,

  mesVisualizado + 1,

  proxDia

)


calendario.push({

  dia: proxDia,

  atual: false,

  hoje: false,

  passado: false,

  data

})


proxDia++

}

// =========================================================
// SELECIONAR DIA
// =========================================================

function selecionarDia(

data: Date

) {

// =======================================================
// NÃO PERMITE DATAS PASSADAS
// =======================================================

const dataSelecionada =
  new Date(data)

dataSelecionada.setHours(

  0,
  0,
  0,
  0

)


if (

  dataSelecionada.getTime() <

  hoje.getTime()

) {

  return

}


// =======================================================
// DEFINE A DATA NO CONTEXT
// =======================================================

definirDataVisualizada(

  dataSelecionada

)


// =======================================================
// MUDA PARA O CALENDÁRIO DIÁRIO
// =======================================================

setInterfaceView(

  'day'

)

}

// =========================================================
// RENDER
// =========================================================

return (

<div className="w-full max-w-[700px] mx-auto bg-[#121212] p-4 rounded-xl">


  {/* =====================================================
      CABEÇALHO
  ====================================================== */}

  <div className="
    w-full
    h-[80px]
    bg-[#121212]
    flex
    items-center
    justify-around
    border-b
    border-[#2A2A2A]
    mb-4
  ">


    {/* MÊS ANTERIOR */}

    <button

      onClick={
        setAnteriorMes
      }

      disabled={

        anoVisualizado ===
        anoAtual &&

        mesVisualizado ===
        mesAtual

      }

      className={`
        flex
        w-[50px]
        h-[50px]
        rounded-full
        items-center
        justify-center
        transition-all
        duration-200

        ${
          anoVisualizado ===
            anoAtual &&

          mesVisualizado ===
            mesAtual

            ? 'bg-[#333333] cursor-not-allowed'

            : 'bg-[#D3AF37] hover:bg-[#C4A032] hover:scale-105'
        }
      `}

    >

      <ArrowBigLeft
        color={anoVisualizado === anoAtual && mesVisualizado === mesAtual ? '#757575' : '#121212'}
        size={24}
      />

    </button>


    {/* NOME DO MÊS */}

    <h1 className="
      text-[30px]
      text-[#FFFFFF]
      font-bold
    ">

      {months[
        mesVisualizado
      ]}

      {' '}

      {anoVisualizado}

    </h1>


    {/* PRÓXIMO MÊS */}

    <button

      onClick={
        setProximoMes
      }

      className="
        flex
        w-[50px]
        h-[50px]
        bg-[#D3AF37]
        rounded-full
        items-center
        justify-center
        hover:bg-[#C4A032]
        hover:scale-105
        transition-all
        duration-200
      "

    >

      <ArrowBigRight
        color="#121212"
        size={24}
      />

    </button>


  </div>


  {/* =====================================================
      CALENDÁRIO
  ====================================================== */}

  <div className="
    w-full
    mt-4
  ">


    <div className="
      grid
      grid-cols-7
      gap-2
    ">


      {/* =================================================
          NOMES DOS DIAS
      ================================================== */}

      {diaSemanaNome.map(

        (dia) => (

          <div

            key={dia}

            className="
              text-xs
              text-[#A0A0A0]
              font-semibold
              text-center
              pb-3
            "

          >

            {dia.slice(
              0,
              3
            )}

          </div>

        )

      )}


      {/* =================================================
          DIAS
      ================================================== */}

      {calendario.map(

        (item, index) => {


          // =================================================
          // DIA PODE SER SELECIONADO?
          // =================================================

          const podeSelecionar =

            item.atual &&

            !item.passado


          return (

            <button

              key={index}

              onClick={() => {

                if (
                  podeSelecionar
                ) {

                  selecionarDia(
                    item.data
                  )

                }

              }}

              disabled={
                !podeSelecionar
              }

              className={`

                aspect-square

                w-full

                rounded-xl

                flex

                flex-col

                justify-center

                items-center

                text-sm

                font-medium

                transition-all

                duration-200

                gap-1

                border-2

                ${

                  item.hoje

                    ? 'bg-[#1E1E1E] border-[#D3AF37] text-[#D3AF37] shadow-lg shadow-[#D3AF37]/20'

                    : item.passado

                      ? 'bg-[#333333] border-[#333333] text-[#757575] cursor-not-allowed'

                      : item.atual

                        ? 'bg-[#1E1E1E] border-[#2A2A2A] text-[#E0E0E0] cursor-pointer hover:border-[#D3AF37] hover:bg-[#2A2A2A]'

                        : 'bg-[#1E1E1E] border-[#2A2A2A] text-[#757575] cursor-not-allowed'

                }

              `}

            >

              {item.dia}


              <div

                className={`

                  w-[8px]

                  h-[8px]

                  rounded-full

                  transition-all

                  duration-200

                  ${

                    item.hoje

                      ? 'bg-[#D3AF37]'

                      : item.atual && !item.passado

                        ? 'bg-[#FFFFFF]'

                        : 'bg-[#333333]'

                  }

                `}

              />

            </button>

          )

        }

      )}


    </div>


  </div>


</div>
)

}