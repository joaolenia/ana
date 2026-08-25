import { useState, useEffect } from 'react';
import './Dashboard.css';
import { FilterBar } from '../components/FilterBar';
import { RankingCard } from '../components/RankingCard';
import logoEscola from '../assets/image_d02b09.jpg';
import { LuTarget, LuTrophy, LuUsers, LuX, LuClock, LuCircleAlert, LuCircleCheck } from 'react-icons/lu';
import { supabase } from '../config/supabase';

export type Categoria = 'geral' | 'organizacao' | 'materiais' | 'respeito' | 'limpeza' | 'equipe' | 'participacao';

interface SalaDB {
  id: string;
  nome: string;
  organizacao: number;
  materiais: number;
  respeito: number;
  limpeza: number;
  equipe: number;
  participacao: number;
  geral?: number; 
  historico_registros?: any[];
}

export function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<Categoria>('geral');
  const [salas, setSalas] = useState<SalaDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para controlar o modal de histórico
  const [salaModal, setSalaModal] = useState<SalaDB | null>(null);

  useEffect(() => {
    async function fetchSalas() {
      try {
        const { data, error } = await supabase
          .from('salas')
          .select('*');

        if (error) throw error;

        if (data) {
          // Calcula a pontuação geral como a SOMA de todos os critérios
          const dataWithGeral = data.map(sala => {
            const soma = (sala.organizacao || 0) + 
                         (sala.materiais || 0) + 
                         (sala.respeito || 0) + 
                         (sala.limpeza || 0) + 
                         (sala.equipe || 0) + 
                         (sala.participacao || 0);
            return { ...sala, geral: soma };
          });
          setSalas(dataWithGeral);
        }
      } catch (err) {
        console.error("Erro ao buscar salas:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSalas();
  }, []);
  
  const sortedSalas = [...salas].sort((a, b) => (b[activeFilter] || 0) - (a[activeFilter] || 0));

  const totalSalas = sortedSalas.length;
  const mediaGeralEscola = totalSalas > 0 
    ? Math.round(salas.reduce((acc, curr) => acc + (curr.geral || 0), 0) / totalSalas) 
    : 0;
  const salaLider = sortedSalas[0];

  // Função para formatar a data (YYYY-MM-DD para DD/MM/YYYY)
  const formatarData = (dataString: string) => {
    if (!dataString) return '';
    const partes = dataString.split('-');
    if (partes.length !== 3) return dataString;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  return (
    <div className="dash-layout">
      <header className="dash-header">
        <div className="brand-group">
          <img src={logoEscola} alt="Colégio Ana Boico" className="brand-logo" />
          <div>
            <h1>Dashboard de Desempenho</h1>
            <p>Acompanhamento Analítico e Gamificação Escolar</p>
          </div>
        </div>
      </header>

      <main>
        {isLoading ? (
          <div className="loading-state">
            Carregando dados do servidor...
          </div>
        ) : (
          <>
            <section className="kpi-section">
              <div className="kpi-card">
                <div className="kpi-icon-wrapper" style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                  <LuTarget size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Média Geral da Escola</span>
                  <div className="kpi-value">{mediaGeralEscola} <span className="kpi-suffix">pts</span></div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                  <LuTrophy size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Líder Atual ({activeFilter})</span>
                  <div className="kpi-value">{salaLider ? salaLider.nome : '-'}</div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrapper" style={{ backgroundColor: '#dcfce7', color: '#047857' }}>
                  <LuUsers size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Salas Monitoradas</span>
                  <div className="kpi-value">{totalSalas}</div>
                </div>
              </div>
            </section>

            <section className="filter-section">
              <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </section>

            <section className="ranking-grid">
              {sortedSalas.map((sala, index) => (
                <div 
                  key={sala.id} 
                  className="ranking-card-wrapper"
                  onClick={() => setSalaModal(sala)}
                  title="Clique para ver o histórico"
                >
                  <RankingCard 
                    sala={sala} 
                    posicao={index + 1} 
                    categoria={activeFilter} 
                  />
                </div>
              ))}
            </section>
          </>
        )}
      </main>

      {/* MODAL DE HISTÓRICO */}
      {salaModal && (
        <div className="modal-overlay" onClick={() => setSalaModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <div>
                <h2>Histórico da Turma</h2>
                <p>{salaModal.nome}</p>
              </div>
              <button className="btn-close" onClick={() => setSalaModal(null)}>
                <LuX size={24} />
              </button>
            </header>

            <div className="history-list">
              {(!salaModal.historico_registros || salaModal.historico_registros.length === 0) ? (
                <div className="empty-history">
                  <LuClock size={48} />
                  <p>Nenhum registro encontrado para esta turma.</p>
                </div>
              ) : (
                // Inverte o array para mostrar os mais recentes primeiro
                [...salaModal.historico_registros].reverse().map((reg: any, index: number) => (
                  <div key={reg.id_registro || index} className={`history-item ${reg.tipo}`}>
                    <div className="history-item-icon">
                      {reg.tipo === 'avaliacao' ? <LuCircleCheck size={20} /> : <LuCircleAlert size={20} />}
                    </div>
                    <div className="history-item-details">
                      <div className="history-item-top">
                        <strong>Prof. {reg.professor}</strong>
                        <span className="history-date">{formatarData(reg.data)}</span>
                      </div>
                      
                      {reg.tipo === 'avaliacao' ? (
                        <div className="history-item-body positive">
                          <span>Avaliação Registrada</span>
                          <strong className="points">+{reg.pontos_totais} pts</strong>
                        </div>
                      ) : (
                        <div className="history-item-body negative">
                          <span>Penalidade: {reg.area_penalizada}</span>
                          <strong className="points">-{reg.pontos_retirados} pts</strong>
                          {reg.motivo && <p className="penalty-motive">"{reg.motivo}"</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}