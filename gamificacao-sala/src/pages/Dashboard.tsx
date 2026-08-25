
import { useState } from 'react';
import './Dashboard.css';
import { FilterBar } from '../components/FilterBar';
import { RankingCard } from '../components/RankingCard';
import logoEscola from '../assets/image.png';

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
  const sortedSalas = [...dataWithGeral].sort((a, b) => b[activeFilter] - a[activeFilter]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src={logoEscola} alt="Logo Colégio Ana Boico" className="dashboard-logo" />
        <div className="dashboard-title">
          <h1>Gameficação Escolar</h1>
          <p>Acompanhamento de Metas e Atributos das Salas</p>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-filters">
          <h2>Insights e Filtros</h2>
          <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </section>

        <section className="dashboard-ranking">
          <div className="ranking-header">
            <span className="col-posicao">Posição</span>
            <span className="col-sala">Sala de Aula</span>
            <span className="col-pontos">Pontuação ({activeFilter.toUpperCase()})</span>
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
      </main>
    </div>
  );
}