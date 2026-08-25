import './FilterBar.css';
import type  { Categoria } from '../pages/Dashboard';
import { 
  TrophyIcon, 
  SparklesIcon, 
  LayersIcon, 
  BookOpenIcon, 
  HeartIcon, 
  UsersIcon, 
  StarIcon 
} from './Icons';

interface FilterBarProps {
  activeFilter: Categoria;
  onFilterChange: (filter: Categoria) => void;
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters: { id: Categoria; label: string; icon: React.ReactNode }[] = [
    { id: 'geral', label: 'Geral', icon: <TrophyIcon size={18} /> },
    { id: 'limpeza', label: 'Limpeza', icon: <SparklesIcon size={18} /> },
    { id: 'organizacao', label: 'Organização', icon: <LayersIcon size={18} /> },
    { id: 'materiais', label: 'Cuidado com Materiais', icon: <BookOpenIcon size={18} /> },
    { id: 'respeito', label: 'Respeito', icon: <HeartIcon size={18} /> },
    { id: 'equipe', label: 'Trabalho em Equipe', icon: <UsersIcon size={18} /> },
    { id: 'participacao', label: 'Participação', icon: <StarIcon size={18} /> },
  ];

  return (
    <div className="filter-container">
      {filters.map(filter => (
        <button
          key={filter.id}
          className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.icon}
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
}