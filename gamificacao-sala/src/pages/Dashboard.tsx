import { useState } from 'react';
import './Dashboard.css';
import { FilterBar } from '../components/FilterBar';
import { RankingCard } from '../components/RankingCard';
import logoEscola from '../assets/image.png';
import { LuTrendingUp, LuUsers, LuTarget } from 'react-icons/lu';

// Dados simulados (Mock) enriquecidos com 'alunos' e 'tendencia' de evolução
const salasData = [
  { id: '1', nome: '6º Ano A', alunos: 32, tendencia: 'up', organizacao: 85, materiais: 90, respeito: 95, limpeza: 80, equipe: 88, participacao: 92 },
  { id: '2', nome: '7º Ano B', alunos: 28, tendencia: 'up', organizacao: 92, materiais: 85, respeito: 88, limpeza: 95, equipe: 90, participacao: 85 },
  { id: '3', nome: '8º Ano A', alunos: 35, tendencia: 'down', organizacao: 78, materiais: 80, respeito: 85, limpeza: 75, equipe: 82, participacao: 88 },
  { id: '4', nome: '9º Ano C', alunos: 30, tendencia: 'up', organizacao: 95, materiais: 92, respeito: 90, limpeza: 98, equipe: 95, participacao: 90 },
  { id: '5', nome: '1º Médio', alunos: 40, tendencia: 'neutral', organizacao: 88, materiais: 89, respeito: 92, limpeza: 85, equipe: 85, participacao: 95 },
];

const dataWithGeral = salasData.map(sala => {
  const geral = (sala.organizacao + sala.materiais + sala.respeito + sala.limpeza + sala.equipe + sala.participacao) / 6;
  return { ...sala, geral: Math.round(geral) };
});

export type Categoria = 'geral' | 'organizacao' | 'materiais' | 'respeito' | 'limpeza' | 'equipe' | 'participacao';

export function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<Categoria>('geral');
  const sortedSalas = [...dataWithGeral].sort((a, b) => b[activeFilter] - a[activeFilter]);

  // Cálculos para os KPIs do Dashboard
  const totalSalas = sortedSalas.length;
  const mediaGeralEscola = Math.round(dataWithGeral.reduce((acc, curr) => acc + curr.geral, 0) / totalSalas);
  const salaLider = sortedSalas[0];

  return (
    <div className="dash-layout">
      {/* Cabeçalho Corporativo */}
      <header className="dash-header">
        <div className="header-brand">
          <img src={logoEscola} alt="Logo" className="header-logo" />
          <div className="header-titles">
            <h1>Gestão de Desempenho</h1>
            <p>Painel de Controle Escolar • Colégio Ana Boico</p>
          </div>
        </div>
      </header>

      <main className="dash-main">
        {/* Seção de KPIs (Visão Geral) */}
        <section className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Média Geral da Escola</span>
              <LuTarget className="kpi-icon" color="var(--color-primary)" />
            </div>
            <div className="kpi-value">{mediaGeralEscola}<span className="kpi-unit">/100</span></div>
            <p className="kpi-subtitle">Desempenho consolidado</p>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Sala Destaque (Atual)</span>
              <LuTrendingUp className="kpi-icon" color="var(--color-success)" />
            </div>
            <div className="kpi-value">{salaLider.nome}</div>
            <p className="kpi-subtitle">Liderando o ranking geral</p>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">Salas Monitoradas</span>
              <LuUsers className="kpi-icon" color="var(--color-accent)" />
            </div>
            <div className="kpi-value">{totalSalas}</div>
            <p className="kpi-subtitle">Turmas ativas no sistema</p>
          </div>
        </section>

        {/* Área de Filtros e Ranking */}
        <div className="ranking-container">
          <aside className="filter-sidebar">
            <h2 className="section-title">Métricas de Avaliação</h2>
            <p className="section-desc">Selecione um indicador para reordenar o ranking instantaneamente.</p>
            <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          </aside>

          <section className="ranking-content">
            <div className="ranking-list-header">
              <span className="col-rank">Rank</span>
              <span className="col-name">Turma</span>
              <span className="col-trend">Evolução</span>
              <span className="col-score">Pontuação ({activeFilter === 'geral' ? 'Geral' : activeFilter})</span>
            </div>
            
            <div className="ranking-list">
              {sortedSalas.map((sala, index) => (
                <RankingCard 
                  key={sala.id} 
                  sala={sala} 
                  posicao={index + 1} 
                  categoria={activeFilter} 
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}