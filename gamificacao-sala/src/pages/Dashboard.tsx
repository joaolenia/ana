import { useState, useEffect } from 'react';
import './Dashboard.css';
import { FilterBar } from '../components/FilterBar';
import { RankingCard } from '../components/RankingCard';
import logoEscola from '../assets/image_d02b09.jpg';
import { LuTarget, LuTrophy, LuUsers } from 'react-icons/lu';
import { supabase } from '../config/supabase'; // <-- Conexão com o banco

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
  geral?: number; // Calculado no front
}

export function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<Categoria>('geral');
  const [salas, setSalas] = useState<SalaDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Busca os dados do Supabase ao montar a tela
  useEffect(() => {
    async function fetchSalas() {
      try {
        const { data, error } = await supabase
          .from('salas')
          .select('*');

        if (error) throw error;

        if (data) {
          // Calcula a média geral de cada sala com base nos dados do banco
          const dataWithGeral = data.map(sala => {
            const media = (sala.organizacao + sala.materiais + sala.respeito + sala.limpeza + sala.equipe + sala.participacao) / 6;
            return { ...sala, geral: Math.round(media) };
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
  
  // Ordena as salas baseadas no filtro ativo
  const sortedSalas = [...salas].sort((a, b) => (b[activeFilter] || 0) - (a[activeFilter] || 0));

  // KPIs
  const totalSalas = sortedSalas.length;
  const mediaGeralEscola = totalSalas > 0 
    ? Math.round(salas.reduce((acc, curr) => acc + (curr.geral || 0), 0) / totalSalas) 
    : 0;
  const salaLider = sortedSalas[0];

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
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
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
                <RankingCard 
                  key={sala.id} 
                  sala={sala} 
                  posicao={index + 1} 
                  categoria={activeFilter} 
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}