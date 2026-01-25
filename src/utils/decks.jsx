import React from 'react';
import {
  Building2, Search, Target, Cpu, 
  ClipboardList, BarChart3
} from 'lucide-react';

export const DECKS = [
  {
    id: 'identificacao',
    nome: 'Identificação',
    icon: <Building2 />,
    desc: 'Dados Institucionais',
    color: 'text-blue-600',
    deckInfo: 'Informações básicas de identificação do projeto/programa e unidade executora.'
  },
  {
    id: 'diagnostico',
    nome: 'Diagnóstico & Fund.',
    icon: <Search />,
    desc: 'Contexto e Base Legal',
    color: 'text-indigo-600',
    deckInfo: 'Caracterização do contexto, problema, evidências, justificativa e fundamentação legal.'
  },
  {
    id: 'estrategia',
    nome: 'Objetivos e Público',
    icon: <Target />,
    desc: 'Estratégia e Abrangência',
    color: 'text-purple-600',
    deckInfo: 'Objetivos gerais e específicos, beneficiários, perfil do público e localização.'
  },
  {
    id: 'recursos',
    nome: 'Recursos',
    icon: <ClipboardList />,
    desc: 'Humanos e Materiais',
    color: 'text-yellow-600',
    deckInfo: 'Detalhamento dos recursos humanos, materiais e financeiros necessários.'
  },
  {
    id: 'metas',
    nome: 'Metas e Execução',
    icon: <Cpu />,
    desc: 'Física e Financeira',
    color: 'text-emerald-600',
    deckInfo: 'Definição da meta física e cronograma de execução física e financeira.'
  },
  {
    id: 'sustentabilidade',
    nome: 'Sustentabilidade',
    icon: <BarChart3 />,
    desc: 'Riscos e Mitigação',
    color: 'text-rose-600',
    deckInfo: 'Plano de sustentabilidade pós-projeto e análise de riscos.'
  }
];