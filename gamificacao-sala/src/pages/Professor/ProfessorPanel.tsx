import { useState, useEffect } from 'react';
import { REQUISITOS } from '../../config/data';
import type { RequisitoId } from '../../config/data';
import { supabase } from '../../config/supabase';
import { LuLogOut, LuCalendar, LuCircleCheck, LuPenTool, LuMessageSquareWarning, LuShieldAlert } from 'react-icons/lu';
import './ProfessorPanel.css';

interface ProfessorPanelProps {
  onLogout: () => void;
}

type Mode = 'avaliacao' | 'penalidade';

const MOTIVOS_PRESET: Record<string, string[]> = {
  organizacao: ['Carteiras bagunçadas', 'Sala desorganizada', 'Mochilas no caminho'],
  materiais: ['Material esquecido', 'Uso inadequado de material', 'Livro danificado'],
  respeito: ['Conversa paralela', 'Uso de celular', 'Desrespeito ao colega', 'Interrupção constante'],
  limpeza: ['Lixo no chão', 'Sujeira nas mesas', 'Quadro não apagado'],
  equipe: ['Falta de colaboração', 'Conflito no grupo', 'Trabalho não entregue'],
  participacao: ['Não realizou a atividade', 'Apatia / Dormindo', 'Atraso na entrega'],
};

