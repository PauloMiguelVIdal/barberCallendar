import { supabase } from '../../lib/supabase'

import {
    AgendamentoType
} from '../types/Agendamento'

import {
    CriarAgendamentoType
} from '../types/CriarAgendamento'


// ======================================================
// TIPO DO AGENDAMENTO COM RELACIONAMENTOS
// ======================================================

export type AgendamentoComRelacionamentos = {

    id: string

    cliente_id: string

    data: string

    hora_inicio: string

    hora_fim: string

    observacoes: string | null

    concluido: boolean

    cancelado: boolean

    created_at: string

    clientes: {

        id: string

        nome: string | null

        telefone: string | null

    }[]

    agendamento_servicos: {

        servicos: {

            id: string

            nome: string

            valor: number

            duracao: number

        }[]

    }[]

}


// ======================================================
// BUSCAR TODOS OS AGENDAMENTOS
// ======================================================

export async function buscarAgendamentos(): Promise<
    AgendamentoComRelacionamentos[]
> {

    const {
        data,
        error
    } = await supabase

        .from('agendamentos')

        .select(`
            id,
            cliente_id,
            data,
            hora_inicio,
            hora_fim,
            observacoes,
            concluido,
            cancelado,
            created_at,

            clientes (
                id,
                nome,
                telefone
            ),

            agendamento_servicos (

                servicos (

                    id,
                    nome,
                    valor,
                    duracao

                )

            )
        `)

        .order(
            'data',
            {
                ascending: true
            }
        )

        .order(
            'hora_inicio',
            {
                ascending: true
            }
        )


    if (error) {

        console.error(
            'Erro ao buscar agendamentos:',
            error
        )

        throw error

    }


    return data ?? []

}


// ======================================================
// BUSCAR AGENDAMENTOS POR CLIENTE
// ======================================================

export async function buscarAgendamentosPorCliente(

    clienteId: string

): Promise<AgendamentoComRelacionamentos[]> {


    const {
        data,
        error
    } = await supabase

        .from('agendamentos')

        .select(`
            id,
            cliente_id,
            data,
            hora_inicio,
            hora_fim,
            observacoes,
            concluido,
            cancelado,
            created_at,

            clientes (

                id,
                nome,
                telefone

            ),

            agendamento_servicos (

                servicos (

                    id,
                    nome,
                    valor,
                    duracao

                )

            )
        `)

        .eq(
            'cliente_id',
            clienteId
        )

        .eq(
            'cancelado',
            false
        )

        .order(
            'data',
            {
                ascending: true
            }
        )

        .order(
            'hora_inicio',
            {
                ascending: true
            }
        )


    if (error) {

        console.error(
            'Erro ao buscar agendamentos do cliente:',
            error
        )

        throw error

    }


    return data ?? []

}


// ======================================================
// BUSCAR AGENDAMENTOS POR DATA
// ======================================================
//
// Essa função continua existindo.
//
// Ela busca somente um dia.
//
// É útil principalmente para componentes que trabalham
// exclusivamente com uma data.
//
// ======================================================

export async function buscarAgendamentosPorData(

    data: string

): Promise<AgendamentoType[]> {

    const {
        data: agendamentos,
        error
    } = await supabase

        .from('agendamentos')

        .select(`
            id,
            cliente_id,
            data,
            hora_inicio,
            hora_fim,
            observacoes,
            concluido,
            cancelado,
            created_at
        `)

        .eq(
            'data',
            data
        )

        .eq(
            'cancelado',
            false
        )

        .order(
            'hora_inicio',
            {
                ascending: true
            }
        )


    if (error) {

        console.error(
            'Erro ao buscar agendamentos da data:',
            error
        )

        throw error

    }


    return agendamentos ?? []

}


// ======================================================
// BUSCAR AGENDAMENTOS POR PERÍODO
// ======================================================
//
// Essa função é utilizada principalmente pelo
// CallendarWeek.
//
// Exemplo:
//
// dataInicio = '2026-08-16'
// dataFim    = '2026-08-22'
//
// O Supabase retornará todos os agendamentos existentes
// entre essas duas datas, inclusive.
//
// ======================================================

export async function buscarAgendamentosPorPeriodo(

    dataInicio: string,

    dataFim: string

): Promise<AgendamentoType[]> {

    const {
        data: agendamentos,
        error
    } = await supabase

        .from('agendamentos')

        .select(`
            id,
            cliente_id,
            data,
            hora_inicio,
            hora_fim,
            observacoes,
            concluido,
            cancelado,
            created_at
        `)

        // ==============================================
        // DATA INICIAL
        // ==============================================

        .gte(
            'data',
            dataInicio
        )

        // ==============================================
        // DATA FINAL
        // ==============================================

        .lte(
            'data',
            dataFim
        )

        // ==============================================
        // IGNORAR CANCELADOS
        // ==============================================

        .eq(
            'cancelado',
            false
        )

        // ==============================================
        // ORDENAR POR DATA
        // ==============================================

        .order(
            'data',
            {
                ascending: true
            }
        )

        // ==============================================
        // ORDENAR POR HORÁRIO
        // ==============================================

        .order(
            'hora_inicio',
            {
                ascending: true
            }
        )


    if (error) {

        console.error(
            'Erro ao buscar agendamentos por período:',
            error
        )

        throw error

    }


    return agendamentos ?? []

}


// ======================================================
// CRIAR AGENDAMENTO
// ======================================================

export async function criarAgendamento(

    agendamento: CriarAgendamentoType

): Promise<AgendamentoType> {

    const {
        data,
        error
    } = await supabase

        .from('agendamentos')

        .insert({

            cliente_id:
                agendamento.cliente_id,

            data:
                agendamento.data,

            hora_inicio:
                agendamento.hora_inicio,

            hora_fim:
                agendamento.hora_fim,

            observacoes:
                agendamento.observacoes ?? null,

            concluido:
                agendamento.concluido ?? false,

            cancelado:
                agendamento.cancelado ?? false

        })

        .select(`
            id,
            cliente_id,
            data,
            hora_inicio,
            hora_fim,
            observacoes,
            concluido,
            cancelado,
            created_at
        `)

        .single()


    if (error) {

        console.error(
            'Erro ao criar agendamento:',
            error
        )

        throw error

    }


    // ==================================================
    // CRIAR RELACIONAMENTOS COM SERVIÇOS
    // ==================================================

    const registrosServicos =
        agendamento.servicos_id.map(

            servicoId => ({

                agendamento_id:
                    data.id,

                servico_id:
                    servicoId

            })

        )


    const {
        error: erroServicos
    } = await supabase

        .from('agendamento_servicos')

        .insert(
            registrosServicos
        )


    if (erroServicos) {

        console.error(
            'Erro ao vincular serviços ao agendamento:',
            erroServicos
        )

        throw erroServicos

    }


    return data

}


// ======================================================
// CANCELAR AGENDAMENTO
// ======================================================

export async function cancelarAgendamento(

    id: string

): Promise<AgendamentoType> {

    const {
        data,
        error
    } = await supabase

        .from('agendamentos')

        .update({

            cancelado: true

        })

        .eq(
            'id',
            id
        )

        .select(`
            id,
            cliente_id,
            data,
            hora_inicio,
            hora_fim,
            observacoes,
            concluido,
            cancelado,
            created_at
        `)

        .single()


    if (error) {

        console.error(
            'Erro ao cancelar agendamento:',
            error
        )

        throw error

    }


    return data

}