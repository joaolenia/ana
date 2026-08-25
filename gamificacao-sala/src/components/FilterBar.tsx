import './FilterBar.css';
import type { Categoria } from '../pages/Dashboard';
import { LuTrophy, LuSparkles, LuLayers, LuBookOpen, LuHeart, LuUsers, LuStar } from 'react-icons/lu';

interface FilterBarProps {
  activeFilter: Categoria;
  onFilterChange: (filter: Categoria) => void;
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters = [
    { id: 'geral', label: 'Pontuação Geral', Icon: LuTrophy },
    { id: 'organizacao', label: 'Organização', Icon: LuLayers },
    { id: 'materiais', label: 'Cuidados / Materiais', Icon: LuBookOpen },
    { id: 'respeito', label: 'Respeito', Icon: LuHeart },
    { id: 'limpeza', label: 'Limpeza', Icon: LuSparkles },
    { id: 'equipe', label: 'Trabalho em Equipe', Icon: LuUsers },
    { id: 'participacao', label: 'Participação', Icon: LuStar },
  ] as const;

  return (
    <nav className="filter-nav">
      {filters.map(filter => {
        const IconComponent = filter.Icon; 
        const isActive = activeFilter === filter.id;
        
        return (
          <button
            key={filter.id}
            className={`filter-item ${isActive ? 'active' : ''} ${filter.id === 'geral' ? 'highlight-filter' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            <IconComponent size={18} className="filter-icon" />
            <span className="filter-label">{filter.label}</span>
          </button>
        );
      })}
    </nav>
  );
}