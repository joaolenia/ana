import { useState } from 'react';
import './Dashboard.css';
import { FilterBar } from '../components/FilterBar';
import { RankingCard } from '../components/RankingCard';
import logoEscola from '../assets/image.png';
import { LuTarget, LuTrophy, LuUsers } from 'react-icons/lu';

// Dados base que você já possui (sem invenções)
const salasData = [
  { id: '1', nome: '6º Ano A', organizacao: 85, materiais: 90, respeito: 95, limpeza: 80, equipe: 88, participacao: 92 },
  { id: '2', nome: '7º Ano B', organizacao: 92, materiais: 85, respeito: 88, limpeza: 95, equipe: 90, participacao: 85 },
  { id: '3', nome: '8º Ano A', organizacao: 78, materiais: 80, respeito: 85, limpeza: 75, equipe: 82, participacao: 88 },
  { id: '4', nome: '9º Ano C', organizacao: 95, materiais: 92, respeito: 90, limpeza: 98, equipe: 95, participacao: 90 },
  { id: '5', nome: '1º Médio', organizacao: 88, materiais: 89, respeito: 92, limpeza: 85, equipe: 85, participacao: 95 },
];

const dataWithGeral = salasData.map(sala => {
  const geral = (sala.organizacao + sala.materiais + sala.respeito + sala.limpeza + sala.equipe + sala.participacao) / 6;
  return { ...sala, geral: Math.round(geral) };
});

export type Categoria = 'geral' | 'organizacao' | 'materiais' | 'respeito' | 'limpeza' | 'equipe' | 'participacao';

export function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<Categoria>('geral');
  
  // Ordenação principal
  const sortedSalas = [...dataWithGeral].sort((a, b) => b[activeFilter] - a[activeFilter]);

  // Cálculos Reais para os KPIs
  const totalSalas = sortedSalas.length;
  const mediaGeralEscola = Math.round(dataWithGeral.reduce((acc, curr) => acc + curr.geral, 0) / totalSalas);
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
        {/* Seção 1: Visão Geral (KPIs) */}
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
              <div className="kpi-value">{salaLider.nome}</div>
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

        {/* Seção 2: Filtros */}
        <section className="filter-section">
          <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </section>

        {/* Seção 3: Grid de Cards do Ranking */}
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
      </main>
    </div>
  );
}