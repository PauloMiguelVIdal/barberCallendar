
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
} from '../context/PersistData'

import {
  AgendamentoType
} from '../types/Agendamento'


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
    agendamentos
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



const DURACAO_BLOCO = 45

// Tempo que pode ultrapassar o bloco sem consumir o próximo
const TEMPO_TOLERANCIA = 20

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
  // HORÁRIOS DISPONÍVEIS
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
  // CONVERTER HORÁRIO PARA MINUTOS
  // =========================================================

  function horarioParaMinutos(
    horario: string
  ) {

    const [
      horas,
      minutos
    ] = horario
      .split(':')
      .map(Number)


    return (
      horas * 60 +
      minutos
    )

  }


  // =========================================================
  // VERIFICAR SE HORÁRIO ESTÁ OCUPADO
  // =========================================================
  //
  // Agora usamos:
  //
  // hora_inicio
  // hora_fim
  //
  // em vez de:
  //
  // hora
  // blocos
  // duracao
  //
  // =========================================================

  function horarioEstaOcupado(
    horarioVerificado: string
  ) {

    const minutoVerificado =
      horarioParaMinutos(
        horarioVerificado
      )


    return agendamentos.some(

      agendamento => {

        // =====================================================
        // IGNORAR OUTRAS DATAS
        // =====================================================

        if (
          agendamento.data !==
          dataFormatada
        ) {

          return false

        }


        // =====================================================
        // IGNORAR AGENDAMENTOS CANCELADOS
        // =====================================================

        if (
          agendamento.cancelado
        ) {

          return false

        }


        // =====================================================
        // INÍCIO
        // =====================================================

const inicioAgendamento =
    horarioParaMinutos(
        agendamento.hora_inicio.slice(0, 5)
    )

        // =====================================================
        // FIM
        // =====================================================

const fimAgendamento =
    horarioParaMinutos(
        agendamento.hora_fim.slice(0, 5)
    )


    const duracaoAgendamento =
    fimAgendamento -
    inicioAgendamento


const blocosAgendamento =
    Math.max(
        1,
        Math.ceil(
            (
                duracaoAgendamento -
                TEMPO_TOLERANCIA
            ) /
            DURACAO_BLOCO
        )
    )

        // =====================================================
        // VERIFICAR CONFLITO
        // =====================================================

return (
  minutoVerificado >= inicioAgendamento &&
  minutoVerificado < fimAgendamento
)

      }

    )

  }


  // =========================================================
  // ADAPTAR AGENDAMENTOS PARA O FORMULÁRIO
  // =========================================================
  //
  // O Formulario ainda está usando o formato antigo:
  //
  // hora
  // nome
  // telefone
  //
  // Portanto fazemos uma adaptação temporária.
  //
  // Isso NÃO altera o AgendamentoType.
  //
  // =========================================================

