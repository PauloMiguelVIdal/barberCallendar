import { supabase } from '@/lib/supabase'
import { ServicoType } from '../types/Servico'

export async function buscarServicos(): Promise<ServicoType[]> {

    const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .order('nome')

    if (error) {
        throw error
    }

    return data

}

export async function criarServico(
    servico: Omit<ServicoType, 'id' | 'created_at'>
): Promise<ServicoType> {

    const { data, error } = await supabase
        .from('servicos')
        .insert(servico)
        .select()
        .single()

    if (error) {
        throw error
    }

    return data

}

export async function atualizarServico(
    servico: ServicoType
): Promise<ServicoType> {

    const { data, error } = await supabase
        .from('servicos')
        .update(servico)
        .eq('id', servico.id)
        .select()
        .single()

    if (error) {
        throw error
    }

    return data

}

export async function removerServico(
    id: string
): Promise<void> {

    const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', id)

    if (error) {
        throw error
    }

}