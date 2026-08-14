import { supabase } from '../../lib/supabase'

import {
    ServicoType
} from '../types/Servico'


// ======================================================
// BUSCAR SERVIÇOS ATIVOS
// ======================================================

export async function buscarServicos(): Promise<ServicoType[]> {

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