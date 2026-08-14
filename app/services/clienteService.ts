import { supabase } from '../../lib/supabase'

import {
    ClienteType
} from '../types/Cliente'


// ======================================================
// BUSCAR TODOS OS CLIENTES
// ======================================================

export async function buscarClientes(): Promise<ClienteType[]> {

    const {
        data,
        error
    } = await supabase

        .from('clientes')

        .select(`
            id,
            nome,
            telefone,
            email,
            observacoes,
            created_at
        `)

        .order(
            'nome',
            {
                ascending: true
            }
        )


    if (error) {

        console.error(
            'Erro ao buscar clientes:',
            error
        )

        throw error

    }


    return data ?? []

}


// ======================================================
// BUSCAR CLIENTE POR ID
// ======================================================

export async function buscarClientePorId(
    id: string
): Promise<ClienteType | null> {

    const {
        data,
        error
    } = await supabase

        .from('clientes')

        .select(`
            id,
            nome,
            telefone,
            email,
            observacoes,
            created_at
        `)

        .eq(
            'id',
            id
        )

        .maybeSingle()


    if (error) {

        console.error(
            'Erro ao buscar cliente:',
            error
        )

        throw error

    }


    return data

}


// ======================================================
// BUSCAR CLIENTE POR TELEFONE
// ======================================================

export async function buscarClientePorTelefone(
    telefone: string
): Promise<ClienteType | null> {

    const {
        data,
        error
    } = await supabase

        .from('clientes')

        .select(`
            id,
            nome,
            telefone,
            email,
            observacoes,
            created_at
        `)

        .eq(
            'telefone',
            telefone
        )

        .maybeSingle()


    if (error) {

        console.error(
            'Erro ao buscar cliente por telefone:',
            error
        )

        throw error

    }


    return data

}


// ======================================================
// CRIAR CLIENTE
// ======================================================

export async function criarCliente(

    cliente: Omit<
        ClienteType,
        'id' | 'created_at'
    >

): Promise<ClienteType> {

    const {
        data,
        error
    } = await supabase

        .from('clientes')

        .insert(
            cliente
        )

        .select(`
            id,
            nome,
            telefone,
            email,
            observacoes,
            created_at
        `)

        .single()


    if (error) {

        console.error(
            'Erro ao criar cliente:',
            error
        )

        throw error

    }


    return data

}


// ======================================================
// ATUALIZAR CLIENTE
// ======================================================

export async function atualizarCliente(

    id: string,

    dados: Partial<
        Omit<
            ClienteType,
            'id' | 'created_at'
        >
    >

): Promise<ClienteType> {

    const {
        data,
        error
    } = await supabase

        .from('clientes')

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
            telefone,
            email,
            observacoes,
            created_at
        `)

        .single()


    if (error) {

        console.error(
            'Erro ao atualizar cliente:',
            error
        )

        throw error

    }


    return data

}