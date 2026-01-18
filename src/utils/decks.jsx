import {
  Building2, Search, Target, Cpu, DollarSign,
  BarChart3, ShieldAlert
} from 'lucide-react';

export const DECKS = [
  {
    id: 'identificacao',
    nome: '1. Identificação',
    sections: [1],
    icon: <Building2 />,
    desc: 'Dados Institucionais e Identificação',
    color: 'text-blue-600',
    deckInfo: 'Informações básicas de identificação do projeto/programa'
  },
  {
    id: 'diagnostico',
    nome: '2-3. Diagnóstico & Fund.',
    sections: [2, 3],
    icon: <Search />,
    desc: 'Contexto e Base Legal',
    color: 'text-indigo-600',
    deckInfo: 'Análise do problema e fundamentação legal/teórica'
  },
  {
    id: 'estrategia',
    nome: '4-6. Estratégia',
    sections: [4, 5, 6],
    icon: <Target />,
    desc: 'Objetivos, Público e Abrangência',
    color: 'text-purple-600',
    deckInfo: 'Definição de metas, beneficiários e alcance geográfico'
  },
  {
    id: 'execucao',
    nome: '7-9. Execução',
    sections: [7, 8, 9],
    icon: <Cpu />,
    desc: 'Metodologia e Cronograma',
    color: 'text-emerald-600',
    deckInfo: 'Plano operacional e distribuição temporal das atividades'
  },
  {
    id: 'recursos',
    nome: '10. Recursos',
    sections: [10],
    icon: <DollarSign />,
    desc: 'Humanos, Materiais e Financeiros',
    color: 'text-yellow-600',
    deckInfo: 'Necessidades de recursos para execução do projeto'
  },
  {
    id: 'monitoramento',
    nome: '11-12. Monitoramento',
    sections: [11, 12],
    icon: <BarChart3 />,
    desc: 'Resultados e Indicadores',
    color: 'text-rose-600',
    deckInfo: 'Acompanhamento, avaliação e medição de resultados'
  },
  {
    id: 'sustentabilidade',
    nome: '13-15. Sust. & Riscos',
    sections: [13, 14, 15],
    icon: <ShieldAlert />,
    desc: 'Continuidade, Riscos e Referências',
    color: 'text-orange-600',
    deckInfo: 'Plano de sustentabilidade, análise de riscos e bibliografia'
  }
];