export function ProfessorPanel({ onLogout }: ProfessorPanelProps) {
  const [salasList, setSalasList] = useState<{id: string, nome: string}[]>([]);
  const [isAvaliador, setIsAvaliador] = useState<boolean>(true);
  const [mode, setMode] = useState<Mode>('avaliacao');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [dataAcao, setDataAcao] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Estados de Avaliação
  const [notas, setNotas] = useState<Partial<Record<RequisitoId, number>>>({});

  // Estados de Penalidade
  const [penalidadeArea, setPenalidadeArea] = useState<string>('');
  const [penalidadePontos, setPenalidadePontos] = useState<number>(0);
  const [penalidadeMotivo, setPenalidadeMotivo] = useState<string>('');
  const [motivoCustom, setMotivoCustom] = useState<string>('');

  const professorNome = sessionStorage.getItem('professor_nome') || 'Professor';

  // Busca as salas e verifica se o usuário logado é avaliador na tabela 'usuarios'
  useEffect(() => {
    async function fetchData() {
      // 1. Busca salas
      const { data: salasData } = await supabase.from('salas').select('id, nome').order('nome');
      if (salasData) setSalasList(salasData);

      // 2. Verifica permissão de avaliador na tabela 'usuarios'
      const { data: userData, error } = await supabase
        .from('usuarios')
        .select('avaliador')
        .ilike('nome', professorNome)
        .single();

      if (!error && userData) {
        const podeAvaliar = Boolean(userData.avaliador);
        setIsAvaliador(podeAvaliar);
        if (!podeAvaliar) {
          setMode('penalidade'); // Se avaliador for false, força para o modo de penalidade
        }
      }
    }
    fetchData();
  }, [professorNome]);

  const handleNota = (reqId: RequisitoId, valor: number) => {
    setNotas(prev => ({ ...prev, [reqId]: valor }));
  };

  const handleSalvar = async () => {
    setStatus('loading');
    
    try {
      const { data: salaAtual, error: fetchError } = await supabase
        .from('salas')
        .select('*')
        .eq('id', turmaSelecionada)
        .single();

      if (fetchError || !salaAtual) throw new Error('Erro ao buscar dados da sala');

      const novasMetricas = {
        organizacao: salaAtual.organizacao || 0,
        materiais: salaAtual.materiais || 0,
        respeito: salaAtual.respeito || 0,
        limpeza: salaAtual.limpeza || 0,
        equipe: salaAtual.equipe || 0,
        participacao: salaAtual.participacao || 0,
      };

      const novoRegistro: any = {
        id_registro: crypto.randomUUID(),
        professor: professorNome,
        data: dataAcao,
      };

      if (mode === 'avaliacao') {
        if (!isAvaliador) {
          alert('Acesso negado: Seu usuário não possui permissão para realizar avaliações.');
          setStatus('idle');
          return;
        }

        (Object.keys(notas) as RequisitoId[]).forEach((req) => {
          novasMetricas[req] += notas[req]!;
        });
        
        novoRegistro.tipo = 'avaliacao';
        novoRegistro.pontos_totais = somaTotal;
        novoRegistro.notas = notas;
      } else {
        const area = penalidadeArea as keyof typeof novasMetricas;
        novasMetricas[area] -= penalidadePontos;
        
        const motivoFinal = motivoCustom.trim() !== '' ? motivoCustom : penalidadeMotivo;
        
        novoRegistro.tipo = 'penalidade';
        novoRegistro.pontos_retirados = penalidadePontos;
        novoRegistro.area_penalizada = penalidadeArea;
        novoRegistro.motivo = motivoFinal;
      }

      const historicoAtualizado = [...(salaAtual.historico_registros || []), novoRegistro];

      const { error: updateError } = await supabase
        .from('salas')
        .update({
          ...novasMetricas,
          historico_registros: historicoAtualizado
        })
        .eq('id', turmaSelecionada);

      if (updateError) throw updateError;

      setStatus('success');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar no banco de dados. Tente novamente.');
      setStatus('idle');
    }
  };

  const resetForm = () => {
    setNotas({});
    setPenalidadeArea('');
    setPenalidadePontos(0);
    setPenalidadeMotivo('');
    setMotivoCustom('');
    setStatus('idle');
  };

  const totalPreenchidos = Object.keys(notas).length;
  const isCompleto = totalPreenchidos === REQUISITOS.length;
  const somaTotal = Object.values(notas).reduce((acc, curr) => (acc || 0) + (curr || 0), 0) || 0;
  const media = totalPreenchidos > 0 ? (somaTotal / totalPreenchidos).toFixed(1) : '0.0';
  const isPenalidadeValida = penalidadeArea !== '' && penalidadePontos > 0 && (penalidadeMotivo !== '' || motivoCustom.trim() !== '');

  const getColorClass = (nota: number) => {
    if (nota <= 4) return 'score-danger';
    if (nota <= 6) return 'score-warning';
    if (nota <= 8) return 'score-good';
    return 'score-excellent';
  };

  if (status === 'success') {
    return (
      <div className="panel-container success-view">
        <div className="success-card">
          <LuCircleCheck size={64} className={`success-icon ${mode === 'penalidade' ? 'text-danger' : ''}`} />
          <h2>{mode === 'avaliacao' ? 'Pontuação Salva!' : 'Penalidade Registrada!'}</h2>
          <p>A ação para a turma foi processada com sucesso no sistema.</p>
          <button className={`btn-primary ${mode === 'penalidade' ? 'btn-danger' : ''}`} onClick={resetForm}>
            Realizar Novo Lançamento
          </button>
          <button className="btn-ghost" onClick={onLogout}>Sair do Sistema</button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-container">
      <header className="panel-header">
        <div>
          <h1>Ações da Turma</h1>
          <p>Olá, {professorNome}! {!isAvaliador && <span className="badge-restricted"><LuShieldAlert size={14}/> Modo Restrito: Apenas Penalidades</span>}</p>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          <LuLogOut size={18} /> Sair
        </button>
      </header>

      <div className="config-bar">
        <div className="input-group">
          <label>Turma</label>
          <select 
            value={turmaSelecionada} 
            onChange={(e) => setTurmaSelecionada(e.target.value)}
            className="modern-select"
          >
            <option value="" disabled>Selecione uma turma...</option>
            {salasList.map(t => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Data da Ação</label>
          <div className="date-wrapper">
            <LuCalendar className="date-icon" />
            <input 
              type="date" 
              value={dataAcao}
              onChange={(e) => setDataAcao(e.target.value)}
              className="modern-date"
            />
          </div>
        </div>
      </div>

      {isAvaliador && (
        <div className="mode-tabs">
          <button 
            className={`mode-tab ${mode === 'avaliacao' ? 'active' : ''}`}
            onClick={() => setMode('avaliacao')}
          >
            <LuPenTool size={18} /> Lançar Pontuação
          </button>
          <button 
            className={`mode-tab danger-tab ${mode === 'penalidade' ? 'active' : ''}`}
            onClick={() => setMode('penalidade')}
          >
            <LuPenTool size={18} /> Aplicar Penalidade
          </button>
        </div>
      )}

      {mode === 'avaliacao' && isAvaliador && (
        <div className="requirements-grid fade-in">
          {REQUISITOS.map(req => {
            const Icon = req.Icon;
            const notaAtual = notas[req.id];

            return (
              <div key={req.id} className={`req-card ${notaAtual !== undefined ? 'filled' : ''}`}>
                <div className="req-header">
                  <div className="req-title">
                    <Icon size={20} className="req-icon" />
                    <div>
                      <h3>{req.label}</h3>
                      <p>{req.desc}</p>
                    </div>
                  </div>
                  {notaAtual !== undefined && (
                    <div className={`req-badge ${getColorClass(notaAtual)}`}>{notaAtual}</div>
                  )}
                </div>

                <div className="score-picker">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <button
                      key={num}
                      className={`score-btn ${notaAtual === num ? `selected ${getColorClass(num)}` : ''}`}
                      onClick={() => handleNota(req.id, num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {mode === 'penalidade' && (
        <div className="penalty-section fade-in">
          <div className="penalty-card">
            
            <div className="input-group">
              <label>1. Selecione a Área da Ocorrência</label>
              <div className="area-picker">
                {REQUISITOS.map(req => (
                  <button 
                    key={req.id}
                    className={`area-btn ${penalidadeArea === req.id ? 'active' : ''}`}
                    onClick={() => {
                      setPenalidadeArea(req.id);
                      setPenalidadeMotivo(''); 
                    }}
                  >
                    <req.Icon size={16} /> {req.label}
                  </button>
                ))}
              </div>
            </div>

            {penalidadeArea && (
              <>
                <div className="input-group mt-4">
                  <label>2. Pontos a Retirar (1 a 10)</label>
                  <div className="score-picker penalty-picker">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <button
                        key={num}
                        className={`score-btn penalty-btn ${penalidadePontos === num ? 'selected' : ''}`}
                        onClick={() => setPenalidadePontos(num)}
                      >
                        -{num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="input-group mt-4">
                  <label>3. Motivo da Penalidade</label>
                  <div className="motives-wrapper">
                    {MOTIVOS_PRESET[penalidadeArea]?.map(motivo => (
                      <button 
                        key={motivo}
                        className={`motive-chip ${penalidadeMotivo === motivo ? 'active' : ''}`}
                        onClick={() => {
                          setPenalidadeMotivo(motivo);
                          setMotivoCustom('');
                        }}
                      >
                        {motivo}
                      </button>
                    ))}
                  </div>
                  
                  <div className="custom-motive mt-2">
                    <LuMessageSquareWarning className="input-icon-left" />
                    <input 
                      type="text" 
                      placeholder="Ou digite outro motivo..." 
                      className="modern-input"
                      value={motivoCustom}
                      onChange={(e) => {
                        setMotivoCustom(e.target.value);
                        setPenalidadeMotivo('');
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="panel-footer">
        {mode === 'avaliacao' && isAvaliador ? (
          <div className="summary-box">
            <div className="summary-item">
              <span>Status</span>
              <strong>{totalPreenchidos} / {REQUISITOS.length}</strong>
            </div>
            <div className="summary-item">
              <span>Total</span>
              <strong>{somaTotal} pts</strong>
            </div>
            <div className="summary-item">
              <span>Média</span>
              <strong>{media}</strong>
            </div>
          </div>
        ) : (
          <div className="summary-box">
             <div className="summary-item">
              <span>Resumo</span>
              <strong className="text-danger">
                {penalidadePontos > 0 ? `-${penalidadePontos} pts` : '0 pts'}
              </strong>
            </div>
          </div>
        )}

        <button 
          className={`btn-save ${mode === 'penalidade' ? 'btn-danger-gradient' : ''}`} 
          disabled={
            mode === 'avaliacao' && isAvaliador
              ? (!turmaSelecionada || !isCompleto || status === 'loading')
              : (!turmaSelecionada || !isPenalidadeValida || status === 'loading')
          }
          onClick={handleSalvar}
        >
          {status === 'loading' ? 'Processando...' : (mode === 'avaliacao' && isAvaliador ? 'Salvar Avaliação' : 'Registrar Penalidade')}
        </button>
      </div>
    </div>
  );
}