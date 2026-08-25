import './RankingCard.css';
import type { Categoria } from '../pages/Dashboard';

interface RankingCardProps {
  sala: any;
  posicao: number;
  categoria: Categoria;
}

export function RankingCard({ sala, posicao, categoria }: RankingCardProps) {
  const pontuacao = sala[categoria];
  
  // Define a classe CSS específica para o pódio
  let podiumClass = 'card-standard';
  let badgeLabel = `${posicao}º Lugar`;
  
  if (posicao === 1) { podiumClass = 'card-gold'; badgeLabel = '🏆 1º Lugar'; }
  else if (posicao === 2) { podiumClass = 'card-silver'; badgeLabel = '🥈 2º Lugar'; }
  else if (posicao === 3) { podiumClass = 'card-bronze'; badgeLabel = '🥉 3º Lugar'; }

  return (
    <div className={`rank-card ${podiumClass}`}>
      <div className="card-top">
        <div className="card-badge">{badgeLabel}</div>
        <div className="card-score">
          <strong>{pontuacao}</strong> <span>pts</span>
        </div>
      </div>

      <div className="card-middle">
        <h3>{sala.nome}</h3>
        <p>Pontuação em {categoria}</p>
      </div>

      <div className="card-bottom">
        <div className="progress-bg">
          <div 
            className="progress-fill" 
            style={{ width: `${pontuacao}%` }} 
          />
        </div>
      </div>
    </div>
  );
}