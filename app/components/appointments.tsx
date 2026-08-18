'use client'

import {
    useState
} from 'react'

import {
    AgendamentoComRelacionamentos
} from '../services/agendamentoService'

import {
    CalendarCheck,
    Clock,
    Scissors,
    UserRound,
    Phone,
    ArrowLeft,
    X,
    Loader2,
    Copy,
    Check,
    MapPin,
    CreditCard
} from 'lucide-react'

import {
    useCentralDados
} from '../context/PersistData'


// =========================================================
// TIPO DOS AGENDAMENTOS EXIBIDOS
// =========================================================

type AgendamentoExibicao = {
    id: string

    data: string

    hora: string

    hora_fim: string

    nome: string

    telefone: string

    duracao: number

    valor: number

    blocos?: number

    cancelado: boolean

    servicos: {
        id: string
        nome: string
        duracao: number
        valor: number
    }[]
}


// =========================================================
// CONFIGURAÇÕES DA BARBEARIA
// =========================================================

const CONFIG_BARBEARIA = {
    // PIX
    pixKey: '61002185000168', // Substitua pelo número do PIX
    
    // WhatsApp
    whatsappNumber: '5517997415764', // Código do país + DDD + número sem espaços
    whatsappMessage: 'Olá! Gostaria de agendar um horário na Brave Boss.',
    
    // Google Maps
    mapsUrl: 'https://maps.app.goo.gl/EWoK6PZV4JxJjWvHA', // Substitua pelo endereço
    
    // Instagram
    instagramUrl: 'https://www.instagram.com/barbeariabraveboss?igsh=N2Y1MXRmMDIzdWZk', // Substitua pelo perfil
}


