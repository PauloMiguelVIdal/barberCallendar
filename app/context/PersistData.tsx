'use client'

import React, {
createContext,
useContext,
useState,useEffect
} from 'react'

import { AgendamentoType } from '../types/Agendamento'

// ======================================================
// TIPOS
// ======================================================

type CentralDadosContextType = {

// ====================================================
// AGENDAMENTOS
// ====================================================

agendamentos: AgendamentoType[]

adicionarAgendamento: (
agendamento: AgendamentoType
) => void

removerAgendamento: (
id: string
) => void

// ====================================================
// AGENDAMENTOS DO CLIENTE
// ====================================================

agendamentosCliente: AgendamentoType[]

adicionarAgendamentoCliente: (
    agendamento: AgendamentoType
) => void

removerAgendamentoCliente: (
    id: string
) => void

// ====================================================
// DATA VISUALIZADA
// ====================================================

dataVisualizada: Date

definirDataVisualizada: (
data: Date
) => void

proximoDia: () => void

diaAnterior: () => void

proximaSemana: () => void

semanaAnterior: () => void

proximoMes: () => void

mesAnterior: () => void

// ====================================================
// DATA DO AGENDAMENTO
// ====================================================

dataAgendamento: string | null

definirDataAgendamento: (
data: string | null
) => void

// ====================================================
// HORÁRIO SELECIONADO
// ====================================================

horarioSelecionado: string | null

selecionarHorario: (
hora: string | null
) => void

// ====================================================
// INTERFACE
// ====================================================

interfaceView:
| 'day'
| 'week'
| 'month'
| 'appointments'

setInterfaceView: (
    view:
    | 'day'
    | 'week'
    | 'month'
    | 'appointments'
) => void

}

// ======================================================
// CONTEXT
// ======================================================

const CentralDadosContext =
createContext<CentralDadosContextType | null>(null)

// ======================================================
// PROVIDER
// ======================================================

