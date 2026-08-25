import './RankingCard.css';
import { LuMedal, LuTrendingUp, LuTrendingDown, LuMinus } from 'react-icons/lu';
import type { Categoria } from '../pages/Dashboard';

interface SalaProps {
  id: string;
  nome: string;
  alunos?: number;
  tendencia?: string;
  organizacao: number;
  materiais: number;
  respeito: number;
  limpeza: number;
  equipe: number;
  participacao: number;
  geral: number;
}

interface RankingCardProps {
  sala: SalaProps;
  posicao: number;
  categoria: Categoria;
}

export function RankingCard({ sala, posicao, categoria }: RankingCardProps) {
  const isTop3 = posicao <= 3;
  let podiumClass = '';
  
  if (posicao === 1) podiumClass = 'rank-gold';
  else if (posicao === 2) podiumClass = 'rank-silver';
  else if (posicao === 3) podiumClass = 'rank-bronze';

  const pontuacao = sala[categoria];

  // Renderiza o indicador de tendência
  const renderTrend = () => {
    switch(sala.tendencia) {
      case 'up': return <div className="trend-badge trend-up"><LuTrendingUp size={14}/> subiu</div>;
      case 'down': return <div className="trend-badge trend-down"><LuTrendingDown size={14}/> caiu</div>;
      default: return <div className="trend-badge trend-neutral"><LuMinus size={14}/> manteve</div>;
    }
  };

  return (
    <div className={`ranking-row ${podiumClass}`}>
      {/* Posição */}
      <div className="row-col col-pos">
        {isTop3 ? (
          <div className="pos-badge">
            <LuMedal size={22} className="medal-icon" />
            <span>{posicao}º</span>
          </div>
        ) : (
          <span className="pos-text">{posicao}º</span>
        )}
      </div>
      
      {/* Informações da Sala */}
      <div className="row-col col-info">
        <h3 className="sala-nome">{sala.nome}</h3>
        {sala.alunos && <span className="sala-meta">{sala.alunos} alunos</span>}
      </div>

      {/* Tendência */}
      <div className="row-col col-trend">
        {renderTrend()}
      </div>

      {/* Pontuação e Barra */}
      <div className="row-col col-score-bar">
        <div className="score-wrapper">
          <div className="score-bar-bg">
            <div 
              className="score-bar-fill"
              style={{ 
                width: `${pontuacao}%`,
                backgroundColor: posicao === 1 ? 'var(--color-secondary)' : 'var(--color-primary)' 
              }}
            />
          </div>
          <span className="score-value">{pontuacao}</span>
        </div>
      </div>
    </div>
  );
}