const agendamentosFormulario =
  agendamentos.map(
    (agendamento) => ({
      id: agendamento.id,
      data: agendamento.data,
      hora: agendamento.hora_inicio,
      nome: '',
      telefone: ''
    })
  )


  // =========================================================
  // ABRIR MODAL QUANDO VEM DO CALENDÁRIO SEMANAL
  // =========================================================

  useEffect(() => {

    if (
      !horarioSelecionado
    ) {

      return

    }


    const horarioExiste =
      horarios.some(

        horario =>
          horario.hora ===
          horarioSelecionado

      )


    if (
      !horarioExiste
    ) {

      return

    }


    setModalAgendamento(
      true
    )

  }, [
    horarioSelecionado
  ])


  // =========================================================
  // AGENDAR HORÁRIO
  // =========================================================
  //
  // IMPORTANTE:
  //
  // Esta função ainda precisa receber:
  //
  // cliente_id
  // servicos_id
  //
  // porque agora essas informações pertencem ao banco.
  //
  // =========================================================

  // function agendarHorario(
  //   nome: string,
  //   telefone: string,
  //   data: string,
  //   horario: string,
  //   blocos: number,
  //   duracao: number
  // ) {

  //   console.log(
  //     'Dados recebidos pelo formulário:',
  //     {
  //       nome,
  //       telefone,
  //       data,
  //       horario,
  //       blocos,
  //       duracao
  //     }
  //   )


  //   /*
  //     A criação real do agendamento será feita
  //     depois que o Formulario também passar:

  //     cliente_id
  //     servicos_id

  //     Exemplo:

  //     const novoAgendamento = {
  //       cliente_id,
  //       servicos_id,
  //       data,
  //       hora_inicio: horario,
  //       hora_fim,
  //       observacoes
  //     }

  //     adicionarAgendamento(
  //       novoAgendamento
  //     )
  //   */


  //   setModalAgendamento(
  //     false
  //   )


  //   selecionarHorario(
  //     null
  //   )

  // }


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

    <div
      className="
        w-full
        h-full
        bg-[#121212]
        text-[#E0E0E0]
        p-4
      "
    >

      {/* =====================================================
          CABEÇALHO
      ====================================================== */}

      <div
        className="
          w-full
          h-[80px]
          bg-[#121212]
          flex
          items-center
          justify-around
          border-b
          border-[#2A2A2A]
          mb-4
        "
      >

        {/* =================================================
            DIA ANTERIOR
        ================================================== */}

        <button

          onClick={
            diaAnterior
          }

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

                ? 'bg-[#333333] cursor-not-allowed'

                : 'bg-[#D3AF37] hover:bg-[#C4A032]'
            }
          `}

        >

          <ArrowBigLeft
            color="white"
          />

        </button>


        {/* =================================================
            DATA
        ================================================== */}

        <h1
          className="
            text-[25px]
            text-[#FFFFFF]
            text-center
            font-bold
          "
        >

          {diaVisualizado}/
          {mesVisualizado + 1}/
          {anoVisualizado}

        </h1>


        {/* =================================================
            PRÓXIMO DIA
        ================================================== */}

        <button

          onClick={
            proximoDia
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
          "

        >

          <ArrowBigRight
            color="white"
          />

        </button>

      </div>


      {/* =====================================================
          LISTA DE HORÁRIOS
      ====================================================== */}

      <div
        className="
          flex
          items-center
          flex-col
          mt-0
          pb-[80px]
          gap-2
          px-4
          bg-gradient-to-b
          from-[#121212]
          to-[#1E1E1E]
        "
      >

        {horarios.map(

          horario => {

            // =================================================
            // VERIFICAR OCUPAÇÃO
            // =================================================

            const ocupado =
              horarioEstaOcupado(
                horario.hora
              )


            // =================================================
            // HORÁRIO COM ESTADO ATUALIZADO
            // =================================================

            const horarioComEstado:
              horarioType = {

              ...horario,

              ocupado

            }


            return (

              <div
                key={horario.hora}
                className="w-full"
              >

                <button

                  onClick={() => {

                    // =================================================
                    // IMPEDIR HORÁRIO OCUPADO
                    // =================================================

                    if (
                      ocupado
                    ) {

                      return

                    }


                    // =================================================
                    // SELECIONAR HORÁRIO
                    // =================================================

                    selecionarHorario(
                      horario.hora
                    )


                    // =================================================
                    // ABRIR FORMULÁRIO
                    // =================================================

                    setModalAgendamento(
                      true
                    )

                  }}

                  className={`
                    w-full
                    py-3
                    px-4
                    rounded-lg
                    text-left
                    transition-colors
                    border-2

                    ${
                      ocupado

                        ? `
                          bg-[#333333]
                          text-[#757575]
                          border-[#333333]
                          cursor-not-allowed
                        `

                        : `
                          bg-[#000000]
                          text-[#D3AF37]
                          border-[#D3AF37]
                          hover:bg-[#2A2A2A]
                        `
                    }
                  `}

                >

                  <div
                    className="
                      flex
                      justify-between
                      items-center
                    "
                  >

                    <span
                      className={
                        ocupado
                          ? ''
                          : 'text-[#D3AF37]'
                      }
                    >
                      {horario.hora}
                    </span>


                    <span
                      className={`
                        text-sm

                        ${
                          ocupado
                            ? 'text-[#757575]'
                            : 'text-[#FFFFFF]'
                        }
                      `}
                    >
                      {
                        ocupado
                          ? 'ocupado'
                          : 'livre'
                      }
                    </span>

                  </div>

                </button>

              </div>

            )

          }

        )}


        {/* =================================================
            FORMULÁRIO
        ================================================== */}

        {
          modalAgendamento &&
          horarioSelecionado &&

          (

<Formulario

  horario={
    horarioSelecionado
  }

  data={
    dataFormatada
  }

agendamentos={agendamentosFormulario}

  fecharModal={() => {

    setModalAgendamento(false)

    selecionarHorario(null)

  }}

/>

          )
        }

      </div>

    </div>

  )

}

