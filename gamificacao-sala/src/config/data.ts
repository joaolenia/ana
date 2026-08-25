import { LuLayers, LuBookOpen, LuHeart, LuSparkles, LuUsers, LuStar } from 'react-icons/lu';

export interface Turma {
  id: string;
  nome: string;
}

export const TURMAS: Turma[] = [
  { id: '1', nome: '6º Ano A' },
  { id: '2', nome: '7º Ano B' },
  { id: '3', nome: '8º Ano A' },
  { id: '4', nome: '9º Ano C' },
  { id: '5', nome: '1º Médio' },
];

export const REQUISITOS = [
  { id: 'organizacao', label: 'Organização', desc: 'Ambiente organizado e limpo', Icon: LuLayers },
  { id: 'materiais', label: 'Materiais', desc: 'Cuidado com os materiais', Icon: LuBookOpen },
  { id: 'respeito', label: 'Respeito', desc: 'Respeito aos colegas e professor', Icon: LuHeart },
  { id: 'limpeza', label: 'Limpeza', desc: 'Manutenção da limpeza da sala', Icon: LuSparkles },
  { id: 'equipe', label: 'Equipe', desc: 'Trabalho e colaboração em grupo', Icon: LuUsers },
  { id: 'participacao', label: 'Participação', desc: 'Engajamento nas atividades', Icon: LuStar },
] as const;

export type RequisitoId = typeof REQUISITOS[number]['id'];