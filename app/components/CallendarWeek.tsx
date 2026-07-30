
'use client'

import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'

import { horarioType } from '../types/horario'

import {
    useCentralDados,
    useAgendamentos
} from './PersistData'


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
        agendamentos
    } = useAgendamentos()


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

    const inicioSemana = new Date(dataVisualizada)

    inicioSemana.setHours(0, 0, 0, 0)

    inicioSemana.setDate(
        dataVisualizada.getDate() -
        dataVisualizada.getDay()
    )


    // =========================================================
    // HOJE
    // =========================================================

    const hoje = new Date()

    hoje.setHours(
        0,
        0,
        0,
        0
    )


    // =========================================================
    // VERIFICAR SE DATA ESTÁ NO PASSADO
    // =========================================================

    function dataEstaNoPassado(
        data: Date
    ) {

        const dataVerificacao =
            new Date(data)

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
    // SELECIONAR HORÁRIO DA SEMANA
    // =========================================================

    function selecionarHorarioDaSemana(
        dia: Date,
        hora: string
    ) {

        // ================================================
        // NÃO PERMITIR DIAS PASSADOS
        // ================================================

        if (
            dataEstaNoPassado(dia)
        ) {

            return

        }


        definirDataVisualizada(dia)

        selecionarHorario(hora)

        setInterfaceView('day')

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
            new Date(inicioSemana)

        dia.setDate(
            inicioSemana.getDate() + i
        )

        dia.setHours(
            0,
            0,
            0,
            0
        )

        diasSemana.push(dia)

    }


    // =========================================================
    // PRIMEIRO E ÚLTIMO DIA
    // =========================================================

    const primeiroDia =
        diasSemana[0]

    const ultimoDia =
        diasSemana[6]


    // =========================================================
    // INÍCIO DA SEMANA ATUAL
    // =========================================================

    const inicioSemanaAtual =
        new Date(hoje)

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


    const estaNaSemanaAtual =
        inicioSemana.getTime() ===
        inicioSemanaAtual.getTime()


    // =========================================================
    // FORMATAR DATA
    // =========================================================

    function formatarData(
        data: Date
    ) {

        return `${data.getFullYear()}-${String(
            data.getMonth() + 1
        ).padStart(2, '0')}-${String(
            data.getDate()
        ).padStart(2, '0')}`

    }


    // =========================================================
    // ABRIR DIA
    // =========================================================

    function abrirDia(
        dia: Date,
        hora: string
    ) {

        // ================================================
        // NÃO PERMITIR DATA PASSADA
        // ================================================

        if (
            dataEstaNoPassado(dia)
        ) {

            return

        }


        definirDataVisualizada(dia)

        selecionarHorario(hora)

        setInterfaceView('day')

    }


    // =========================================================
    // VERIFICAR SE HORÁRIO ESTÁ OCUPADO
    // =========================================================

    function horarioEstaOcupado(
        dia: Date,
        hora: string
    ) {

        const data =
            formatarData(dia)

        return agendamentos.some(
            (agendamento) =>

                agendamento.data === data &&

                agendamento.hora === hora

        )

    }


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

        <div className="w-full overflow-auto">


            {/* =====================================================
                CABEÇALHO
            ====================================================== */}

            <div className="
                w-full
                h-[80px]
                bg-white
                flex
                items-center
                justify-around
            ">


                {/* SEMANA ANTERIOR */}

                <button

                    onClick={semanaAnterior}

                    disabled={estaNaSemanaAtual}

                    className={`
                        flex
                        w-[50px]
                        h-[50px]
                        rounded-full
                        items-center
                        justify-center

                        ${estaNaSemanaAtual
                            ? 'bg-black/30 cursor-not-allowed'
                            : 'bg-black'
                        }
                    `}

                >

                    <ArrowBigLeft color="white" />

                </button>


                {/* PERÍODO */}

                <h1 className="
                    text-[25px]
                    text-black
                    font-semibold
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


                {/* PRÓXIMA SEMANA */}

                <button

                    onClick={proximaSemana}

                    className="
                        flex
                        w-[50px]
                        h-[50px]
                        bg-black
                        rounded-full
                        items-center
                        justify-center
                    "

                >

                    <ArrowBigRight color="white" />

                </button>


            </div>


            {/* =====================================================
                CABEÇALHO DOS DIAS
            ====================================================== */}

            <div className="
                grid
                grid-cols-8
                gap-2
                mb-2
            ">


                {/* ESPAÇO DO HORÁRIO */}

                <div />


                {/* DIAS */}

                {diasSemana.map(
                    (
                        dia,
                        index
                    ) => {

                        const passado =
                            dataEstaNoPassado(dia)


                        return (

                            <div

                                key={formatarData(dia)}

                                className={`
                                    aspect-square
                                    rounded-xl
                                    text-white
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    font-semibold

                                    ${passado
                                        ? 'bg-black/30'
                                        : 'bg-black'
                                    }
                                `}

                            >

                                <span className="text-xs">

                                    {diaSemanaNome[index].slice(0, 3)}

                                </span>


                                <span className="text-lg">

                                    {dia.getDate()}

                                </span>


                                {passado && (

                                    <span className="
                                        text-[9px]
                                        text-white/60
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
                    (horario) => (

                        <div

                            key={horario.hora}

                            className="
                                grid
                                grid-cols-8
                                gap-2
                            "

                        >


                            {/* =============================================
                                HORA
                            ============================================== */}

                            <div className="
                                aspect-square
                                rounded-xl
                                bg-black
                                text-white
                                flex
                                items-center
                                justify-center
                                text-xs
                                font-medium
                            ">

                                {horario.hora}

                            </div>


                            {/* =============================================
                                DIAS
                            ============================================== */}

                            {diasSemana.map(
                                (dia) => {

                                    const passado =
                                        dataEstaNoPassado(dia)


                                    const ocupado =
                                        horarioEstaOcupado(
                                            dia,
                                            horario.hora
                                        )


                                    const indisponivel =
                                        passado ||
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
                                                flex
                                                flex-col
                                                items-center
                                                justify-center

                                                ${
                                                    passado

                                                        ? 'bg-zinc-200 cursor-not-allowed'

                                                        : ocupado

                                                            ? 'bg-black cursor-not-allowed'

                                                            : 'bg-black/40 cursor-pointer hover:bg-[#D3AF37]'
                                                }
                                            `}

                                        >


                                            <span className={`
                                                text-xs

                                                ${
                                                    passado
                                                        ? 'text-black/40'
                                                        : 'text-white'
                                                }
                                            `}>

                                                {passado
                                                    ? 'indis.'
                                                    : ocupado
                                                        ? 'ocupado'
                                                        : 'disponível'
                                                }

                                            </span>


                                            <span
                                                className={`
                                                    w-[10px]
                                                    h-[10px]
                                                    rounded-full

                                                    ${
                                                        passado

                                                            ? 'bg-black/20'

                                                            : ocupado

                                                                ? 'bg-[#D3AF37]'

                                                                : 'bg-white'
                                                    }
                                                `}
                                            />


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

