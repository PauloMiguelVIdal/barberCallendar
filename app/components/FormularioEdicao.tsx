// components/FormularioEdicao.tsx
'use client'

import {
  useMemo,
  useState,
  useEffect
} from 'react'

import {
  X,
  CalendarCheck2,
  AlertTriangle,
  Save
} from 'lucide-react'

import Services from './Services'
import { useServicos } from '../hooks/useServicos'
import { ServicoSelecionadoType } from '../types/service'

import {
  buscarClientePorId
} from '../services/clienteService'

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
  agendamentoId: string
  agendamentoData: {
    id: string
    data: string
    hora_inicio: string
    hora_fim: string
    cliente_id: string
    observacoes?: string
    concluido: boolean
    cancelado: boolean
    servicos_ids?: string[]
  }
  fecharModal: () => void
  onUpdate?: () => void
  agendamentos?: Agendamento[]
}

// =========================================================
// CONFIGURAÇÕES
// =========================================================

const DURACAO_BLOCO = 45
const TEMPO_TOLERANCIA = 20
const LIMITE_SOBREPOSICAO_AVISO = 20

const HORARIOS_DISPONIVEIS = [
  '9:00', '9:45', '10:30', '11:15',
  '12:00', '12:45', '13:30', '14:15',
  '15:00', '15:45', '16:30', '17:15',
  '18:00', '18:45', '19:30'
]

// =========================================================
// COMPONENTE
// =========================================================

