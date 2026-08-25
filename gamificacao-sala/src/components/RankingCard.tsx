import './RankingCard.css';
import { MedalIcon } from './Icons';
import type { Categoria } from '../pages/Dashboard';

interface SalaProps {
  id: string;
  nome: string;
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
  let medalColor = '';
  if (posicao === 1) medalColor = 'var(--color-gold)';
  if (posicao === 2) medalColor = 'var(--color-silver)';
  if (posicao === 3) medalColor = 'var(--color-bronze)';

  const pontuacao = sala[categoria];

  return (
    <div className={`ranking-card ${posicao === 1 ? 'first-place' : ''}`}>
      <div className="rc-posicao">
        {isTop3 ? (
          <div className="rc-medal">
            <MedalIcon size={28} color={medalColor} />
            <span className="rc-medal-text">{posicao}º</span>
          </div>
        ) : (
          <span className="rc-posicao-normal">{posicao}º</span>
        )}
      </div>
      
      <div className="rc-info">
        <h3 className="rc-nome">{sala.nome}</h3>
        {posicao === 1 && <span className="rc-tag">Líder em {categoria}!</span>}
      </div>

      <div className="rc-pontuacao">
        <div className="rc-bar-bg">
          <div 
            className="rc-bar-fill"
            style={{ 
              width: `${pontuacao}%`,
              backgroundColor: posicao === 1 ? 'var(--color-secondary)' : 'var(--color-primary)' 
            }}
          />
        </div>
        <span className="rc-pontos-num">{pontuacao} pts</span>
      </div>
    </div>
  );
}