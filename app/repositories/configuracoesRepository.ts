import { supabase } from '@/lib/supabase'

export async function buscarConfiguracoes() {

    const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .single()

    if (error) {
        throw error
    }

    return data

}

export async function atualizarConfiguracoes(
    configuracoes: any
) {

    const { data, error } = await supabase
        .from('configuracoes')
        .update(configuracoes)
        .eq('id', configuracoes.id)
        .select()
        .single()

    if (error) {
        throw error
    }

    return data

}