export function CentralDadosProvider({
children
}: {
children: React.ReactNode
}) {

// ====================================================
// AGENDAMENTOS
// ====================================================

const [
agendamentos,
setAgendamentos
] = useState<AgendamentoType[]>([])

// ====================================================
// AGENDAMENTOS DO CLIENTE
// ====================================================

const [
    agendamentosCliente,
    setAgendamentosCliente
] = useState<AgendamentoType[]>([])


// ====================================================
// CARREGAR AGENDAMENTOS DO CLIENTE
// ====================================================

useEffect(() => {

    const dadosSalvos =
        localStorage.getItem(
            'brave-boss-agendamentos'
        )


    if (!dadosSalvos) {

        return

    }


    try {

        const agendamentosSalvos:
            AgendamentoType[] =
            JSON.parse(dadosSalvos)


        const hoje =
            new Date()

        hoje.setHours(
            0,
            0,
            0,
            0
        )


        const agendamentosValidos =
            agendamentosSalvos.filter(
                agendamento => {

                    const [
                        ano,
                        mes,
                        dia
                    ] = agendamento.data
                        .split('-')
                        .map(Number)


                    const dataAgendamento =
                        new Date(
                            ano,
                            mes - 1,
                            dia
                        )


                    dataAgendamento.setHours(
                        0,
                        0,
                        0,
                        0
                    )


                    return (
                        dataAgendamento >= hoje
                    )

                }
            )


        setAgendamentosCliente(
            agendamentosValidos
        )


        localStorage.setItem(

            'brave-boss-agendamentos',

            JSON.stringify(
                agendamentosValidos
            )

        )

    } catch {

        localStorage.removeItem(
            'brave-boss-agendamentos'
        )

    }

}, [])

function adicionarAgendamento(
novoAgendamento: AgendamentoType
) {

setAgendamentos(
  prev => [
    ...prev,
    novoAgendamento
  ]
)

}


function removerAgendamento(
id: string
) {

setAgendamentos(
  prev =>
    prev.filter(
      agendamento =>
        agendamento.id !== id
    )
)

}

// ====================================================
// ADICIONAR AGENDAMENTO DO CLIENTE
// ====================================================

function adicionarAgendamentoCliente(
    novoAgendamento: AgendamentoType
) {

    setAgendamentosCliente(
        prev => {

            const novosAgendamentos = [

                ...prev,

                novoAgendamento

            ]


            localStorage.setItem(

                'brave-boss-agendamentos',

                JSON.stringify(
                    novosAgendamentos
                )

            )


            return novosAgendamentos

        }
    )

}


// ====================================================
// REMOVER AGENDAMENTO DO CLIENTE
// ====================================================

function removerAgendamentoCliente(
    id: string
) {

    setAgendamentosCliente(
        prev => {

            const novosAgendamentos =
                prev.filter(
                    agendamento =>
                        agendamento.id !== id
                )


            localStorage.setItem(

                'brave-boss-agendamentos',

                JSON.stringify(
                    novosAgendamentos
                )

            )


            return novosAgendamentos

        }
    )

}

// ====================================================
// DATA VISUALIZADA
// ====================================================

const [
dataVisualizada,
setDataVisualizada
] = useState<Date>(
() => {

  const hoje = new Date()

  hoje.setHours(
    0,
    0,
    0,
    0
  )

  return hoje

}

)

// ====================================================
// DEFINIR DATA VISUALIZADA
// ====================================================

function definirDataVisualizada(
data: Date
) {

const novaData =
  new Date(data)

novaData.setHours(
  0,
  0,
  0,
  0
)

setDataVisualizada(
  novaData
)

}

// ====================================================
// NAVEGAÇÃO POR DIA
// ====================================================

function proximoDia() {

setDataVisualizada(
  prev => {

    const novaData =
      new Date(prev)

    novaData.setDate(
      novaData.getDate() + 1
    )

    return novaData

  }
)

}

function diaAnterior() {

setDataVisualizada(
  prev => {

    const novaData =
      new Date(prev)

    novaData.setDate(
      novaData.getDate() - 1
    )

    return novaData

  }
)

}

// ====================================================
// NAVEGAÇÃO POR SEMANA
// ====================================================

function proximaSemana() {

setDataVisualizada(
  prev => {

    const novaData =
      new Date(prev)

    novaData.setDate(
      novaData.getDate() + 7
    )

    return novaData

  }
)

}

function semanaAnterior() {

setDataVisualizada(
  prev => {

    const novaData =
      new Date(prev)

    novaData.setDate(
      novaData.getDate() - 7
    )

    return novaData

  }
)

}

// ====================================================
// NAVEGAÇÃO POR MÊS
// ====================================================

function proximoMes() {

setDataVisualizada(
  prev => {

    const novaData =
      new Date(prev)

    novaData.setMonth(
      novaData.getMonth() + 1
    )

    return novaData

  }
)

}

function mesAnterior() {

setDataVisualizada(
  prev => {

    const novaData =
      new Date(prev)

    novaData.setMonth(
      novaData.getMonth() - 1
    )

    return novaData

  }
)

}

// ====================================================
// DATA DO AGENDAMENTO
// ====================================================

const [
dataAgendamento,
setDataAgendamento
] = useState<string | null>(null)

function definirDataAgendamento(
data: string | null
) {

setDataAgendamento(
  data
)

}

// ====================================================
// HORÁRIO SELECIONADO
// ====================================================

const [
horarioSelecionado,
setHorarioSelecionado
] = useState<string | null>(null)

function selecionarHorario(
hora: string | null
) {

setHorarioSelecionado(
  hora
)

}

// ====================================================
// INTERFACE
// ====================================================

const [
    interfaceView,
    setInterfaceView
] = useState<
    'day'
    | 'week'
    | 'month'
    | 'appointments'
>('day')

// ====================================================
// PROVIDER
// ====================================================

return (

<CentralDadosContext.Provider
  value={{

    // =================================================
    // AGENDAMENTOS
    // =================================================

    agendamentos,

    adicionarAgendamento,

    removerAgendamento,

// =================================================
// AGENDAMENTOS DO CLIENTE
// =================================================

agendamentosCliente,

adicionarAgendamentoCliente,

removerAgendamentoCliente,


    // =================================================
    // DATA VISUALIZADA
    // =================================================

    dataVisualizada,

    definirDataVisualizada,

    proximoDia,

    diaAnterior,

    proximaSemana,

    semanaAnterior,

    proximoMes,

    mesAnterior,


    // =================================================
    // DATA DO AGENDAMENTO
    // =================================================

    dataAgendamento,

    definirDataAgendamento,


    // =================================================
    // HORÁRIO
    // =================================================

    horarioSelecionado,

    selecionarHorario,


    // =================================================
    // INTERFACE
    // =================================================

    interfaceView,

    setInterfaceView

  }}
>

  {children}

</CentralDadosContext.Provider>

)

}

// ======================================================
// HOOK PRINCIPAL
// ======================================================

export function useCentralDados() {

const context =
useContext(
CentralDadosContext
)

if (!context) {

throw new Error(
  'useCentralDados deve ser usado dentro do CentralDadosProvider'
)

}

return context

}

// ======================================================
// HOOK DE AGENDAMENTOS
// ======================================================

export function useAgendamentos() {

    const context =
        useCentralDados()


    return {

        agendamentos:
            context.agendamentos,

        adicionarAgendamento:
            context.adicionarAgendamento,

        removerAgendamento:
            context.removerAgendamento,


        agendamentosCliente:
            context.agendamentosCliente,

        adicionarAgendamentoCliente:
            context.adicionarAgendamentoCliente,

        removerAgendamentoCliente:
            context.removerAgendamentoCliente

    }

}