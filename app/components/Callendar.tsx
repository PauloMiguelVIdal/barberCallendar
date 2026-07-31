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
    adicionarAgendamento,
    adicionarAgendamentoCliente
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
  // DIAS DA SEMANA
  // =========================================================

  const diasSemana = [
    'Dom',
    'Seg',
    'Ter',
    'Qua',
    'Qui',
    'Sex',
    'Sáb'
  ]


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
  // VERIFICAR SE UM HORÁRIO ESTÁ OCUPADO
  // =========================================================

  function horarioEstaOcupado(
    horarioVerificado: string
  ) {

    const DURACAO_BLOCO = 45


    const minutoVerificado =
      horarioParaMinutos(
        horarioVerificado
      )


    return agendamentos.some(

      agendamento => {

        // =====================================================
        // VERIFICAR DATA
        // =====================================================

        if (
          agendamento.data !==
          dataFormatada
        ) {

          return false

        }


        // =====================================================
        // HORÁRIO DE INÍCIO
        // =====================================================

        const inicioAgendamento =
          horarioParaMinutos(
            agendamento.hora
          )


        // =====================================================
        // BLOCOS OCUPADOS
        // =====================================================

        const blocosOcupados =

          agendamento.blocos ??

          (
            agendamento.duracao

              ? Math.ceil(
                  agendamento.duracao /
                  DURACAO_BLOCO
                )

              : 1
          )


        // =====================================================
        // FINAL DO AGENDAMENTO
        // =====================================================

        const fimAgendamento =

          inicioAgendamento +

          (
            blocosOcupados *
            DURACAO_BLOCO
          )


        // =====================================================
        // VERIFICAR CONFLITO
        // =====================================================

        return (

          minutoVerificado >=
          inicioAgendamento

          &&

          minutoVerificado <
          fimAgendamento

        )

      }

    )

  }


  // =========================================================
  // ABRIR MODAL QUANDO VEM DO CALENDÁRIO SEMANAL
  // =========================================================

  useEffect(() => {

    if (!horarioSelecionado) {

      return

    }


    const horarioExiste =
      horarios.some(

        horario =>
          horario.hora ===
          horarioSelecionado

      )


    if (!horarioExiste) {

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
  // A data e o horário usados aqui são exatamente aqueles
  // enviados pelo Formulario.
  //
  // Isso permite que o cliente:
  //
  // - altere o horário;
  // - escolha uma sugestão;
  // - escolha outro dia;
  // - escolha o mesmo horário em outro dia.
  //
  // =========================================================

  function agendarHorario(

    nome: string,

    telefone: string,

    data: string,

    horario: string,

    blocos: number,

    duracao: number

  ) {

    // =======================================================
    // CRIAR AGENDAMENTO
    // =======================================================

    const novoAgendamento = {

      id:
        crypto.randomUUID(),

      data,

      hora:
        horario,

      nome,

      telefone,

      blocos,

      duracao

    }


    // =======================================================
    // SALVAR NO SISTEMA
    // =======================================================

    adicionarAgendamento(
      novoAgendamento
    )


    // =======================================================
    // SALVAR NO HISTÓRICO DO CLIENTE
    // =======================================================

    adicionarAgendamentoCliente(
      novoAgendamento
    )


    // =======================================================
    // FECHAR MODAL
    // =======================================================

    setModalAgendamento(
      false
    )


    // =======================================================
    // LIMPAR HORÁRIO SELECIONADO
    // =======================================================

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

    <div className="
      w-full
      h-full
      bg-[#121212]
      text-[#E0E0E0]
    ">

      {/* =====================================================
          MÊS
      ====================================================== */}

      {/* <div className="
        text-center
        text-[#E0E0E0]
        font-bold
        text-xl
        mt-2
      ">

        {meses[mesVisualizado]}

      </div> */}

      {/* =====================================================
          CABEÇALHO
      ====================================================== */}

      <div className="
        w-full
        h-[80px]
       
        flex
        items-center
        justify-around
        
        
      ">


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

        <h1 className="
          text-[25px]
          text-[#FFFFFF]
          text-center
          font-bold
        ">

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
          DIAS DA SEMANA
      ====================================================== */}

      <div className="
        flex
        justify-around
        px-4
        mt-4
        text-[#A0A0A0]
        text-sm
      ">

      </div>


      {/* =====================================================
          OPÇÃO (LEGENDA)
      ====================================================== */}


      {/* =====================================================
          LISTA DE HORÁRIOS
      ====================================================== */}

      <div className="
        flex
        items-center
        flex-col
        mt-0
        gap-2
        px-4
       bg-gradient-to-b from-[#121212] to-[#1E1E1E]
      ">


        {horarios.map(

          horario => {

            // =================================================
            // VERIFICAR SE O HORÁRIO ESTÁ OCUPADO
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

                    if (ocupado) {

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
                        ? 'bg-[#333333] text-[#757575] border-[#333333] cursor-not-allowed'
                        : 'bg-[#000000] text-[#D3AF37] border-[#D3AF37] hover:bg-[#2A2A2A]'
                    }
                  `}

                >

                  <div className="flex justify-between items-center">
                    <span className={ocupado ? '' : 'text-[#D3AF37]'}>{horario.hora}</span>
                    <span className={`
                      text-sm
                      ${ocupado ? 'text-[#757575]' : 'text-[#FFFFFF]'}
                    `}>
                      {ocupado ? 'ocupado' : 'livre'}
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

              agendamentos={
                agendamentos
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