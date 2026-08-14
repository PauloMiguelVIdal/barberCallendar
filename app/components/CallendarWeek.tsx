'use client'

import { useEffect } from 'react'

import {
    ArrowBigLeft,
    ArrowBigRight
} from 'lucide-react'

import {
    horarioType
} from '../types/horario'

import {
    useCentralDados,
    useAgendamentos
} from '../context/PersistData'


export default function CallendarWeek() {


    // =========================================================
    // CONTEXT - DATA
    // =========================================================

    const {

        dataVisualizada,

        proximaSemana,

        semanaAnterior,

        definirDataVisualizada,

        selecionarHorario,

        setInterfaceView

    } = useCentralDados()


    // =========================================================
    // CONTEXT - AGENDAMENTOS
    // =========================================================

    const {

        agendamentos,
carregarAgendamentosPorPeriodo   
    } = useAgendamentos()


    // =========================================================
    // CONFIGURAÇÃO DOS BLOCOS
    // =========================================================

    const DURACAO_BLOCO = 45

    const TEMPO_TOLERANCIA = 20


    // =========================================================
    // LIMITE MÁXIMO DE AGENDAMENTO
    // =========================================================
    //
    // O cliente pode agendar até 6 semanas a partir de hoje.
    //
    // 6 semanas = 42 dias
    //
    // =========================================================

    const LIMITE_SEMANAS = 6

    const LIMITE_DIAS =
        LIMITE_SEMANAS * 7


    // =========================================================
    // HOJE
    // =========================================================

    const hoje =
        new Date()

    hoje.setHours(
        0,
        0,
        0,
        0
    )


    // =========================================================
    // DATA MÁXIMA PARA AGENDAMENTO
    // =========================================================

    const dataMaximaAgendamento =
        new Date(
            hoje
        )

    dataMaximaAgendamento.setDate(

        hoje.getDate() +

        LIMITE_DIAS

    )

    dataMaximaAgendamento.setHours(
        0,
        0,
        0,
        0
    )


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
    // INÍCIO DA SEMANA
    // =========================================================

    const inicioSemana =
        new Date(
            dataVisualizada
        )

    inicioSemana.setHours(
        0,
        0,
        0,
        0
    )

    inicioSemana.setDate(

        dataVisualizada.getDate() -

        dataVisualizada.getDay()

    )


    // =========================================================
    // VERIFICAR DATA PASSADA
    // =========================================================

    function dataEstaNoPassado(
        data: Date
    ) {

        const dataVerificacao =
            new Date(
                data
            )

        dataVerificacao.setHours(
            0,
            0,
            0,
            0
        )

        return (

            dataVerificacao.getTime() <

            hoje.getTime()

        )

    }


    // =========================================================
    // VERIFICAR SE DATA ULTRAPASSOU O LIMITE
    // =========================================================

    function dataEstaAlemDoLimite(
        data: Date
    ) {

        const dataVerificacao =
            new Date(
                data
            )

        dataVerificacao.setHours(
            0,
            0,
            0,
            0
        )

        return (

            dataVerificacao.getTime() >

            dataMaximaAgendamento.getTime()

        )

    }


    // =========================================================
    // VERIFICAR SE DATA ESTÁ INDISPONÍVEL
    // =========================================================

    function dataEstaIndisponivel(
        data: Date
    ) {

        return (

            dataEstaNoPassado(data) ||

            dataEstaAlemDoLimite(data)

        )

    }


    // =========================================================
    // FORMATAR DATA
    // =========================================================

    function formatarData(
        data: Date
    ) {

        return `${

            data.getFullYear()

        }-${String(

            data.getMonth() + 1

        ).padStart(

            2,
            '0'

        )}-${String(

            data.getDate()

        ).padStart(

            2,
            '0'

        )}`

    }


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

    function horarioEstaOcupado(

        dia: Date,

        horarioVerificado: string

    ) {

        const data =
            formatarData(
                dia
            )


        const minutoVerificado =
            horarioParaMinutos(
                horarioVerificado
            )


        return agendamentos.some(

            agendamento => {


                // =============================================
                // IGNORAR OUTRAS DATAS
                // =============================================

                if (

                    agendamento.data !==
                    data

                ) {

                    return false

                }


                // =============================================
                // IGNORAR CANCELADOS
                // =============================================

                if (

                    agendamento.cancelado

                ) {

                    return false

                }


                // =============================================
                // INÍCIO DO AGENDAMENTO
                // =============================================

                const inicioAgendamento =

                    horarioParaMinutos(

                        agendamento
                            .hora_inicio
                            .slice(0, 5)

                    )


                // =============================================
                // FIM DO AGENDAMENTO
                // =============================================

                const fimAgendamento =

                    horarioParaMinutos(

                        agendamento
                            .hora_fim
                            .slice(0, 5)

                    )


                // =============================================
                // DURAÇÃO
                // =============================================

                const duracaoAgendamento =

                    fimAgendamento -

                    inicioAgendamento


                // =============================================
                // BLOCOS
                // =============================================

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


                // =============================================
                // FIM REAL DOS BLOCOS
                // =============================================

                const fimBlocos =

                    inicioAgendamento +

                    (

                        blocosAgendamento *

                        DURACAO_BLOCO

                    )


                // =============================================
                // CONFLITO
                // =============================================

                return (

                    minutoVerificado >=

                    inicioAgendamento &&

                    minutoVerificado <

                    fimBlocos

                )

            }

        )

    }


    // =========================================================
    // SELECIONAR HORÁRIO
    // =========================================================

    function selecionarHorarioDaSemana(

        dia: Date,

        hora: string

    ) {


        // =============================================
        // DATA PASSADA
        // =============================================

        if (

            dataEstaNoPassado(
                dia
            )

        ) {

            return

        }


        // =============================================
        // DATA ALÉM DO LIMITE
        // =============================================

        if (

            dataEstaAlemDoLimite(
                dia
            )

        ) {

            return

        }


        // =============================================
        // HORÁRIO OCUPADO
        // =============================================

        if (

            horarioEstaOcupado(
                dia,
                hora
            )

        ) {

            return

        }


        // =============================================
        // ALTERAR DATA
        // =============================================

        definirDataVisualizada(
            dia
        )


        // =============================================
        // ALTERAR HORÁRIO
        // =============================================

        selecionarHorario(
            hora
        )


        // =============================================
        // ABRIR DIA
        // =============================================

        setInterfaceView(
            'day'
        )

    }


    // =========================================================
    // DIAS DA SEMANA
    // =========================================================

    const diasSemana: Date[] = []


    for (

        let i = 0;

        i < 7;

        i++

    ) {

        const dia =
            new Date(
                inicioSemana
            )


        dia.setDate(

            inicioSemana.getDate() +

            i

        )


        dia.setHours(
            0,
            0,
            0,
            0
        )


        diasSemana.push(
            dia
        )

    }


    // =========================================================
    // PRIMEIRO E ÚLTIMO DIA
    // =========================================================

    const primeiroDia =
        diasSemana[0]

    const ultimoDia =
        diasSemana[6]

        
        // =========================================================
    // BUSCAR AGENDAMENTOS DA SEMANA VISÍVEL
    // =========================================================

    useEffect(() => {

        const dataInicio =
            formatarData(
                primeiroDia
            )

        const dataFim =
            formatarData(
                ultimoDia
            )

        void carregarAgendamentosPorPeriodo(
            dataInicio,
            dataFim
        )

    }, [
        primeiroDia.getTime(),
        ultimoDia.getTime(),
        carregarAgendamentosPorPeriodo
    ])
    // =========================================================
    // INÍCIO DA SEMANA ATUAL
    // =========================================================

    const inicioSemanaAtual =
        new Date(
            hoje
        )

    inicioSemanaAtual.setDate(

        hoje.getDate() -

        hoje.getDay()

    )

    inicioSemanaAtual.setHours(
        0,
        0,
        0,
        0
    )


    // =========================================================
    // VERIFICAR SEMANA ATUAL
    // =========================================================

    const estaNaSemanaAtual =

        inicioSemana.getTime() ===

        inicioSemanaAtual.getTime()


    // =========================================================
    // PRÓXIMA SEMANA
    // =========================================================

    const inicioProximaSemana =
        new Date(
            inicioSemana
        )

    inicioProximaSemana.setDate(

        inicioSemana.getDate() +

        7

    )

    inicioProximaSemana.setHours(
        0,
        0,
        0,
        0
    )


    // =========================================================
    // VERIFICAR LIMITE DA PRÓXIMA SEMANA
    // =========================================================
    //
    // Se o primeiro dia da próxima semana já estiver depois
    // do limite máximo, não permitimos avançar.
    //
    // =========================================================

    const proximaSemanaUltrapassaLimite =

        inicioProximaSemana.getTime() >

        dataMaximaAgendamento.getTime()


    const podeAvancarSemana =

        !proximaSemanaUltrapassaLimite


    // =========================================================
    // NOMES DOS DIAS
    // =========================================================

    const diaSemanaNome = [

        'Domingo',

        'Segunda-feira',

        'Terça-feira',

        'Quarta-feira',

        'Quinta-feira',

        'Sexta-feira',

        'Sábado'

    ]


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="w-full overflow-auto bg-[#121212] p-4 rounded-xl">


            {/* =====================================================
                CABEÇALHO
            ====================================================== */}

            <div className="
                w-full
                h-[80px]
                bg-[#121212]
                flex
                items-center
                justify-around
                border-b
                border-[#2A2A2A]
                mb-4
            ">


                {/* SEMANA ANTERIOR */}

                <button

                    onClick={
                        semanaAnterior
                    }

                    disabled={
                        estaNaSemanaAtual
                    }

                    className={`
                        flex
                        w-[50px]
                        h-[50px]
                        rounded-full
                        items-center
                        justify-center
                        transition-all
                        duration-200

                        ${
                            estaNaSemanaAtual

                                ? 'bg-[#333333] cursor-not-allowed'

                                : 'bg-[#D3AF37] hover:bg-[#C4A032] hover:scale-105'
                        }
                    `}

                >

                    <ArrowBigLeft

                        color={
                            estaNaSemanaAtual
                                ? '#757575'
                                : '#121212'
                        }

                        size={24}

                    />

                </button>


                {/* PERÍODO */}

                <div className="flex flex-col items-center">

                    <h1 className="
                        text-[25px]
                        text-[#FFFFFF]
                        font-bold
                        text-center
                    ">

                        {primeiroDia.getDate()}
                        /
                        {primeiroDia.getMonth() + 1}

                        {' - '}

                        {ultimoDia.getDate()}
                        /
                        {ultimoDia.getMonth() + 1}

                    </h1>

                    <span className="
                        text-[11px]
                        text-[#757575]
                        mt-1
                    ">

                        Agendamentos até{' '}

                        {dataMaximaAgendamento.getDate()}
                        /
                        {dataMaximaAgendamento.getMonth() + 1}
                        /
                        {dataMaximaAgendamento.getFullYear()}

                    </span>

                </div>


                {/* PRÓXIMA SEMANA */}

                <button

                    onClick={() => {

                        if (
                            !podeAvancarSemana
                        ) {

                            return

                        }

                        proximaSemana()

                    }}

                    disabled={
                        !podeAvancarSemana
                    }

                    className={`
                        flex
                        w-[50px]
                        h-[50px]
                        rounded-full
                        items-center
                        justify-center
                        transition-all
                        duration-200

                        ${
                            !podeAvancarSemana

                                ? 'bg-[#333333] cursor-not-allowed'

                                : 'bg-[#D3AF37] hover:bg-[#C4A032] hover:scale-105'
                        }
                    `}

                >

                    <ArrowBigRight

                        color={
                            !podeAvancarSemana
                                ? '#757575'
                                : '#121212'
                        }

                        size={24}

                    />

                </button>


            </div>


            {/* =====================================================
                CABEÇALHO DOS DIAS
            ====================================================== */}

            <div className="
                grid
                grid-cols-8
                gap-2
                mb-4
            ">


                <div />


                {diasSemana.map(

                    (
                        dia,
                        index
                    ) => {

                        const passado =
                            dataEstaNoPassado(
                                dia
                            )


                        const alemDoLimite =
                            dataEstaAlemDoLimite(
                                dia
                            )


                        const indisponivel =
                            passado ||
                            alemDoLimite


                        const isHoje =

                            dia.getTime() ===

                            hoje.getTime()


                        return (

                            <div

                                key={
                                    formatarData(
                                        dia
                                    )
                                }

                                className={`
                                    aspect-square
                                    rounded-xl
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    font-semibold
                                    transition-all
                                    duration-200
                                    border-2

                                    ${
                                        indisponivel

                                            ? 'bg-[#333333] border-[#333333]'

                                            : isHoje

                                                ? 'bg-[#1E1E1E] border-[#D3AF37] shadow-lg shadow-[#D3AF37]/20'

                                                : 'bg-[#1E1E1E] border-[#2A2A2A]'
                                    }
                                `}

                            >

                                <span className={`
                                    text-xs
                                    ${
                                        indisponivel

                                            ? 'text-[#757575]'

                                            : 'text-[#A0A0A0]'
                                    }
                                `}>

                                    {
                                        diaSemanaNome[
                                            index
                                        ].slice(
                                            0,
                                            3
                                        )
                                    }

                                </span>


                                <span className={`
                                    text-lg
                                    ${
                                        indisponivel

                                            ? 'text-[#757575]'

                                            : isHoje

                                                ? 'text-[#D3AF37]'

                                                : 'text-[#FFFFFF]'
                                    }
                                `}>

                                    {
                                        dia.getDate()
                                    }

                                </span>


                                {indisponivel && (

                                    <span className="
                                        text-[9px]
                                        text-[#757575]
                                    ">

                                        indis.

                                    </span>

                                )}

                            </div>

                        )

                    }

                )}

            </div>


            {/* =====================================================
                HORÁRIOS
            ====================================================== */}

            <div className="
                flex
                flex-col
                gap-2
            ">


                {horarios.map(

                    horario => (

                        <div

                            key={
                                horario.hora
                            }

                            className="
                                grid
                                grid-cols-8
                                gap-2
                            "
                        >


                            {/* =================================================
                                HORA
                            ================================================== */}

                            <div className="
                                aspect-square
                                rounded-xl
                                bg-[#1E1E1E]
                                text-[#E0E0E0]
                                flex
                                items-center
                                justify-center
                                text-xs
                                font-medium
                                border
                                border-[#2A2A2A]
                            ">

                                {
                                    horario.hora
                                }

                            </div>


                            {/* =================================================
                                DIAS
                            ================================================== */}

                            {diasSemana.map(

                                dia => {

                                    const passado =

                                        dataEstaNoPassado(
                                            dia
                                        )


                                    const alemDoLimite =

                                        dataEstaAlemDoLimite(
                                            dia
                                        )


                                    const ocupado =

                                        horarioEstaOcupado(

                                            dia,

                                            horario.hora

                                        )


                                    const indisponivel =

                                        passado ||

                                        alemDoLimite ||

                                        ocupado


                                    return (

                                        <div

                                            key={`
                                                ${formatarData(dia)}-
                                                ${horario.hora}
                                            `}

                                            onClick={() => {

                                                if (
                                                    indisponivel
                                                ) {

                                                    return

                                                }


                                                selecionarHorarioDaSemana(

                                                    dia,

                                                    horario.hora

                                                )

                                            }}

                                            className={`
                                                aspect-square
                                                rounded-xl
                                                transition-all
                                                duration-200
                                                flex
                                                flex-col
                                                items-center
                                                justify-center
                                                gap-1
                                                border-2

                                                ${
                                                    passado ||

                                                    alemDoLimite

                                                        ? 'bg-[#333333] border-[#333333] cursor-not-allowed'

                                                        : ocupado

                                                            ? 'bg-[#333333] border-[#333333] cursor-not-allowed'

                                                            : 'bg-[#1E1E1E] border-[#2A2A2A] cursor-pointer hover:border-[#D3AF37] hover:bg-[#2A2A2A]'
                                                }
                                            `}

                                        >

                                            <span className={`
                                                text-[10px]
                                                font-medium

                                                ${
                                                    passado ||

                                                    alemDoLimite ||

                                                    ocupado

                                                        ? 'text-[#757575]'

                                                        : 'text-[#E0E0E0]'
                                                }
                                            `}>

                                                {
                                                    passado

                                                        ? 'indis.'

                                                        : alemDoLimite

                                                            ? 'indis.'

                                                            : ocupado

                                                                ? 'ocupado'

                                                                : 'livre'
                                                }

                                            </span>


                                            <div className={`
                                                w-[10px]
                                                h-[10px]
                                                rounded-full
                                                transition-all
                                                duration-200

                                                ${
                                                    passado ||

                                                    alemDoLimite

                                                        ? 'bg-[#757575]'

                                                        : ocupado

                                                            ? 'bg-[#D3AF37]'

                                                            : 'bg-[#FFFFFF]'
                                                }
                                            `} />

                                        </div>

                                    )

                                }

                            )}

                        </div>

                    )

                )}

            </div>


        </div>

    )

}