export const InstagramIcon = ({ size = 24, color = "currentColor", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);



// =========================================================
// COMPONENTE
// =========================================================

export default function Appointments() {


    // =========================================================
    // CONTEXT
    // =========================================================

    const {

        agendamentosCliente,

        carregandoAgendamentosCliente,

        removerAgendamento,

        setInterfaceView

    } = useCentralDados()


    // =========================================================
    // MODAL
    // =========================================================

    const [

        modalCancelar,

        setModalCancelar

    ] = useState(false)


    const [

        agendamentoSelecionado,

        setAgendamentoSelecionado

    ] = useState<AgendamentoExibicao | null>(null)


    // =========================================================
    // ESTADO PARA COPIAR PIX
    // =========================================================

    const [
        pixCopiado,
        setPixCopiado
    ] = useState(false)


    // =========================================================
    // FORMATAR DATA
    // =========================================================

    function formatarData(
        data: string
    ) {

        if (!data) {

            return '--/--/----'

        }

        const [

            ano,
            mes,
            dia

        ] = data.split('-')


        return `${dia}/${mes}/${ano}`

    }


    // =========================================================
    // FORMATAR HORÁRIO
    // =========================================================

    function formatarHorario(
        horario: string
    ) {

        if (!horario) {

            return '--:--'

        }


        return horario.slice(
            0,
            5
        )

    }


    // =========================================================
    // COPIAR PIX
    // =========================================================

    async function copiarPix() {

        try {

            await navigator.clipboard.writeText(
                CONFIG_BARBEARIA.pixKey
            )

            setPixCopiado(true)

            setTimeout(() => {

                setPixCopiado(false)

            }, 3000)

        } catch (error) {

            console.error(
                'Erro ao copiar PIX:',
                error
            )

        }

    }


    // =========================================================
    // ABRIR WHATSAPP
    // =========================================================

    function abrirWhatsApp() {

        const url =
            `https://wa.me/${CONFIG_BARBEARIA.whatsappNumber}?text=${encodeURIComponent(
                CONFIG_BARBEARIA.whatsappMessage
            )}`

        window.open(
            url,
            '_blank'
        )

    }


    // =========================================================
    // ABRIR GOOGLE MAPS
    // =========================================================

    function abrirGoogleMaps() {

        window.open(
            CONFIG_BARBEARIA.mapsUrl,
            '_blank'
        )

    }


    // =========================================================
    // ABRIR INSTAGRAM
    // =========================================================

    function abrirInstagram() {

        window.open(
            CONFIG_BARBEARIA.instagramUrl,
            '_blank'
        )

    }


    // =========================================================
    // ABRIR CANCELAMENTO
    // =========================================================

    function abrirCancelar(
        agendamento: AgendamentoExibicao
    ) {

        setAgendamentoSelecionado(
            agendamento
        )

        setModalCancelar(
            true
        )

    }


    // =========================================================
    // CANCELAR AGENDAMENTO
    // =========================================================

    async function cancelarAgendamento() {

        if (!agendamentoSelecionado) {

            return

        }


        const id =
            agendamentoSelecionado.id


        try {

            await removerAgendamento(
                id
            )


            setModalCancelar(
                false
            )


            setAgendamentoSelecionado(
                null
            )


        } catch (error) {

            console.error(
                'Erro ao cancelar agendamento:',
                error
            )

        }

    }


    // =========================================================
    // CONVERTER DADOS PARA EXIBIÇÃO
    // =========================================================

    const agendamentosExibicao: AgendamentoExibicao[] =

        agendamentosCliente.map(
            agendamento => {

                /*
                 * Os agendamentos que chegam do Context
                 * já possuem os dados tratados:
                 *
                 * nome
                 * telefone
                 * hora
                 * hora_fim
                 * servicos
                 * duracao
                 * valor
                 */

                return {
                    id:
                        agendamento.id,

                    data:
                        agendamento.data,

                    hora:
                        agendamento.hora,

                    hora_fim:
                        agendamento.hora_fim,

                    nome:
                        agendamento.nome,

                    telefone:
                        agendamento.telefone,

                    duracao:
                        agendamento.duracao,

                    valor:
                        agendamento.valor,

                    blocos:
                        agendamento.blocos,

                    cancelado:
                        agendamento.cancelado,

                    servicos:
                        agendamento.servicos ?? []
                }

            }
        )


    // =========================================================
    // ORDENAR AGENDAMENTOS
    // =========================================================

    const agendamentosOrdenados = [

        ...agendamentosExibicao

    ].sort(

        (
            a,
            b
        ) => {

            const dataA =
                `${a.data} ${a.hora}`

            const dataB =
                `${b.data} ${b.hora}`


            return dataA.localeCompare(
                dataB
            )

        }

    )


    // =========================================================
    // RENDERIZAR PAINEL DE CONTATO (PIX, WHATSAPP, MAPS, INSTAGRAM)
    // =========================================================

    function renderizarPainelContato() {

        return (

            <div className="
                grid
                grid-cols-2
                gap-3
                w-full
            ">

                {/* PIX */}
                <div className="
                    col-span-2
                    bg-[#1E1E1E]
                    border
                    border-[#2A2A2A]
                    rounded-2xl
                    p-4
                    flex
                    items-center
                    justify-between
                    gap-3
                    hover:border-[#D3AF37]
                    transition-all
                    duration-200
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                        flex-1
                        min-w-0
                    ">

                        <div className="
                            w-[40px]
                            h-[40px]
                            rounded-xl
                            bg-[#2A2A2A]
                            flex
                            items-center
                            justify-center
                            border
                            border-[#D3AF37]
                            shrink-0
                        ">

                            <CreditCard
                                color="#D3AF37"
                                size={20}
                            />

                        </div>

                        <div className="
                            flex
                            flex-col
                            gap-0.5
                            min-w-0
                        ">

                            <span className="
                                text-xs
                                text-[#A0A0A0]
                            ">

                                PIX

                            </span>

                            <span className="
                                text-sm
                                font-mono
                                text-[#E0E0E0]
                                truncate
                            ">

                                {CONFIG_BARBEARIA.pixKey}

                            </span>

                        </div>

                    </div>

                    <button

                        type="button"

                        onClick={copiarPix}

                        className={`
                            w-[40px]
                            h-[40px]
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            transition-all
                            duration-200
                            shrink-0
                            ${
                                pixCopiado
                                    ? 'bg-[#2E7D32] border border-[#4CAF50]'
                                    : 'bg-[#D3AF37] hover:bg-[#C4A032]'
                            }
                        `}

                    >

                        {pixCopiado ? (

                            <Check
                                size={20}
                                color="#FFFFFF"
                            />

                        ) : (

                            <Copy
                                size={20}
                                color="#121212"
                            />

                        )}

                    </button>

                </div>

                {/* WhatsApp */}
                <button

                    type="button"

                    onClick={abrirWhatsApp}

                    className="
                        bg-[#1E1E1E]
                        border
                        border-[#2A2A2A]
                        rounded-2xl
                        p-4
                        flex
                        flex-col
                        items-center
                        justify-center
                        gap-2
                        hover:border-[#25D366]
                        hover:bg-[#1A2A1A]
                        transition-all
                        duration-200
                    "

                >

                    <Phone
                        size={24}
                        color="#25D366"
                    />

                    <span className="
                        text-xs
                        font-semibold
                        text-[#E0E0E0]
                    ">

                        WhatsApp

                    </span>

                </button>

                {/* Google Maps */}
                <button

                    type="button"

                    onClick={abrirGoogleMaps}

                    className="
                        bg-[#1E1E1E]
                        border
                        border-[#2A2A2A]
                        rounded-2xl
                        p-4
                        flex
                        flex-col
                        items-center
                        justify-center
                        gap-2
                        hover:border-[#EA4335]
                        hover:bg-[#2A1A1A]
                        transition-all
                        duration-200
                    "

                >

                    <MapPin
                        size={24}
                        color="#EA4335"
                    />

                    <span className="
                        text-xs
                        font-semibold
                        text-[#E0E0E0]
                    ">

                        Localização

                    </span>

                </button>

                {/* Instagram */}
                <button

                    type="button"

                    onClick={abrirInstagram}

                    className="
                        col-span-2
                        bg-[#1E1E1E]
                        border
                        border-[#2A2A2A]
                        rounded-2xl
                        p-4
                        flex
                        items-center
                        justify-center
                        gap-3
                        hover:border-[#E4405F]
                        hover:bg-[#2A1A1E]
                        transition-all
                        duration-200
                    "

                >

                    <InstagramIcon
                        size={24}
                        color="#E4405F"
                    />

                    <span className="
                        text-sm
                        font-semibold
                        text-[#E0E0E0]
                    ">

                        Siga-nos no Instagram

                    </span>

                </button>

            </div>

        )

    }


    // =========================================================
    // CARREGANDO INICIAL
    // =========================================================

    if (

        carregandoAgendamentosCliente &&

        agendamentosOrdenados.length === 0

    ) {

        return (

            <div className="
                w-full
                min-h-full
                flex
                flex-col
                items-center
                justify-center
                gap-6
                bg-[#121212]
                text-[#E0E0E0]
                p-4
                rounded-xl
            ">

                <Loader2
                    size={40}
                    className="
                        text-[#D3AF37]
                        animate-spin
                    "
                />

                <p className="
                    text-sm
                    text-[#A0A0A0]
                ">

                    Carregando seus agendamentos...

                </p>

            </div>

        )

    }


    // =========================================================
    // SEM AGENDAMENTOS (MANTÉM O PAINEL DE CONTATO)
    // =========================================================

    if (

        agendamentosOrdenados.length === 0

    ) {

        return (

            <div className="
                w-full
                flex
                flex-col
                gap-5
                bg-[#121212]
                p-4
                rounded-xl
                text-[#E0E0E0]
            ">

                {/* =============================================
                    CABEÇALHO
                ============================================= */}

                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-[#2A2A2A]
                    pb-4
                ">

                    <div className="
                        flex
                        flex-col
                        gap-1
                    ">

                        <h1 className="
                            text-2xl
                            font-bold
                            text-[#FFFFFF]
                        ">

                            Meus agendamentos

                        </h1>


                        <p className="
                            text-sm
                            text-[#A0A0A0]
                        ">

                            Horários reservados neste dispositivo

                        </p>

                    </div>


                    <CalendarCheck
                        size={30}
                        color="#D3AF37"
                    />

                </div>


                {/* =============================================
                    PAINEL DE CONTATO (SEMPRE VISÍVEL)
                ============================================= */}

                {renderizarPainelContato()}


                {/* =============================================
                    MENSAGEM SEM AGENDAMENTOS
                ============================================= */}

                <div className="
                    w-full
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-6
                    py-8
                ">

                    <div className="
                        w-[80px]
                        aspect-square
                        rounded-full
                        bg-[#1E1E1E]
                        flex
                        items-center
                        justify-center
                        border-2
                        border-[#D3AF37]
                    ">

                        <CalendarCheck
                            color="#D3AF37"
                            size={40}
                        />

                    </div>


                    <div className="
                        flex
                        flex-col
                        items-center
                        gap-2
                        text-center
                    ">

                        <h2 className="
                            text-xl
                            font-bold
                            text-[#FFFFFF]
                        ">

                            Nenhum agendamento

                        </h2>


                        <p className="
                            text-sm
                            text-[#A0A0A0]
                        ">

                            Você ainda não possui
                            nenhum horário agendado.

                        </p>

                    </div>

                </div>


                {/* =============================================
                    BOTÃO VOLTAR (ADICIONAL)
                ============================================= */}

                <button

                    type="button"

                    onClick={() =>
                        setInterfaceView(
                            'day'
                        )
                    }

                    className="
                        w-full
                        bg-[#D3AF37]
                        text-[#121212]
                        p-4
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        gap-2
                        font-bold
                        hover:bg-[#C4A032]
                        transition-all
                        duration-200
                        hover:scale-[1.02]
                    "

                >

                    <ArrowLeft
                        size={20}
                    />

                    Voltar para o calendário

                </button>

            </div>

        )

    }


    // =========================================================
    // RENDER (COM AGENDAMENTOS)
    // =========================================================

    return (

        <div className="
            w-full
            flex
            flex-col
            gap-5
            bg-[#121212]
            p-4
            rounded-xl
            text-[#E0E0E0]
        ">


            {/* =================================================
                CABEÇALHO
            ================================================= */}

            <div className="
                flex
                items-center
                justify-between
                border-b
                border-[#2A2A2A]
                pb-4
            ">

                <div className="
                    flex
                    flex-col
                    gap-1
                ">

                    <h1 className="
                        text-2xl
                        font-bold
                        text-[#FFFFFF]
                    ">

                        Meus agendamentos

                    </h1>


                    <p className="
                        text-sm
                        text-[#A0A0A0]
                    ">

                        Horários reservados neste dispositivo

                    </p>

                </div>


                <CalendarCheck
                    size={30}
                    color="#D3AF37"
                />

            </div>


            {/* =================================================
                INDICADOR DE ATUALIZAÇÃO
            ================================================= */}

            {carregandoAgendamentosCliente && (

                <div className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-xs
                    text-[#A0A0A0]
                ">

                    <Loader2
                        size={14}
                        className="
                            animate-spin
                            text-[#D3AF37]
                        "
                    />

                    Atualizando agendamentos...

                </div>

            )}


            {/* =================================================
                PAINEL DE CONTATO (SEMPRE VISÍVEL)
            ================================================= */}

            {renderizarPainelContato()}


            {/* =================================================
                LISTA DE AGENDAMENTOS
            ================================================= */}

            <div className="
                flex
                flex-col
                gap-4
            ">

                {agendamentosOrdenados.map(

                    agendamento => {

                        return (

                            <div

                                key={
                                    agendamento.id
                                }

                                className="
                                    w-full
                                    bg-[#1E1E1E]
                                    border
                                    border-[#2A2A2A]
                                    rounded-2xl
                                    p-5
                                    flex
                                    flex-col
                                    gap-4
                                    shadow-lg
                                    transition-all
                                    duration-200
                                    hover:border-[#D3AF37]
                                "

                            >


                                {/* =================================
                                    DATA E HORÁRIO
                                ================================= */}

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                    ">

                                        <div className="
                                            w-[45px]
                                            aspect-square
                                            rounded-xl
                                            bg-[#2A2A2A]
                                            flex
                                            items-center
                                            justify-center
                                            border
                                            border-[#D3AF37]
                                        ">

                                            <CalendarCheck
                                                color="#D3AF37"
                                                size={22}
                                            />

                                        </div>


                                        <div className="
                                            flex
                                            flex-col
                                        ">

                                            <span className="
                                                font-bold
                                                text-lg
                                                text-[#FFFFFF]
                                            ">

                                                {formatarData(
                                                    agendamento.data
                                                )}

                                            </span>


                                            <span className="
                                                text-sm
                                                text-[#A0A0A0]
                                                flex
                                                items-center
                                                gap-1
                                            ">

                                                <Clock
                                                    size={14}
                                                    color="#757575"
                                                />

                                                {formatarHorario(
                                                    agendamento.hora
                                                )}

                                                {' - '}

                                                {formatarHorario(
                                                    agendamento.hora_fim
                                                )}

                                            </span>

                                        </div>

                                    </div>


                                    <span className="
                                        bg-[#2A2A2A]
                                        text-[#D3AF37]
                                        text-xs
                                        font-bold
                                        px-3
                                        py-1
                                        rounded-full
                                        border
                                        border-[#D3AF37]
                                    ">

                                        {agendamento.cancelado
                                            ? 'CANCELADO'
                                            : 'AGENDADO'
                                        }

                                    </span>

                                </div>


                                {/* =================================
                                    DIVISÓRIA
                                ================================= */}

                                <div className="
                                    w-full
                                    h-px
                                    bg-[#2A2A2A]
                                " />


                                {/* =================================
                                    CLIENTE
                                ================================= */}

                                <div className="
                                    flex
                                    flex-col
                                    gap-2
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-[#E0E0E0]
                                    ">

                                        <UserRound
                                            size={17}
                                            color="#A0A0A0"
                                        />

                                        <span>

                                            {agendamento.nome ||
                                                'Cliente'
                                            }

                                        </span>

                                    </div>


                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-[#E0E0E0]
                                    ">

                                        <Phone
                                            size={17}
                                            color="#A0A0A0"
                                        />

                                        <span>

                                            {agendamento.telefone ||
                                                'Telefone não informado'
                                            }

                                        </span>

                                    </div>

                                </div>


                                {/* =================================
                                    SERVIÇOS
                                ================================= */}

                                <div className="
                                    flex
                                    flex-col
                                    gap-2
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-[#A0A0A0]
                                    ">

                                        <Scissors
                                            size={17}
                                            color="#757575"
                                        />

                                        <span>

                                            Serviços

                                        </span>

                                    </div>


                                    <div className="
                                        flex
                                        flex-col
                                        gap-2
                                        bg-[#2A2A2A]
                                        rounded-xl
                                        p-3
                                    ">

                                        {agendamento.servicos.length === 0 ? (

                                            <span className="
                                                text-sm
                                                text-[#757575]
                                            ">

                                                Nenhum serviço informado.

                                            </span>

                                        ) : (

                                            agendamento.servicos.map(

                                                (
                                                    servico,
                                                    index
                                                ) => (

                                                    <div

                                                        key={
                                                            `${agendamento.id}-${servico.id}-${index}`
                                                        }

                                                        className="
                                                            flex
                                                            items-center
                                                            justify-between
                                                            gap-3
                                                        "

                                                    >

                                                        <span className="
                                                            text-sm
                                                            text-[#E0E0E0]
                                                        ">

                                                            {
                                                                servico.nome
                                                            }

                                                        </span>


                                                        <span className="
                                                            text-xs
                                                            text-[#A0A0A0]
                                                            whitespace-nowrap
                                                        ">

                                                            {
                                                                servico.duracao
                                                            }

                                                            {' min'}

                                                        </span>

                                                    </div>

                                                )

                                            )

                                        )}

                                    </div>

                                </div>


                                {/* =================================
                                    RESUMO
                                ================================= */}

                                <div className="
                                    flex
                                    flex-col
                                    gap-2
                                    bg-[#2A2A2A]
                                    rounded-xl
                                    p-3
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                    ">

                                        <span className="
                                            text-sm
                                            text-[#A0A0A0]
                                        ">

                                            Duração estimada

                                        </span>


                                        <strong className="
                                            text-[#FFFFFF]
                                        ">

                                            {
                                                agendamento.duracao
                                            }

                                            {' min'}

                                        </strong>

                                    </div>


                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                    ">

                                        <span className="
                                            text-sm
                                            text-[#A0A0A0]
                                        ">

                                            Total

                                        </span>


                                        <strong className="
                                            text-[#D3AF37]
                                        ">

                                            R$ {

                                                Number(
                                                    agendamento.valor
                                                )
                                                    .toFixed(2)
                                                    .replace(
                                                        '.',
                                                        ','
                                                    )

                                            }

                                        </strong>

                                    </div>

                                </div>


                                {/* =================================
                                    CANCELAR
                                ================================= */}

                                {!agendamento.cancelado && (

                                    <button

                                        type="button"

                                        onClick={() =>
                                            abrirCancelar(
                                                agendamento
                                            )
                                        }

                                        className="
                                            w-full
                                            rounded-xl
                                            border-2
                                            border-[#D32F2F]
                                            text-[#FF4D4D]
                                            py-3
                                            font-semibold
                                            hover:bg-[#D32F2F]
                                            hover:text-[#FFFFFF]
                                            transition-all
                                            duration-200
                                        "

                                    >

                                        Cancelar agendamento

                                    </button>

                                )}

                            </div>

                        )

                    }

                )}

            </div>


            {/* =================================================
                VOLTAR
            ================================================= */}

            <button

                type="button"

                onClick={() =>
                    setInterfaceView(
                        'day'
                    )
                }

                className="
                    w-full
                    bg-[#D3AF37]
                    text-[#121212]
                    p-4
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    gap-2
                    font-bold
                    hover:bg-[#C4A032]
                    transition-all
                    duration-200
                    hover:scale-[1.02]
                "

            >

                <ArrowLeft
                    size={20}
                />

                Voltar para o calendário

            </button>


            {/* =================================================
                MODAL CANCELAMENTO
            ================================================= */}

            {modalCancelar && (

                <div className="
                    fixed
                    inset-0
                    bg-[#121212]/90
                    flex
                    items-center
                    justify-center
                    z-50
                    p-4
                ">

                    <div className="
                        bg-[#1E1E1E]
                        rounded-2xl
                        p-6
                        w-[90%]
                        max-w-[380px]
                        flex
                        flex-col
                        gap-6
                        border
                        border-[#2A2A2A]
                    ">


                        <div className="
                            flex
                            justify-end
                        ">

                            <button

                                type="button"

                                onClick={() => {

                                    setModalCancelar(
                                        false
                                    )

                                    setAgendamentoSelecionado(
                                        null
                                    )

                                }}

                                className="
                                    bg-[#2A2A2A]
                                    rounded-full
                                    p-2
                                    hover:bg-[#333333]
                                    transition-colors
                                "

                            >

                                <X
                                    size={20}
                                    color="#757575"
                                />

                            </button>

                        </div>


                        <div className="
                            text-center
                        ">

                            <h2 className="
                                text-xl
                                font-bold
                                text-[#FFFFFF]
                            ">

                                Cancelar agendamento?

                            </h2>


                            <p className="
                                text-sm
                                text-[#A0A0A0]
                                mt-2
                            ">

                                Esta ação não poderá ser desfeita.

                            </p>

                        </div>


                        <div className="
                            flex
                            gap-3
                        ">


                            <button

                                type="button"

                                onClick={() => {

                                    setModalCancelar(
                                        false
                                    )

                                    setAgendamentoSelecionado(
                                        null
                                    )

                                }}

                                className="
                                    flex-1
                                    border-2
                                    border-[#333333]
                                    rounded-xl
                                    py-3
                                    font-semibold
                                    text-[#E0E0E0]
                                    hover:bg-[#2A2A2A]
                                    transition-colors
                                "

                            >

                                Voltar

                            </button>


                            <button

                                type="button"

                                onClick={
                                    cancelarAgendamento
                                }

                                className="
                                    flex-1
                                    rounded-xl
                                    bg-[#D32F2F]
                                    text-[#FFFFFF]
                                    py-3
                                    font-semibold
                                    hover:bg-[#B71C1C]
                                    transition-colors
                                "

                            >

                                Cancelar

                            </button>


                        </div>

                    </div>

                </div>

            )}

        </div>

    )

}