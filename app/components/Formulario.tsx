'use client'

import {
  useMemo,
  useState
} from 'react'

import {
  X,
  CalendarCheck2,
  AlertTriangle
} from 'lucide-react'

import Services from './Services'
import { useServicos } from '../hooks/useServicos'
import { ServicoSelecionadoType } from '../types/service'


import {
  buscarClientePorTelefone,
  criarCliente
} from '../services/clienteService'

// import {
//   criarAgendamento
// } from '../services/agendamentoService'

import {
  useCentralDados
} from '../context/PersistData'

// =========================================================
// TIPOS
// =========================================================

type Sugestao = {
  data: string
  horario: string
  descricao: string
}

type Agendamento = {
  id: string
  data: string
  hora: string
  nome: string
  telefone: string

  blocos?: number

  duracao?: number
}

type Props = {

  horario: string

  fecharModal: () => void

  data: string

  agendamentos?: Agendamento[]

}

// =========================================================
// CONFIGURAÇÕES
// =========================================================

const DURACAO_BLOCO = 45

// Tempo que pode ultrapassar o bloco sem consumir o próximo
const TEMPO_TOLERANCIA = 20

const LIMITE_SOBREPOSICAO_AVISO = 20

const LIMITE_BLOCOS_SUGESTAO = 2.5

// =========================================================
// HORÁRIOS DISPONÍVEIS
// =========================================================

const HORARIOS_DISPONIVEIS = [

  '9:00',

  '9:45',

  '10:30',

  '11:15',

  '12:00',

  '12:45',

  '13:30',

  '14:15',

  '15:00',

  '15:45',

  '16:30',

  '17:15',

  '18:00',

  '18:45',

  '19:30'

]

// =========================================================
// DURAÇÃO DOS SERVIÇOS
// =========================================================

// const DURACAO_SERVICOS: Record<string, number> = {

//   'Corte social': 25,

//   'Degrade 0/1/2': 30,

//   'Navalhado': 35,

//   'Corte tesoura': 45,

//   'Corte kids': 45,


//   'Barba': 20,

//   'Sobrancelha': 5,


//   'Alisamento': 30,

//   'Progressiva': 105,


//   'Pigmentação': 20,

//   'Tintura': 20,

//   'Luzes': 110,

//   'Platinado': 130,
// }

// =========================================================
// COMPONENTE
// =========================================================

