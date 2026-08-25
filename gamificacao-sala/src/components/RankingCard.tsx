import './RankingCard.css';
import { motion } from 'framer-motion';
import { Medal } from 'lucide-react';
import type { Categoria } from '../pages/Dashboard';

interface RankingCardProps {
  sala: any;
  posicao: number;
  categoria: Categoria;
}

export function RankingCard({ sala, posicao, categoria }: RankingCardProps) {
  const isTop3 = posicao <= 3;
  let medalColor = '';
  if (posicao === 1) medalColor = 'var(--color-gold)';
  if (posicao === 2) medalColor = 'var(--color-silver)';
  if (posicao === 3) medalColor = 'var(--color-bronze)';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`ranking-card ${posicao === 1 ? 'first-place' : ''}`}
    >
      <div className="rc-posicao">
        {isTop3 ? (
          <div className="rc-medal">
            <Medal size={28} color={medalColor} fill={medalColor} />
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
          <motion.div 
            className="rc-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${sala[categoria]}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ 
              backgroundColor: posicao === 1 ? 'var(--color-secondary)' : 'var(--color-primary)' 
            }}
          />
        </div>
        <span className="rc-pontos-num">{sala[categoria]} pts</span>
      </div>
    </motion.div>
  );
}