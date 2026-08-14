import { supabase } from '../../lib/supabase'

import {
    ServicoType
} from '../types/Servico'

// ======================================================
// BUSCAR TODOS OS SERVIÇOS
// ======================================================

export async function obterServicos(): Promise<ServicoType[]> {

    const {
        data,
        error
    } = await supabase

        .from('servicos')

        .select(`
            id,
            nome,
            duracao,
            valor,
            ativo,
            created_at
        `)

        .eq(
            'ativo',
            true
        )

        .order(
            'nome',
            {
                ascending: true
            }
        )


    if (error) {

        console.error(
            'Erro ao buscar serviços:',
            error
        )

        throw error

    }


    return data ?? []

}


// ======================================================
// BUSCAR SERVIÇO POR ID
// ======================================================

export async function buscarServicoPorId(
    id: string
): Promise<ServicoType | null> {

    const {
        data,
        error
    } = await supabase

        .from('servicos')

        .select(`
            id,
            nome,
            duracao,
            valor,
            ativo,
            created_at
        `)

        .eq(
            'id',
            id
        )

        .maybeSingle()


    if (error) {

        console.error(
            'Erro ao buscar serviço:',
            error
        )

        throw error

    }


    return data

}


// ======================================================
// CRIAR SERVIÇO
// ======================================================

export async function criarServico(

    servico: Omit<
        ServicoType,
        'id' | 'created_at'
    >

): Promise<ServicoType> {

    const {
        data,
        error
    } = await supabase

        .from('servicos')

        .insert(
            servico
        )

        .select(`
            id,
            nome,
            duracao,
            valor,
            ativo,
            created_at
        `)

        .single()


    if (error) {

        console.error(
            'Erro ao criar serviço:',
            error
        )

        throw error

    }


    return data

}


// ======================================================
// ATUALIZAR SERVIÇO
// ======================================================

export async function atualizarServico(

    id: string,

    dados: Partial<
        Omit<
            ServicoType,
            'id' | 'created_at'
        >
    >

): Promise<ServicoType> {

    const {
        data,
        error
    } = await supabase

        .from('servicos')

        .update(
            dados
        )

        .eq(
            'id',
            id
        )

        .select(`
            id,
            nome,
            duracao,
            valor,
            ativo,
            created_at
        `)

        .single()


    if (error) {

        console.error(
            'Erro ao atualizar serviço:',
            error
        )

        throw error

    }


    return data

}


// ======================================================
// DESATIVAR SERVIÇO
// ======================================================

export async function desativarServico(
    id: string
): Promise<ServicoType> {

    const {
        data,
        error
    } = await supabase

        .from('servicos')

        .update({
            ativo: false
        })

        .eq(
            'id',
            id
        )

        .select(`
            id,
            nome,
            duracao,
            valor,
            ativo,
            created_at
        `)

        .single()


    if (error) {

        console.error(
            'Erro ao desativar serviço:',
            error
        )

        throw error

    }


    return data

}