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
    { id: 'materiais', label: 'Materiais', Icon: LuBookOpen },
    { id: 'respeito', label: 'Respeito', Icon: LuHeart },
    { id: 'limpeza', label: 'Limpeza', Icon: LuSparkles },
    { id: 'equipe', label: 'Equipe', Icon: LuUsers },
    { id: 'participacao', label: 'Participação', Icon: LuStar },
  ] as const;

  return (
    <div className="filter-wrapper">
      {filters.map(filter => {
        const IconComponent = filter.Icon;
        return (
          <button
            key={filter.id}
            className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            <IconComponent size={16} />
            <span>{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}