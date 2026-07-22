'use client'

import {
  ArrowBigLeft,
  ArrowBigRight
} from 'lucide-react'

import {
  useEffect,
  useState
} from 'react'

import Horario from './Horario'
import Formulario from './Formulario'

import {
  horarioType
} from '../types/horario'

import {
  useCentralDados,
  useAgendamentos
} from './PersistData'


export default function Callendar() {


  // =========================================================
  // CONTEXT
  // =========================================================

  const {

    dataVisualizada,

    horarioSelecionado,

    selecionarHorario,

    proximoDia,

    diaAnterior

  } = useCentralDados()


  // =========================================================
  // AGENDAMENTOS
  // =========================================================

  const {

    agendamentos,

    adicionarAgendamento

  } = useAgendamentos()


  // =========================================================
  // ESTADO DO MODAL
  // =========================================================

  const [
    modalAgendamento,
    setModalAgendamento
  ] = useState(false)


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


  // =========================================================
  // DATA VISUALIZADA
  // =========================================================

  const diaVisualizado =
    dataVisualizada.getDate()

  const mesVisualizado =
    dataVisualizada.getMonth()

  const anoVisualizado =
    dataVisualizada.getFullYear()


  // =========================================================
  // HORÁRIOS
  // =========================================================

  const horarios: horarioType[] = [

    { hora: '9:00', ocupado: false },

    { hora: '9:45', ocupado: false },

    { hora: '10:30', ocupado: false },

    { hora: '11:15', ocupado: false },

    { hora: '12:00', ocupado: false },

    { hora: '12:45', ocupado: false },

    { hora: '13:30', ocupado: false },

    { hora: '14:15', ocupado: false },

    { hora: '15:00', ocupado: false },

    { hora: '15:45', ocupado: false },

    { hora: '16:30', ocupado: false },

    { hora: '17:15', ocupado: false },

    { hora: '18:00', ocupado: false },

    { hora: '18:45', ocupado: false },

    { hora: '19:30', ocupado: false }

  ]


  // =========================================================
  // DATA FORMATADA
  // =========================================================

  const dataFormatada =

    `${anoVisualizado}-${String(
      mesVisualizado + 1
    ).padStart(2, '0')}-${String(
      diaVisualizado
    ).padStart(2, '0')}`


  // =========================================================
  // ABRIR MODAL QUANDO VEM DA SEMANA
  // =========================================================

  useEffect(() => {

    if (!horarioSelecionado) {

      return

    }


    const horarioEncontrado =
      horarios.find(

        horario =>
          horario.hora ===
          horarioSelecionado

      )


    if (!horarioEncontrado) {

      return

    }


    setModalAgendamento(true)

  }, [
    horarioSelecionado
  ])


  // =========================================================
  // AGENDAR
  // =========================================================

  function agendarHorario(
    nome: string,
    telefone: string
  ) {

    if (!horarioSelecionado) {

      return

    }


    const novoAgendamento = {

      id:
        crypto.randomUUID(),

      data:
        dataFormatada,

      hora:
        horarioSelecionado,

      nome,

      telefone

    }


    adicionarAgendamento(
      novoAgendamento
    )


    setModalAgendamento(
      false
    )


    selecionarHorario(
      null
    )

  }


  // =========================================================
  // MESES
  // =========================================================

  const meses = [

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
  // RENDER
  // =========================================================

  return (

    <div className="w-full h-full">


      {/* CABEÇALHO */}

      <div className="
        w-full
        h-[80px]
        bg-white
        flex
        items-center
        justify-around
      ">


        {/* ANTERIOR */}

        <button

          onClick={diaAnterior}

          disabled={
            dataVisualizada.getTime() ===
            hoje.getTime()
          }

          className={`
            flex
            w-[50px]
            h-[50px]
            rounded-full
            items-center
            justify-center

            ${
              dataVisualizada.getTime() ===
              hoje.getTime()

                ? 'bg-black/30 cursor-not-allowed'

                : 'bg-black'
            }
          `}

        >

          <ArrowBigLeft color="white" />

        </button>


        {/* DATA */}

        <h1 className="
          text-[25px]
          text-black
          text-center
        ">

          {diaVisualizado}/
          {mesVisualizado + 1}/
          {anoVisualizado}

        </h1>


        {/* PRÓXIMO */}

        <button

          onClick={proximoDia}

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

          <ArrowBigRight color="white" />

        </button>


      </div>


      {/* MÊS */}

      <div className="
        text-center
        text-black
        font-bold
        text-xl
        mt-2
      ">

        {meses[mesVisualizado]}

      </div>


      {/* HORÁRIOS */}

      <div className="
        flex
        items-center
        flex-col
        mt-4
      ">


        {horarios.map(
          horario => {


            const ocupado =
              agendamentos.some(

                agendamento =>

                  agendamento.data ===
                  dataFormatada &&

                  agendamento.hora ===
                  horario.hora

              )


            const horarioComEstado:
              horarioType = {

              ...horario,

              ocupado

            }


            return (

              <Horario

                key={
                  horario.hora
                }

                horario={
                  horarioComEstado
                }

                onSelecionar={
                  horarioSelecionado => {

                    selecionarHorario(
                      horarioSelecionado.hora
                    )

                    setModalAgendamento(
                      true
                    )

                  }
                }

              />

            )

          }

        )}


        {/* FORMULÁRIO */}

        {
          modalAgendamento &&
          horarioSelecionado &&

          (

            <Formulario

              horario={
                horarioSelecionado
              }

              fecharModal={() => {

                setModalAgendamento(
                  false
                )

                selecionarHorario(
                  null
                )

              }}

              agendarHorario={
                agendarHorario
              }

            />

          )

        }


      </div>


    </div>

  )

}