export default function Formulario({

  horario,

  fecharModal,



  data,

  agendamentos = []

}: Props) {

  // =======================================================
  // CONTEXT
  // =======================================================

  const [
    salvando,
    setSalvando
  ] = useState(false)

const {
  selecionarHorario,
  setInterfaceView,
  definirDataAgendamento,
  adicionarAgendamento         
} = useCentralDados()

  // =======================================================
  // DADOS DO CLIENTE
  // =======================================================

  const [
    horarioSelecionado,
    setHorarioSelecionado
  ] = useState(horario)

  const [
    dataSelecionada,
    setDataSelecionada
  ] = useState(data)

  const [
    sugestaoSelecionada,
    setSugestaoSelecionada
  ] = useState<string | null>(null)

  const [
    nome,
    setNome
  ] = useState('')

  const [
    telefone,
    setTelefone
  ] = useState('')

  const [
    erroTelefone,
    setErroTelefone
  ] = useState('')

  // =======================================================
  // SERVIÇOS
  // =======================================================

  const {
    servicos,
    carregando,
    erro
  } = useServicos()

  const [
    servicosSelecionadosIds,
    setServicosSelecionadosIds
  ] = useState<string[]>([])

  // const [
  //   services,
  //   setServices
  // ] = useState<ServicoSelecionadoType []>([

  //   {
  //     checkbox: false,
  //     serviço: 'Corte social',
  //     price: 30
  //   },

  //   {
  //     checkbox: false,
  //     serviço: 'Degrade 0/1/2',
  //     price: 35
  //   },

  //   {
  //     checkbox: false,
  //     serviço: 'Navalhado',
  //     price: 40
  //   },


  //   {
  //     checkbox: false,
  //     serviço: 'Corte tesoura',
  //     price: 45
  //   },
  //   {
  //     checkbox: false,
  //     serviço: 'Corte kids',
  //     price: 40
  //   },

  //   {
  //     checkbox: false,
  //     serviço: 'Barba',
  //     price: 30
  //   },

  //   {
  //     checkbox: false,
  //     serviço: 'Sobrancelha',
  //     price: 10
  //   },

  //   {
  //     checkbox: false,
  //     serviço: 'Alisamento',
  //     price: 45
  //   },
  //   {
  //     checkbox: false,
  //     serviço: 'Progressiva',
  //     price: 150
  //   },



  //   {
  //     checkbox: false,
  //     serviço: 'Pigmentação',
  //     price: 25
  //   },

  //   {
  //     checkbox: false,
  //     serviço: 'Tintura',
  //     price: 20
  //   },
  //       {
  //     checkbox: false,
  //     serviço: 'Luzes',
  //     price: 100
  //   },

  //   {
  //     checkbox: false,
  //     serviço: 'Platinado',
  //     price: 120
  //   },

  // ])

  // =======================================================
  // SELECIONAR SERVIÇO
  // =======================================================

  function selecionarServico(
    servicoId: string
  ) {

    setServicosSelecionadosIds(prev => {

      if (prev.includes(servicoId)) {

        return prev.filter(
          id => id !== servicoId
        )

      }

      return [
        ...prev,
        servicoId
      ]

    })

  }

  // =======================================================
  // SELECIONAR SUGESTÃO
  // =======================================================

  function selecionarSugestao(
    sugestao: Sugestao
  ) {

    setHorarioSelecionado(
      sugestao.horario
    )

    setDataSelecionada(
      sugestao.data
    )

    selecionarHorario(
      sugestao.horario
    )

    definirDataAgendamento(
      sugestao.data
    )

    setSugestaoSelecionada(

      `${sugestao.data}-${sugestao.horario}`

    )

  }

  // =======================================================
  // SERVIÇOS SELECIONADOS
  // =======================================================

  const servicosSelecionados =
    servicos.filter(
      servico =>
        servicosSelecionadosIds.includes(
          servico.id
        )
    )
  // =======================================================
  // TEMPO TOTAL
  // =======================================================

  const tempoTotal =
    servicosSelecionados.reduce(

      (
        total,
        servico
      ) =>

        total +
        servico.duracao,

      0

    )

  // =======================================================
  // CALCULAR BLOCOS NECESSÁRIOS
  // =======================================================

  const blocosNecessarios =

    tempoTotal > 0

      ? Math.max(

        1,

        Math.ceil(

          (
            tempoTotal -
            TEMPO_TOLERANCIA
          ) /

          DURACAO_BLOCO

        )

      )

      : 0

  // =======================================================
  // VALOR TOTAL
  // =======================================================

  const somaFatu =
    servicosSelecionados.reduce(

      (
        total,
        servico
      ) =>

        total +
        servico.valor,

      0

    )

  // =======================================================
  // FORMATAR TEMPO
  // =======================================================

  function formatarTempo(
    minutos: number
  ) {

    const horas =

      Math.floor(
        minutos / 60
      )

    const minutosRestantes =

      minutos % 60

    if (
      horas === 0
    ) {

      return `${minutosRestantes} min`

    }

    if (
      minutosRestantes === 0
    ) {

      return `${horas}h`

    }

    return `${horas}h ${minutosRestantes}min`

  }

  // =======================================================
  // CONVERTER HORÁRIO PARA MINUTOS
  // =======================================================

  function horarioParaMinutos(
    horarioString: string
  ) {

    const [
      horas,
      minutos
    ] = horarioString
      .split(':')
      .map(Number)

    return (

      horas * 60 +

      minutos

    )

  }

  // =======================================================
  // ADICIONAR DIAS
  // =======================================================

  function adicionarDias(

    dataString: string,

    quantidade: number

  ) {

    const [

      ano,

      mes,

      dia

    ] = dataString
      .split('-')
      .map(Number)

    const dataAtual =

      new Date(
        ano,
        mes - 1,
        dia
      )

    dataAtual.setDate(

      dataAtual.getDate() +

      quantidade

    )

    return (

      `${dataAtual.getFullYear()}-` +

      `${String(
        dataAtual.getMonth() + 1
      ).padStart(2, '0')}-` +

      `${String(
        dataAtual.getDate()
      ).padStart(2, '0')}`

    )

  }

  // =======================================================
  // VERIFICAR SE UM BLOCO ESTÁ OCUPADO
  // =======================================================

  function blocoEstaOcupado(

    dataVerificacao: string,

    horarioVerificacao: string

  ) {

    const minutoVerificacao =

      horarioParaMinutos(
        horarioVerificacao
      )

    return agendamentos.some(

      agendamento => {

        if (

          agendamento.data !==
          dataVerificacao

        ) {

          return false

        }

        const inicioAgendamento =

          horarioParaMinutos(
            agendamento.hora
          )

        const duracaoAgendamento =

          agendamento.duracao ?? 45

        const blocosAgendamento =

          agendamento.blocos ??

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

        const fimAgendamento =

          inicioAgendamento +

          (

            blocosAgendamento *

            DURACAO_BLOCO

          )

        return (

          minutoVerificacao >=
          inicioAgendamento

          &&

          minutoVerificacao <
          fimAgendamento

        )

      }

    )

  }

  // =======================================================
  // VERIFICAR DISPONIBILIDADE
  // =======================================================

  function verificarDisponibilidade(

    dataVerificacao: string,

    horarioInicial: string

  ) {

    if (
      blocosNecessarios <= 0
    ) {

      return false

    }

    const indiceInicial =

      HORARIOS_DISPONIVEIS.indexOf(
        horarioInicial
      )

    if (
      indiceInicial === -1
    ) {

      return false

    }

    for (

      let i = 0;

      i < blocosNecessarios;

      i++

    ) {

      const indiceHorario =

        indiceInicial +

        i

      if (

        indiceHorario >=
        HORARIOS_DISPONIVEIS.length

      ) {

        return false

      }

      const horarioAtual =

        HORARIOS_DISPONIVEIS[
        indiceHorario
        ]

      if (

        blocoEstaOcupado(

          dataVerificacao,

          horarioAtual

        )

      ) {

        return false

      }

    }

    return true

  }

  // =======================================================
  // VERIFICAR CLIENTE ANTERIOR
  // =======================================================

  function obterClienteAnterior() {

    const indiceHorarioSelecionado =

      HORARIOS_DISPONIVEIS.indexOf(

        horarioSelecionado

      )

    if (
      indiceHorarioSelecionado <= 0
    ) {

      return null

    }

    for (

      let i =
        indiceHorarioSelecionado - 1;

      i >= 0;

      i--

    ) {

      const horarioAnterior =

        HORARIOS_DISPONIVEIS[i]

      const clienteExiste =

        blocoEstaOcupado(

          dataSelecionada,

          horarioAnterior

        )

      if (
        clienteExiste
      ) {

        return {

          horario:
            horarioAnterior,

          indice:
            i

        }

      }

    }

    return null

  }

  // =======================================================
  // CALCULAR SOBREPOSIÇÃO
  // =======================================================

  const sobreposicaoEstimada =

    useMemo(() => {

      if (
        agendamentos.length === 0 ||
        !servicosSelecionados.length
      ) {

        return 0

      }

      const clienteAnterior =

        obterClienteAnterior()

      if (
        !clienteAnterior
      ) {

        return 0

      }

      const inicioNovoCliente =

        horarioParaMinutos(

          horarioSelecionado

        )

      const fimNovoCliente =

        inicioNovoCliente +

        tempoTotal

      const inicioClienteAnterior =

        horarioParaMinutos(

          clienteAnterior.horario

        )

      const agendamentoAnterior =

        agendamentos.find(

          agendamento =>

            agendamento.data ===
            dataSelecionada &&

            agendamento.hora ===
            clienteAnterior.horario

        )

      const duracaoClienteAnterior =

        agendamentoAnterior?.duracao ??

        DURACAO_BLOCO

      const fimClienteAnterior =

        inicioClienteAnterior +

        duracaoClienteAnterior

      const sobreposicao =

        Math.max(

          0,

          Math.min(

            fimNovoCliente,

            fimClienteAnterior

          ) -

          Math.max(

            inicioNovoCliente,

            inicioClienteAnterior

          )

        )

      return sobreposicao

    }, [

      agendamentos,

      dataSelecionada,

      horarioSelecionado,

      blocosNecessarios,

      tempoTotal,

      servicosSelecionados.length

    ])

  // =======================================================
  // AVISO DE SOBREPOSIÇÃO
  // =======================================================

  const mostrarAvisoSobreposicao =

    sobreposicaoEstimada >

    LIMITE_SOBREPOSICAO_AVISO

  const atrasoEstimado =

    Math.ceil(

      sobreposicaoEstimada / 2

    )

  // =======================================================
  // DISPONIBILIDADE ATUAL
  // =======================================================

  const possuiServicosSelecionados =

    servicosSelecionados.length > 0

  const podeAgendar =

    possuiServicosSelecionados &&

    verificarDisponibilidade(

      dataSelecionada,

      horarioSelecionado

    )

  const mostrarMensagemIndisponivel =

    possuiServicosSelecionados &&

    !podeAgendar

  // =======================================================
  // SUGESTÕES
  // =======================================================

  const sugestoes =

    useMemo<Sugestao[]>(() => {

      if (

        !possuiServicosSelecionados ||

        verificarDisponibilidade(

          dataSelecionada,

          horarioSelecionado

        )

      ) {

        return []

      }

      const resultado: Sugestao[] = []

      for (

        const horarioSugestao
        of HORARIOS_DISPONIVEIS

      ) {

        if (

          horarioSugestao ===
          horarioSelecionado

        ) {

          continue

        }

        if (

          verificarDisponibilidade(

            dataSelecionada,

            horarioSugestao

          )

        ) {

          resultado.push({

            data:
              dataSelecionada,

            horario:
              horarioSugestao,

            descricao:
              'Outro horário disponível no mesmo dia'

          })

          break

        }

      }

      for (

        let dias = 1;

        dias <= 30;

        dias++

      ) {

        const novaData =

          adicionarDias(

            dataSelecionada,

            dias

          )

        if (

          verificarDisponibilidade(

            novaData,

            horarioSelecionado

          )

        ) {

          resultado.push({

            data:
              novaData,

            horario:
              horarioSelecionado,

            descricao:
              'Mesmo horário no dia mais próximo'

          })

          break

        }

      }

      const proximaSemana =

        adicionarDias(

          dataSelecionada,

          7

        )

      if (

        verificarDisponibilidade(

          proximaSemana,

          horarioSelecionado

        )

      ) {

        resultado.push({

          data:
            proximaSemana,

          horario:
            horarioSelecionado,

          descricao:
            'Mesmo horário no mesmo dia da semana, na próxima semana'

        })

      }

      return resultado

    }, [

      blocosNecessarios,

      horarioSelecionado,

      dataSelecionada,

      agendamentos,

      possuiServicosSelecionados

    ])

  // =======================================================
  // FORMATAR TELEFONE
  // =======================================================

  function formatarTelefone(
    valor: string
  ) {

    const apenasNumeros =

      valor.replace(
        /\D/g,
        ''
      )

    const numerosLimitados =

      apenasNumeros.slice(
        0,
        11
      )

    if (

      numerosLimitados.length <= 2

    ) {

      return numerosLimitados

        ? `(${numerosLimitados}`

        : ''

    }

    if (

      numerosLimitados.length <= 7

    ) {

      return (

        `(${numerosLimitados.slice(
          0,
          2
        )}) ` +

        numerosLimitados.slice(
          2
        )

      )

    }

    return (

      `(${numerosLimitados.slice(
        0,
        2
      )}) ` +

      `${numerosLimitados.slice(
        2,
        7
      )}-` +

      numerosLimitados.slice(
        7,
        11
      )

    )

  }

  // =======================================================
  // ALTERAR TELEFONE
  // =======================================================

  function handleTelefoneChange(
    valor: string
  ) {

    setTelefone(

      formatarTelefone(
        valor
      )

    )

    setErroTelefone('')

  }

  // =======================================================
  // VALIDAR TELEFONE
  // =======================================================

  function telefoneValido() {

    const apenasNumeros =

      telefone.replace(
        /\D/g,
        ''
      )

    if (

      apenasNumeros.length !== 11

    ) {

      return false

    }

    if (

      apenasNumeros[2] !== '9'

    ) {

      return false

    }

    if (

      /^(\d)\1+$/.test(
        apenasNumeros
      )

    ) {

      return false

    }

    return true

  }


  function calcularHoraFim(

    horaInicio: string,

    duracaoMinutos: number

  ) {

    const [
      horas,
      minutos
    ] = horaInicio
      .split(':')
      .map(Number)


    const totalMinutos =

      horas * 60 +
      minutos +
      duracaoMinutos


    const horasFim =
      Math.floor(
        totalMinutos / 60
      )


    const minutosFim =
      totalMinutos % 60


    return (

      `${String(
        horasFim
      ).padStart(2, '0')}:` +

      `${String(
        minutosFim
      ).padStart(2, '0')}`

    )

  }



  // =======================================================
  // CONFIRMAR AGENDAMENTO
  // =======================================================




  async function confirmarAgendamento() {

    // =====================================================
    // VALIDAR NOME
    // =====================================================

    if (!nome.trim()) {

      alert(
        'Digite seu nome para realizar o agendamento.'
      )

      return

    }


    // =====================================================
    // VALIDAR TELEFONE
    // =====================================================

    if (!telefoneValido()) {

      setErroTelefone(
        'Digite um telefone celular válido. Exemplo: (11) 99999-9999'
      )

      return

    }


    // =====================================================
    // VALIDAR SERVIÇOS
    // =====================================================

    if (
      servicosSelecionados.length === 0
    ) {

      alert(
        'Selecione pelo menos um serviço.'
      )

      return

    }


    // =====================================================
    // VALIDAR DISPONIBILIDADE
    // =====================================================

    if (
      !verificarDisponibilidade(
        dataSelecionada,
        horarioSelecionado
      )
    ) {

      alert(
        'Esse horário não possui blocos consecutivos suficientes para realizar todos os serviços selecionados. Escolha outro horário.'
      )

      return

    }


    try {

      setSalvando(true)


      // ===================================================
      // TELEFONE SEM MÁSCARA
      // ===================================================

      const telefoneBanco =
        telefone.replace(
          /\D/g,
          ''
        )


      // ===================================================
      // BUSCAR CLIENTE
      // ===================================================

      let cliente =
        await buscarClientePorTelefone(
          telefoneBanco
        )


      // ===================================================
      // CRIAR CLIENTE SE NÃO EXISTIR
      // ===================================================

      if (!cliente) {

        cliente = await criarCliente({

          nome:
            nome.trim(),

          telefone:
            telefoneBanco,

          email:
            null,

          observacoes:
            null

        })

      }


      // ===================================================
      // CALCULAR HORA FINAL
      // ===================================================

      const horaFim =
        calcularHoraFim(
          horarioSelecionado,
          tempoTotal
        )


      // ===================================================
      // CRIAR AGENDAMENTO
      // ===================================================

      // const novoAgendamento =
      //   await criarAgendamento({

      //     cliente_id:
      //       cliente.id,

      //     servicos_id:
      //       servicosSelecionadosIds,

      //     data:
      //       dataSelecionada,

      //     hora_inicio:
      //       horarioSelecionado,

      //     hora_fim:
      //       horaFim,

      //     observacoes:
      //       undefined,

      //     concluido:
      //       false,

      //     cancelado:
      //       false

      //   })

await adicionarAgendamento(

  // ==========================================
  // DADOS PARA O SUPABASE
  // ==========================================

  {
    cliente_id:
      cliente.id,

    servicos_id:
      servicosSelecionadosIds,

    data:
      dataSelecionada,

    hora_inicio:
      horarioSelecionado,

    hora_fim:
      horaFim,

    observacoes:
      undefined,

    concluido:
      false,

    cancelado:
      false
  },


  // ==========================================
  // DADOS PARA O LOCAL STORAGE
  // ==========================================

  {
    data:
      dataSelecionada,

    hora:
      horarioSelecionado,

    hora_fim:
      horaFim,

    nome:
      nome.trim(),

    telefone:
      telefoneBanco,

    servicos:
      servicosSelecionados.map(
        servico => ({

          id:
            servico.id,

          nome:
            servico.nome,

          duracao:
            servico.duracao,

          valor:
            servico.valor

        })
      ),

    duracao:
      tempoTotal,

    valor:
      somaFatu,

    blocos:
      blocosNecessarios,

    cancelado:
      false

  }

)


      // ===================================================
      // LOG PARA CONFERÊNCIA
      // ===================================================

      // console.log(
      //   'Agendamento criado no Supabase:',
      //   novoAgendamento
      // )


      // ===================================================
      // ATUALIZAR CONTEXT
      // ===================================================

      selecionarHorario(
        horarioSelecionado
      )

      definirDataAgendamento(
        dataSelecionada
      )


      // ===================================================
      // FECHAR MODAL
      // ===================================================

      fecharModal()


      // ===================================================
      // IR PARA AGENDAMENTOS
      // ===================================================

      setInterfaceView(
        'appointments'
      )


    } catch (error) {

      console.error(
        'Erro ao realizar agendamento:',
        error
      )

      alert(
        'Não foi possível realizar o agendamento. Tente novamente.'
      )

    } finally {

      setSalvando(false)

    }

  }

  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div className="
      w-full
      h-screen
      bg-[#121212]/90
      fixed
      top-0
      left-0
      z-[100]
      flex
      items-center
      justify-center
      p-4
    ">

      <div className="
        w-[90%]
        max-w-[500px]
        max-h-[90vh]
        overflow-y-auto
        bg-[#1E1E1E]
        flex
        flex-col
        p-6
        gap-4
        rounded-xl
        border
        border-[#2A2A2A]
      ">

        {/* =================================================
            BOTÃO FECHAR - ESTILO DOURADO E RESPONSIVO
        ================================================= */}

        <button

          type="button"

          className="
            flex
            items-center
            justify-center
            rounded-full
            w-10
            h-10
            sm:w-12
            sm:h-12
            self-end
            transition-all
            duration-300
            ease-in-out
            border-2
            bg-[#1E1E1E]
            border-[#D3AF37]
            hover:bg-[#D3AF37]
            hover:scale-110
            active:scale-95
            group
          "

          onClick={
            fecharModal
          }

        >

          <X
            size={24}
            className="
              text-[#D3AF37]
              group-hover:text-[#121212]
              transition-colors
              duration-300
            "
          />

        </button>

        {/* =================================================
            CAMPOS NOME E TELEFONE
        ================================================= */}

        <div className="
          w-full
          flex
          flex-col
          gap-2
        ">

          <input

            type="text"

            value={
              nome
            }

            className="
              text-[#E0E0E0]
              bg-[#2A2A2A]
              p-3
              w-full
              h-[45px]
              rounded-lg
              placeholder:text-[#757575]
              focus:outline-none
              focus:ring-2
              focus:ring-[#D3AF37]
              border
              border-[#333333]
            "

            onChange={e =>

              setNome(

                e.target.value.toUpperCase()

              )

            }

            placeholder="NOME"

          />

          <input

            type="tel"

            value={
              telefone
            }

            placeholder="(11) 99999-9999"

            maxLength={
              15
            }

            className={`
              text-[#E0E0E0]
              bg-[#2A2A2A]
              p-3
              w-full
              h-[45px]
              rounded-lg
              placeholder:text-[#757575]
              focus:outline-none
              focus:ring-2
              focus:ring-[#D3AF37]
              border
              ${erroTelefone
                ? 'border-[#D32F2F] ring-2 ring-[#D32F2F]'
                : 'border-[#333333]'
              }
            `}

            onChange={e =>

              handleTelefoneChange(

                e.target.value

              )

            }

          />

          {erroTelefone && (

            <p className="
              text-[#FF4D4D]
              text-xs
            ">

              {
                erroTelefone
              }

            </p>

          )}

        </div>

        {/* =================================================
            LISTA DE SERVIÇOS
        ================================================= */}

        {carregando && (

          <p className="
        text-center
        text-[#A0A0A0]
        p-4
    ">
            Carregando serviços...
          </p>

        )}
        {erro && (

          <p className="
        text-center
        text-[#FF4D4D]
        p-4
    ">
            {erro}
          </p>

        )}
        {!carregando &&
          !erro &&
          servicos.map(servico => (

            <Services

              key={
                servico.id
              }

              serviços={{

                checkbox:
                  servicosSelecionadosIds.includes(
                    servico.id
                  ),

                servico

              }}

              onServices={() =>

                selecionarServico(
                  servico.id
                )

              }

            />

          ))
        }

        {/* =================================================
            RESUMO DO AGENDAMENTO
        ================================================= */}

        <div className="
          w-full
          bg-[#121212]
          rounded-xl
          p-4
          flex
          flex-col
          gap-3
          text-[#E0E0E0]
          border
          border-[#2A2A2A]
        ">

          <div className="
            flex
            justify-between
            border-b
            border-[#2A2A2A]
            pb-2
          ">

            <span className="text-[#A0A0A0]">
              Data:
            </span>

            <strong className="text-[#FFFFFF]">
              {dataSelecionada}
            </strong>

          </div>

          <div className="
            flex
            justify-between
            border-b
            border-[#2A2A2A]
            pb-2
          ">

            <span className="text-[#A0A0A0]">
              Horário:
            </span>

            <strong className="text-[#FFFFFF]">
              {horarioSelecionado}
            </strong>

          </div>

          <div className="
            flex
            justify-between
            border-b
            border-[#2A2A2A]
            pb-2
          ">

            <span className="text-[#A0A0A0]">
              Tempo estimado:
            </span>

            <strong className="text-[#FFFFFF]">

              {
                formatarTempo(
                  tempoTotal
                )
              }

            </strong>

          </div>

          <div className="
            flex
            justify-between
            border-b
            border-[#2A2A2A]
            pb-2
          ">

            <span className="text-[#A0A0A0]">
              Blocos necessários:
            </span>

            <strong className="text-[#FFFFFF]">

              {
                blocosNecessarios
              }

            </strong>

          </div>

          <div className="
            flex
            justify-between
          ">

            <span className="text-[#A0A0A0]">
              Total:
            </span>

            <strong className="text-[#D3AF37] text-lg">

              R$ {
                somaFatu
              }

            </strong>

          </div>

        </div>

        {/* =================================================
            AVISO DE SOBREPOSIÇÃO
        ================================================= */}

        {mostrarAvisoSobreposicao && (

          <div className="
            w-full
            bg-[#2A2A2A]
            border
            border-[#D3AF37]
            rounded-xl
            p-4
            flex
            gap-3
            items-start
          ">

            <AlertTriangle

              className="
                text-[#D3AF37]
                shrink-0
                mt-0.5
              "
              size={20}

            />

            <p className="
              text-sm
              text-[#E0E0E0]
            ">

              Por conta do cliente antes de você,
              existe uma possibilidade de pequeno
              atraso.

              A estimativa é de aproximadamente

              <strong className="text-[#D3AF37]">

                {' '}

                {
                  atrasoEstimado
                }

                {' '}

                minutos

              </strong>.

              Isso pode variar de acordo com a duração
              real do atendimento anterior.

            </p>

          </div>

        )}

        {/* =================================================
            SUGESTÕES
        ================================================= */}

        {mostrarMensagemIndisponivel &&
          sugestoes.length > 0 && (

            <div className="
              w-full
              bg-[#2A2A2A]
              border
              border-[#D3AF37]
              rounded-xl
              p-4
              flex
              flex-col
              gap-3
            ">

              <h3 className="
                text-[#D3AF37]
                font-bold
              ">

                💡 Temos horários mais confortáveis
                para esse atendimento

              </h3>

              <p className="
                text-sm
                text-[#E0E0E0]
              ">

                Como os serviços selecionados precisam
                de mais tempo, encontramos algumas opções
                que permitem realizar seu atendimento
                com mais tranquilidade.

              </p>

              {sugestoes.map(

                (
                  sugestao,
                  index
                ) => {

                  const selecionada =

                    sugestaoSelecionada ===

                    `${sugestao.data}-${sugestao.horario}`

                  return (

                    <button

                      type="button"

                      onClick={() =>

                        selecionarSugestao(
                          sugestao
                        )

                      }

                      key={

                        `${sugestao.data}-${sugestao.horario}`

                      }

                      className={`

                        w-full

                        rounded-lg

                        p-3

                        flex

                        flex-col

                        gap-1

                        border-2

                        text-left

                        transition-all

                        cursor-pointer

                        ${selecionada

                          ? 'border-[#D3AF37] bg-[#1E1E1E] ring-2 ring-[#D3AF37]/50'

                          : 'border-[#333333] bg-[#121212] hover:border-[#757575]'
                        }

                      `}

                    >

                      <strong className="
                        text-[#D3AF37]
                      ">

                        Opção {
                          index + 1
                        }

                        {
                          selecionada &&
                          ' ✓'
                        }

                      </strong>

                      <span className="
                        text-[#FFFFFF]
                        font-semibold
                      ">

                        {
                          sugestao.horario
                        }

                      </span>

                      <span className="
                        text-xs
                        text-[#A0A0A0]
                      ">

                        {
                          sugestao.descricao
                        }

                      </span>

                      <span className="
                        text-xs
                        text-[#757575]
                      ">

                        Data: {
                          sugestao.data
                        }

                      </span>

                    </button>

                  )

                }

              )}

              <p className="
                text-xs
                text-[#757575]
              ">

                Escolha uma das sugestões acima
                para continuar o agendamento.

              </p>

            </div>

          )}

        {/* =================================================
            CONFIRMAR AGENDAMENTO
        ================================================= */}

        {!possuiServicosSelecionados ||

          podeAgendar ? (

          <div className="
            w-full
            rounded-xl
            bg-[#D3AF37]
            hover:bg-[#C4A032]
            transition-colors
          ">

           <button

  type="button"

  disabled={salvando}

  className="
    w-full
    p-4
    flex
    items-center
    justify-center
    gap-3
    rounded-xl
    text-[#121212]
    font-bold
    disabled:opacity-50
    disabled:cursor-not-allowed
  "

  onClick={
    confirmarAgendamento
  }

>

  <CalendarCheck2 size={20} />

  <span className="
    font-bold
    text-center
    text-sm
    tracking-wider
  ">

    {
      salvando
        ? 'SALVANDO...'
        : 'CONFIRMAR AGENDAMENTO'
    }

  </span>

</button>

          </div>

        ) : (

          <div className="
            w-full
            rounded-xl
            border-2
            border-[#D32F2F]
            bg-[#2A2A2A]
            p-5
            flex
            flex-col
            items-center
            gap-2
          ">

            <span className="
              text-[#FF4D4D]
              font-bold
              text-center
            ">

              Não é possível realizar este
              agendamento neste horário.

            </span>

            <span className="
              text-sm
              text-[#A0A0A0]
              text-center
            ">

              Escolha uma das sugestões acima
              para continuar o agendamento.

            </span>

          </div>

        )}

      </div>

    </div>

  )

}