import './FilterBar.css';
import type { Categoria } from '../pages/Dashboard';
import { Trophy, Layers, BookOpen, Heart, Sparkles, Users, Star } from 'lucide-react';

interface FilterBarProps {
  activeFilter: Categoria;
  onFilterChange: (filter: Categoria) => void;
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters: { id: Categoria; label: string; icon: React.ReactNode }[] = [
    { id: 'geral', label: 'Geral', icon: <Trophy size={18} /> },
    { id: 'limpeza', label: 'Limpeza', icon: <Sparkles size={18} /> },
    { id: 'organizacao', label: 'Organização', icon: <Layers size={18} /> },
    { id: 'materiais', label: 'Cuidado com Materiais', icon: <BookOpen size={18} /> },
    { id: 'respeito', label: 'Respeito', icon: <Heart size={18} /> },
    { id: 'equipe', label: 'Trabalho em Equipe', icon: <Users size={18} /> },
    { id: 'participacao', label: 'Participação', icon: <Star size={18} /> },
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