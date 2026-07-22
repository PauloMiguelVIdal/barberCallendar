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

<div className="w-full max-w-[700px] mx-auto">


  {/* =====================================================
      CABEÇALHO
  ====================================================== */}

  <div className="
    w-full
    h-[80px]
    bg-white
    flex
    items-center
    justify-around
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

        ${

          anoVisualizado ===
            anoAtual &&

          mesVisualizado ===
            mesAtual

            ? 'bg-black/30 cursor-not-allowed'

            : 'bg-black'

        }

      `}

    >

      <ArrowBigLeft
        color="white"
      />

    </button>


    {/* NOME DO MÊS */}

    <h1 className="
      text-[30px]
      text-black
      font-semibold
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
        bg-black
        rounded-full
        items-center
        justify-center
      "

    >

      <ArrowBigRight
        color="white"
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
              text-black
              font-semibold
              text-center
              pb-2
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

                justify-center

                items-center

                text-sm

                font-medium

                transition-all

                flex-col

                gap-[15px]

                ${

                  item.hoje

                    ? 'bg-[#D3AF37] text-black'

                    : item.passado

                      ? 'bg-black/60 text-zinc-400 cursor-not-allowed'

                      : item.atual

                        ? 'bg-black text-white cursor-pointer hover:bg-[#D3AF37] hover:text-black'

                        : 'bg-black/10 text-zinc-500 cursor-not-allowed'

                }

              `}

            >

              {item.dia}


              <span

                className={`

                  w-[10px]

                  h-[10px]

                  rounded-full

                  ${

                    item.hoje

                      ? 'bg-white'

                      : item.atual

                        ? 'bg-white'

                        : 'bg-black/20'

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