export default function FormularioEdicao({
  agendamentoId,
  agendamentoData,
  fecharModal,
  onUpdate,
  agendamentos = []
}: Props) {

  // =======================================================
  // CONTEXT
  // =======================================================

  const {
    selecionarHorario,
    definirDataAgendamento,
    atualizarAgendamento
  } = useCentralDados()

  // =======================================================
  // ESTADOS
  // =======================================================

  const [salvando, setSalvando] = useState(false)
  const [carregandoDados, setCarregandoDados] = useState(true)
  
  const [horarioSelecionado, setHorarioSelecionado] = useState(agendamentoData.hora_inicio.slice(0, 5))
  const [dataSelecionada, setDataSelecionada] = useState(agendamentoData.data)
  const [sugestaoSelecionada, setSugestaoSelecionada] = useState<string | null>(null)
  
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [erroTelefone, setErroTelefone] = useState('')
  const [clienteId, setClienteId] = useState(agendamentoData.cliente_id)

  const [servicosSelecionadosIds, setServicosSelecionadosIds] = useState<string[]>([])

  // =======================================================
  // SERVIÇOS
  // =======================================================

  const {
    servicos,
    carregando,
    erro
  } = useServicos()

  // =======================================================
  // CARREGAR DADOS DO CLIENTE
  // =======================================================

  useEffect(() => {
    async function carregarCliente() {
      if (!agendamentoData.cliente_id) {
        setCarregandoDados(false)
        return
      }

      try {
        const cliente = await buscarClientePorId(agendamentoData.cliente_id)
        if (cliente) {
          setNome(cliente.nome || '')
          setTelefone(formatarTelefone(cliente.telefone || ''))
          setClienteId(cliente.id)
          
          // Se tiver serviços salvos no agendamento
          if (agendamentoData.servicos_ids && agendamentoData.servicos_ids.length > 0) {
            setServicosSelecionadosIds(agendamentoData.servicos_ids)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar cliente:', error)
      } finally {
        setCarregandoDados(false)
      }
    }

    carregarCliente()
  }, [agendamentoData])

  // =======================================================
  // SELECIONAR SERVIÇO
  // =======================================================

  function selecionarServico(servicoId: string) {
    setServicosSelecionadosIds(prev => {
      if (prev.includes(servicoId)) {
        return prev.filter(id => id !== servicoId)
      }
      return [...prev, servicoId]
    })
  }

  // =======================================================
  // FORMATAR DATA
  // =======================================================

  function formatarDataExibicao(dataString: string) {
    const [ano, mes, dia] = dataString.split('-').map(Number)
    return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`
  }

  // =======================================================
  // FORMATAR TELEFONE
  // =======================================================

  function formatarTelefone(valor: string) {
    const apenasNumeros = valor.replace(/\D/g, '')
    const numerosLimitados = apenasNumeros.slice(0, 11)

    if (numerosLimitados.length <= 2) {
      return numerosLimitados ? `(${numerosLimitados}` : ''
    }
    if (numerosLimitados.length <= 7) {
      return `(${numerosLimitados.slice(0, 2)}) ${numerosLimitados.slice(2)}`
    }
    return `(${numerosLimitados.slice(0, 2)}) ${numerosLimitados.slice(2, 7)}-${numerosLimitados.slice(7, 11)}`
  }

  // =======================================================
  // SERVIÇOS SELECIONADOS
  // =======================================================

  const servicosSelecionados = servicos.filter(
    servico => servicosSelecionadosIds.includes(servico.id)
  )

  // =======================================================
  // TEMPO TOTAL
  // =======================================================

  const tempoTotal = servicosSelecionados.reduce(
    (total, servico) => total + servico.duracao,
    0
  )

  // =======================================================
  // BLOCOS NECESSÁRIOS
  // =======================================================

  const blocosNecessarios = tempoTotal > 0
    ? Math.max(1, Math.ceil((tempoTotal - TEMPO_TOLERANCIA) / DURACAO_BLOCO))
    : 0

  // =======================================================
  // VALOR TOTAL
  // =======================================================

  const somaFatu = servicosSelecionados.reduce(
    (total, servico) => total + servico.valor,
    0
  )

  // =======================================================
  // FORMATAR TEMPO
  // =======================================================

  function formatarTempo(minutos: number) {
    const horas = Math.floor(minutos / 60)
    const minutosRestantes = minutos % 60

    if (horas === 0) return `${minutosRestantes} min`
    if (minutosRestantes === 0) return `${horas}h`
    return `${horas}h ${minutosRestantes}min`
  }

  // =======================================================
  // FUNÇÕES AUXILIARES
  // =======================================================

  function horarioParaMinutos(horarioString: string) {
    const [horas, minutos] = horarioString.split(':').map(Number)
    return horas * 60 + minutos
  }

  function adicionarDias(dataString: string, quantidade: number) {
    const [ano, mes, dia] = dataString.split('-').map(Number)
    const dataAtual = new Date(ano, mes - 1, dia)
    dataAtual.setDate(dataAtual.getDate() + quantidade)
    return `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}-${String(dataAtual.getDate()).padStart(2, '0')}`
  }

  function blocoEstaOcupado(dataVerificacao: string, horarioVerificacao: string) {
    const minutoVerificacao = horarioParaMinutos(horarioVerificacao)

    return agendamentos.some(agendamento => {
      if (agendamento.data !== dataVerificacao) return false
      if (agendamento.id === agendamentoId) return false // Ignora o próprio agendamento

      const inicioAgendamento = horarioParaMinutos(agendamento.hora)
      const duracaoAgendamento = agendamento.duracao ?? 45
      const blocosAgendamento = agendamento.blocos ??
        Math.max(1, Math.ceil((duracaoAgendamento - TEMPO_TOLERANCIA) / DURACAO_BLOCO))
      const fimAgendamento = inicioAgendamento + (blocosAgendamento * DURACAO_BLOCO)

      return minutoVerificacao >= inicioAgendamento && minutoVerificacao < fimAgendamento
    })
  }

  function verificarDisponibilidade(dataVerificacao: string, horarioInicial: string) {
    if (blocosNecessarios <= 0) return false

    const indiceInicial = HORARIOS_DISPONIVEIS.indexOf(horarioInicial)
    if (indiceInicial === -1) return false

    for (let i = 0; i < blocosNecessarios; i++) {
      const indiceHorario = indiceInicial + i
      if (indiceHorario >= HORARIOS_DISPONIVEIS.length) return false

      const horarioAtual = HORARIOS_DISPONIVEIS[indiceHorario]
      if (blocoEstaOcupado(dataVerificacao, horarioAtual)) return false
    }

    return true
  }

  function obterClienteAnterior() {
    const indiceHorarioSelecionado = HORARIOS_DISPONIVEIS.indexOf(horarioSelecionado)
    if (indiceHorarioSelecionado <= 0) return null

    for (let i = indiceHorarioSelecionado - 1; i >= 0; i--) {
      const horarioAnterior = HORARIOS_DISPONIVEIS[i]
      const clienteExiste = blocoEstaOcupado(dataSelecionada, horarioAnterior)
      if (clienteExiste) {
        return { horario: horarioAnterior, indice: i }
      }
    }
    return null
  }

  const sobreposicaoEstimada = useMemo(() => {
    if (agendamentos.length === 0 || !servicosSelecionados.length) return 0

    const clienteAnterior = obterClienteAnterior()
    if (!clienteAnterior) return 0

    const inicioNovoCliente = horarioParaMinutos(horarioSelecionado)
    const fimNovoCliente = inicioNovoCliente + tempoTotal

    const inicioClienteAnterior = horarioParaMinutos(clienteAnterior.horario)
    const agendamentoAnterior = agendamentos.find(
      agendamento => agendamento.data === dataSelecionada &&
        agendamento.hora === clienteAnterior.horario &&
        agendamento.id !== agendamentoId
    )

    const duracaoClienteAnterior = agendamentoAnterior?.duracao ?? DURACAO_BLOCO
    const fimClienteAnterior = inicioClienteAnterior + duracaoClienteAnterior

    const sobreposicao = Math.max(0,
      Math.min(fimNovoCliente, fimClienteAnterior) -
      Math.max(inicioNovoCliente, inicioClienteAnterior)
    )

    return sobreposicao
  }, [agendamentos, dataSelecionada, horarioSelecionado, tempoTotal, servicosSelecionados.length])

  const mostrarAvisoSobreposicao = sobreposicaoEstimada > LIMITE_SOBREPOSICAO_AVISO
  const atrasoEstimado = Math.ceil(sobreposicaoEstimada / 2)

  // =======================================================
  // DISPONIBILIDADE
  // =======================================================

  const possuiServicosSelecionados = servicosSelecionados.length > 0
  const podeAgendar = possuiServicosSelecionados &&
    verificarDisponibilidade(dataSelecionada, horarioSelecionado)

  const mostrarMensagemIndisponivel = possuiServicosSelecionados && !podeAgendar

  // =======================================================
  // SUGESTÕES
  // =======================================================

  const sugestoes = useMemo<Sugestao[]>(() => {
    if (!possuiServicosSelecionados ||
      verificarDisponibilidade(dataSelecionada, horarioSelecionado)) {
      return []
    }

    const resultado: Sugestao[] = []

    // Sugestão: mesmo dia, outro horário
    for (const horarioSugestao of HORARIOS_DISPONIVEIS) {
      if (horarioSugestao === horarioSelecionado) continue
      if (verificarDisponibilidade(dataSelecionada, horarioSugestao)) {
        resultado.push({
          data: dataSelecionada,
          horario: horarioSugestao,
          descricao: 'Outro horário disponível no mesmo dia'
        })
        break
      }
    }

    // Sugestão: mesmo horário, outro dia
    for (let dias = 1; dias <= 30; dias++) {
      const novaData = adicionarDias(dataSelecionada, dias)
      if (verificarDisponibilidade(novaData, horarioSelecionado)) {
        resultado.push({
          data: novaData,
          horario: horarioSelecionado,
          descricao: 'Mesmo horário no dia mais próximo'
        })
        break
      }
    }

    // Sugestão: próximo semana mesmo dia/horário
    const proximaSemana = adicionarDias(dataSelecionada, 7)
    if (verificarDisponibilidade(proximaSemana, horarioSelecionado)) {
      resultado.push({
        data: proximaSemana,
        horario: horarioSelecionado,
        descricao: 'Mesmo horário no mesmo dia da semana, na próxima semana'
      })
    }

    return resultado
  }, [blocosNecessarios, horarioSelecionado, dataSelecionada, agendamentos, possuiServicosSelecionados])

  // =======================================================
  // SELECIONAR SUGESTÃO
  // =======================================================

  function selecionarSugestao(sugestao: Sugestao) {
    setHorarioSelecionado(sugestao.horario)
    setDataSelecionada(sugestao.data)
    selecionarHorario(sugestao.horario)
    definirDataAgendamento(sugestao.data)
    setSugestaoSelecionada(`${sugestao.data}-${sugestao.horario}`)
  }

  // =======================================================
  // CALCULAR HORA FIM
  // =======================================================

  function calcularHoraFim(horaInicio: string, duracaoMinutos: number) {
    const [horas, minutos] = horaInicio.split(':').map(Number)
    const totalMinutos = horas * 60 + minutos + duracaoMinutos
    const horasFim = Math.floor(totalMinutos / 60)
    const minutosFim = totalMinutos % 60
    return `${String(horasFim).padStart(2, '0')}:${String(minutosFim).padStart(2, '0')}`
  }

  // =======================================================
  // VALIDAR TELEFONE
  // =======================================================

  function telefoneValido() {
    const apenasNumeros = telefone.replace(/\D/g, '')
    if (apenasNumeros.length !== 11) return false
    if (apenasNumeros[2] !== '9') return false
    if (/^(\d)\1+$/.test(apenasNumeros)) return false
    return true
  }

  function handleTelefoneChange(valor: string) {
    setTelefone(formatarTelefone(valor))
    setErroTelefone('')
  }

  // =======================================================
  // SALVAR ALTERAÇÕES
  // =======================================================

  async function salvarAlteracoes() {
    // Validar nome
    if (!nome.trim()) {
      alert('Digite o nome do cliente.')
      return
    }

    // Validar telefone
    if (!telefoneValido()) {
      setErroTelefone('Digite um telefone celular válido. Exemplo: (11) 99999-9999')
      return
    }

    // Validar serviços
    if (servicosSelecionados.length === 0) {
      alert('Selecione pelo menos um serviço.')
      return
    }

    // Validar disponibilidade
    if (!verificarDisponibilidade(dataSelecionada, horarioSelecionado)) {
      alert('Esse horário não possui blocos consecutivos suficientes para realizar todos os serviços selecionados. Escolha outro horário.')
      return
    }

    try {
      setSalvando(true)

      const telefoneBanco = telefone.replace(/\D/g, '')
      const horaFim = calcularHoraFim(horarioSelecionado, tempoTotal)

      // Atualizar agendamento
      await atualizarAgendamento(
        agendamentoId,
        {
          // Dados para o Supabase
          cliente_id: clienteId,
          servicos_id: servicosSelecionadosIds,
          data: dataSelecionada,
          hora_inicio: horarioSelecionado,
          hora_fim: horaFim,
          observacoes: agendamentoData.observacoes,
          concluido: agendamentoData.concluido,
          cancelado: agendamentoData.cancelado
        },
        {
          // Dados para o Local Storage
          data: dataSelecionada,
          hora: horarioSelecionado,
          hora_fim: horaFim,
          nome: nome.trim(),
          telefone: telefoneBanco,
          servicos: servicosSelecionados.map(servico => ({
            id: servico.id,
            nome: servico.nome,
            duracao: servico.duracao,
            valor: servico.valor
          })),
          duracao: tempoTotal,
          valor: somaFatu,
          blocos: blocosNecessarios,
          cancelado: false
        }
      )

      // Atualizar context
      selecionarHorario(horarioSelecionado)
      definirDataAgendamento(dataSelecionada)

      // Fechar modal
      fecharModal()

      // Callback de atualização
      if (onUpdate) {
        onUpdate()
      }

    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error)
      alert('Não foi possível atualizar o agendamento. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  // =======================================================
  // RENDER
  // =======================================================

  if (carregandoDados || carregando) {
    return (
      <div className="w-full h-screen bg-[#121212]/90 fixed top-0 left-0 z-[100] flex items-center justify-center p-4">
        <div className="w-[90%] max-w-[500px] bg-[#1E1E1E] p-8 rounded-xl border border-[#2A2A2A] text-center">
          <div className="w-12 h-12 border-4 border-[#D3AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#A0A0A0]">Carregando dados do agendamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-[#121212]/90 fixed top-0 left-0 z-[100] flex items-center justify-center p-4">
      <div className="w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto bg-[#1E1E1E] flex flex-col p-6 gap-4 rounded-xl border border-[#2A2A2A]">

        {/* =====================================================
            CABEÇALHO
        ====================================================== */}
        <div className="flex items-center justify-between">
          <h2 className="text-[#D3AF37] text-lg font-bold">
            Editar Agendamento
          </h2>
          <button
            type="button"
            className="flex items-center justify-center rounded-full w-10 h-10 transition-all duration-300 ease-in-out border-2 bg-[#1E1E1E] border-[#D3AF37] hover:bg-[#D3AF37] hover:scale-110 active:scale-95 group"
            onClick={fecharModal}
          >
            <X
              size={24}
              className="text-[#D3AF37] group-hover:text-[#121212] transition-colors duration-300"
            />
          </button>
        </div>

        {/* =====================================================
            CAMPOS NOME E TELEFONE
        ====================================================== */}
        <div className="w-full flex flex-col gap-2">
          <input
            type="text"
            value={nome}
            className="text-[#E0E0E0] bg-[#2A2A2A] p-3 w-full h-[45px] rounded-lg placeholder:text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#D3AF37] border border-[#333333]"
            onChange={e => setNome(e.target.value.toUpperCase())}
            placeholder="NOME"
          />

          <input
            type="tel"
            value={telefone}
            placeholder="(11) 99999-9999"
            maxLength={15}
            className={`text-[#E0E0E0] bg-[#2A2A2A] p-3 w-full h-[45px] rounded-lg placeholder:text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#D3AF37] border ${erroTelefone ? 'border-[#D32F2F] ring-2 ring-[#D32F2F]' : 'border-[#333333]'}`}
            onChange={e => handleTelefoneChange(e.target.value)}
          />

          {erroTelefone && (
            <p className="text-[#FF4D4D] text-xs">{erroTelefone}</p>
          )}
        </div>

        {/* =====================================================
            SERVIÇOS
        ====================================================== */}
        {erro && (
          <p className="text-center text-[#FF4D4D] p-4">{erro}</p>
        )}

        {!carregando && !erro && servicos.map(servico => (
          <Services
            key={servico.id}
            serviços={{
              checkbox: servicosSelecionadosIds.includes(servico.id),
              servico
            }}
            onServices={() => selecionarServico(servico.id)}
          />
        ))}

        {/* =====================================================
            RESUMO
        ====================================================== */}
        <div className="w-full bg-[#121212] rounded-xl p-4 flex flex-col gap-3 text-[#E0E0E0] border border-[#2A2A2A]">
          <div className="flex justify-between border-b border-[#2A2A2A] pb-2">
            <span className="text-[#A0A0A0]">Data:</span>
            <strong className="text-[#FFFFFF]">{formatarDataExibicao(dataSelecionada)}</strong>
          </div>
          <div className="flex justify-between border-b border-[#2A2A2A] pb-2">
            <span className="text-[#A0A0A0]">Horário:</span>
            <strong className="text-[#FFFFFF]">{horarioSelecionado}</strong>
          </div>
          <div className="flex justify-between border-b border-[#2A2A2A] pb-2">
            <span className="text-[#A0A0A0]">Tempo estimado:</span>
            <strong className="text-[#FFFFFF]">{formatarTempo(tempoTotal)}</strong>
          </div>
          <div className="flex justify-between border-b border-[#2A2A2A] pb-2">
            <span className="text-[#A0A0A0]">Blocos necessários:</span>
            <strong className="text-[#FFFFFF]">{blocosNecessarios}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A0A0A0]">Total:</span>
            <strong className="text-[#D3AF37] text-lg">
              R$ {somaFatu.toFixed(2).replace('.', ',')}
            </strong>
          </div>
        </div>

        {/* =====================================================
            AVISO DE SOBREPOSIÇÃO
        ====================================================== */}
        {mostrarAvisoSobreposicao && (
          <div className="w-full bg-[#2A2A2A] border border-[#D3AF37] rounded-xl p-4 flex gap-3 items-start">
            <AlertTriangle className="text-[#D3AF37] shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-[#E0E0E0]">
              Por conta do cliente antes de você, existe uma possibilidade de pequeno atraso.
              A estimativa é de aproximadamente
              <strong className="text-[#D3AF37]"> {atrasoEstimado} minutos</strong>.
              Isso pode variar de acordo com a duração real do atendimento anterior.
            </p>
          </div>
        )}

        {/* =====================================================
            SUGESTÕES
        ====================================================== */}
        {mostrarMensagemIndisponivel && sugestoes.length > 0 && (
          <div className="w-full bg-[#2A2A2A] border border-[#D3AF37] rounded-xl p-4 flex flex-col gap-3">
            <h3 className="text-[#D3AF37] font-bold">
              💡 Temos horários mais confortáveis para esse atendimento
            </h3>
            <p className="text-sm text-[#E0E0E0]">
              Como os serviços selecionados precisam de mais tempo, encontramos algumas opções
              que permitem realizar seu atendimento com mais tranquilidade.
            </p>

            {sugestoes.map((sugestao, index) => {
              const selecionada = sugestaoSelecionada === `${sugestao.data}-${sugestao.horario}`
              return (
                <button
                  type="button"
                  onClick={() => selecionarSugestao(sugestao)}
                  key={`${sugestao.data}-${sugestao.horario}`}
                  className={`w-full rounded-lg p-3 flex flex-col gap-1 border-2 text-left transition-all cursor-pointer ${selecionada
                      ? 'border-[#D3AF37] bg-[#1E1E1E] ring-2 ring-[#D3AF37]/50'
                      : 'border-[#333333] bg-[#121212] hover:border-[#757575]'
                    }`}
                >
                  <strong className="text-[#D3AF37]">
                    Opção {index + 1}{selecionada && ' ✓'}
                  </strong>
                  <span className="text-[#FFFFFF] font-semibold">{sugestao.horario}</span>
                  <span className="text-xs text-[#A0A0A0]">{sugestao.descricao}</span>
                  <span className="text-xs text-[#757575]">Data: {formatarDataExibicao(sugestao.data)}</span>
                </button>
              )
            })}

            <p className="text-xs text-[#757575]">
              Escolha uma das sugestões acima para continuar o agendamento.
            </p>
          </div>
        )}

        {/* =====================================================
            BOTÃO SALVAR
        ====================================================== */}
        {!possuiServicosSelecionados || podeAgendar ? (
          <div className="w-full rounded-xl bg-[#D3AF37] hover:bg-[#C4A032] transition-colors">
            <button
              type="button"
              disabled={salvando}
              className="w-full p-4 flex items-center justify-center gap-3 rounded-xl text-[#121212] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={salvarAlteracoes}
            >
              <Save size={20} />
              <span className="font-bold text-center text-sm tracking-wider">
                {salvando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
              </span>
            </button>
          </div>
        ) : (
          <div className="w-full rounded-xl border-2 border-[#D32F2F] bg-[#2A2A2A] p-5 flex flex-col items-center gap-2">
            <span className="text-[#FF4D4D] font-bold text-center">
              Não é possível realizar este agendamento neste horário.
            </span>
            <span className="text-sm text-[#A0A0A0] text-center">
              Escolha uma das sugestões acima para continuar o agendamento.
            </span>
          </div>
        )}

      </div>
    </div>
  )
}