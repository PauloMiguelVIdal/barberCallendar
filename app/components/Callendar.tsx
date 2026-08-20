// components/Callendar.tsx (versão cliente - sem admin)
'use client'

import {
  ArrowBigLeft,
  ArrowBigRight,
  CalendarCheck,
  Clock,
  X
} from 'lucide-react'

import {
  useEffect,
  useState
} from 'react'

import Formulario from './Formulario'

import {
  horarioType
} from '../types/horario'

import {
  useCentralDados,
  useAgendamentos
} from '../context/PersistData'

export default function Callendar() {

  // =========================================================
  // CONTEXT
  // =========================================================

  const {
    dataVisualizada,
    horarioSelecionado,
    selecionarHorario,
    proximoDia,
    diaAnterior,
    interfaceView
  } = useCentralDados()

  // =========================================================
  // AGENDAMENTOS
  // =========================================================

  const {
    agendamentos,
    isLoading
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

  const diaVisualizado = dataVisualizada.getDate()
  const mesVisualizado = dataVisualizada.getMonth()
  const anoVisualizado = dataVisualizada.getFullYear()
  const diaDaSemana = dataVisualizada.getDay()
  
  // Verificar dias específicos
  const ehDomingo = diaDaSemana === 0
  const ehSegunda = diaDaSemana === 1
  const ehSexta = diaDaSemana === 5
  const ehSabado = diaDaSemana === 6
  
  // Dias que a barbearia está fechada (Domingo e Segunda)
  const estaFechada = ehDomingo || ehSegunda
  
  // Dias que é por ordem de chegada (Sexta e Sábado)
  const ehOrdemChegada = ehSexta || ehSabado

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
  // FUNÇÕES AUXILIARES
  // =========================================================

  function horarioParaMinutos(horario: string) {
    const [horas, minutos] = horario.split(':').map(Number)
    return (horas * 60 + minutos)
  }

  // =========================================================
  // VERIFICAR SE HORÁRIO ESTÁ OCUPADO
  // =========================================================

  function horarioEstaOcupado(horarioVerificado: string) {

    // Se estiver fechado ou for ordem de chegada, todos os horários estão indisponíveis
    if (estaFechada || ehOrdemChegada) {
      return true
    }

    const minutoVerificado = horarioParaMinutos(horarioVerificado)

    return agendamentos.some(agendamento => {
      if (agendamento.data !== dataFormatada) return false
      if (agendamento.cancelado) return false

      const inicioAgendamento = horarioParaMinutos(agendamento.hora_inicio.slice(0, 5))
      const fimAgendamento = horarioParaMinutos(agendamento.hora_fim.slice(0, 5))

      return (minutoVerificado >= inicioAgendamento && minutoVerificado < fimAgendamento)
    })
  }

  // =========================================================
  // ADAPTAR AGENDAMENTOS PARA O FORMULÁRIO
  // =========================================================

  const agendamentosFormulario = agendamentos.map(
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

    if (!horarioSelecionado) {
      return
    }

    if (estaFechada || ehOrdemChegada) {
      selecionarHorario(null)
      return
    }

    const horarioExiste = horarios.some(horario => horario.hora === horarioSelecionado)

    if (!horarioExiste) {
      return
    }

    setModalAgendamento(true)

  }, [horarioSelecionado, estaFechada, ehOrdemChegada])

  // =========================================================
  // NOME DOS DIAS DA SEMANA
  // =========================================================

  const diasSemana = [
    'Domingo', 'Segunda', 'Terça', 'Quarta',
    'Quinta', 'Sexta', 'Sábado'
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
        overflow-y-auto
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
          flex-wrap
          gap-2
        "
      >

        {/* DIA ANTERIOR */}
        <button
          onClick={diaAnterior}
          disabled={dataVisualizada.getTime() === hoje.getTime()}
          className={`
            flex
            w-[50px]
            h-[50px]
            rounded-full
            items-center
            justify-center
            ${dataVisualizada.getTime() === hoje.getTime()
              ? 'bg-[#333333] cursor-not-allowed'
              : 'bg-[#D3AF37] hover:bg-[#C4A032]'
            }
          `}
        >
          <ArrowBigLeft color="white" />
        </button>

        {/* DATA */}
        <div className="text-center">
          <h1 className="text-[25px] text-[#FFFFFF] text-center font-bold">
            {diaVisualizado}/{mesVisualizado + 1}/{anoVisualizado}
          </h1>
          <p className={`text-sm mt-1 ${
            estaFechada 
              ? 'text-[#FF6B6B]' 
              : ehOrdemChegada 
                ? 'text-[#FFA500]' 
                : 'text-[#AAAAAA]'
          }`}>
            {diasSemana[diaDaSemana]}
          </p>
        </div>

        {/* PRÓXIMO DIA */}
        <button
          onClick={proximoDia}
          className="flex w-[50px] h-[50px] bg-[#D3AF37] rounded-full items-center justify-center hover:bg-[#C4A032]"
        >
          <ArrowBigRight color="white" />
        </button>

      </div>

      {/* =====================================================
          MENSAGEM DE FECHADO (DOMINGO E SEGUNDA)
      ====================================================== */}

      {estaFechada && (
        <div className="w-full p-6 mb-4 bg-[#2A1A1A] border-2 border-[#FF6B6B] rounded-lg text-center">
          <p className="text-[#FF6B6B] text-lg font-bold">🔒 BARBEARIA FECHADA</p>
          <p className="text-[#E0E0E0] mt-2">
            {ehDomingo 
              ? 'Aos domingos não realizamos atendimento.' 
              : 'Às segundas-feiras não realizamos atendimento.'}
          </p>
          <p className="text-[#A0A0A0] text-sm mt-1">
            Retornamos com os atendimentos a partir de terça-feira.
          </p>
        </div>
      )}

      {/* =====================================================
          MENSAGEM DE ORDEM DE CHEGADA (SEXTA E SÁBADO)
      ====================================================== */}

      {ehOrdemChegada && (
        <div className="w-full p-6 mb-4 bg-[#2A1A1A] border-2 border-[#FFA500] rounded-lg text-center">
          <p className="text-[#FFA500] text-lg font-bold">⏰ ATENDIMENTO POR ORDEM DE CHEGADA</p>
          <p className="text-[#E0E0E0] mt-2">
            {ehSexta 
              ? 'Às sextas-feiras o atendimento é realizado por ordem de chegada.' 
              : 'Aos sábados o atendimento é realizado por ordem de chegada.'}
          </p>
          <p className="text-[#A0A0A0] text-sm mt-1">
            Não é possível realizar agendamentos para este dia.
            Chegue cedo para garantir seu horário!
          </p>
        </div>
      )}

      {/* =====================================================
          LISTA DE HORÁRIOS (MODO USUÁRIO)
      ====================================================== */}

      <div className="flex items-center flex-col mt-0 pb-[80px] gap-2 px-4 bg-gradient-to-b from-[#121212] to-[#1E1E1E]">
        {isLoading ? (
          <div className="w-full flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-12 h-12 border-4 border-[#D3AF37] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#A0A0A0] text-sm animate-pulse">Carregando agendamentos...</p>
            <div className="w-full max-w-[500px] flex flex-col gap-2 mt-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="w-full h-[52px] bg-[#1E1E1E] rounded-lg animate-pulse border border-[#2A2A2A]" />
              ))}
            </div>
          </div>
        ) : (
          horarios.map(horario => {
            const ocupado = horarioEstaOcupado(horario.hora)
            const indisponivel = estaFechada || ehOrdemChegada || ocupado
            
            return (
              <div key={horario.hora} className="w-full">
                <button
                  onClick={() => {
                    if (indisponivel) { return }
                    selecionarHorario(horario.hora)
                    setModalAgendamento(true)
                  }}
                  className={`
                    w-full
                    py-3
                    px-4
                    rounded-lg
                    text-left
                    transition-colors
                    border-2
                    ${indisponivel
                      ? `bg-[#333333] text-[#757575] border-[#333333] cursor-not-allowed`
                      : `bg-[#000000] text-[#D3AF37] border-[#D3AF37] hover:bg-[#2A2A2A]`
                    }
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className={indisponivel ? '' : 'text-[#D3AF37]'}>
                      {horario.hora}
                    </span>
                    <span className={`text-sm ${indisponivel ? 'text-[#757575]' : 'text-[#FFFFFF]'}`}>
                      {estaFechada 
                        ? 'fechado' 
                        : ehOrdemChegada 
                          ? 'ordem de chegada' 
                          : ocupado 
                            ? 'ocupado' 
                            : 'livre'
                      }
                    </span>
                  </div>
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* =====================================================
          FORMULÁRIO (MODO USUÁRIO)
      ====================================================== */}

      {
        modalAgendamento &&
        horarioSelecionado &&
        !estaFechada &&
        !ehOrdemChegada &&
        !isLoading && (
          <Formulario
            horario={horarioSelecionado}
            data={dataFormatada}
            agendamentos={agendamentosFormulario}
            fecharModal={() => {
              setModalAgendamento(false)
              selecionarHorario(null)
            }}
          />
        )
      }

    </div>
  )
}