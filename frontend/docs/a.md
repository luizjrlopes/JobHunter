job-hunter-crm/
├── docs/ # dados para consulta da ia de como deve ser a logica e o estilo
├── public/ # Ficheiros estáticos (ícones, imagens públicas)
│ └── vite.svg
├── src/
│ ├── @types/ # Definições de tipos globais (Interfaces para Vagas, Status, etc.)
│ │ └── jobs.ts
│ ├── assets/ # Recursos locais como imagens e vetores
│ ├── components/ # Componentes de interface reutilizáveis (UI Kit)
│ │ ├── Badge/
│ │ │ ├── index.tsx # Lógica e estrutura do componente
│ │ │ └── styles.ts # Estilos com Styled Components
│ │ ├── Button/
│ │ │ ├── index.tsx
│ │ │ └── styles.ts
│ │ ├── Card/
│ │ │ ├── index.tsx
│ │ │ └── styles.ts
│ │ ├── Modal/
│ │ │ ├── index.tsx
│ │ │ └── styles.ts
│ │ └── Table/
│ │ ├── index.tsx
│ │ └── styles.ts
│ ├── context/ # Context API para gestão de estado global
│ │ └── JobContext.tsx
│ ├── hooks/ # Custom Hooks (ex: useJobs para lógica de negócio)
│ │ └── useJobs.ts
│ ├── pages/ # Páginas principais da aplicação (Views)
│ │ └── Dashboard/
│ │ ├── index.tsx
│ │ └── styles.ts # Estilos específicos da página
│ ├── services/ # Integração com APIs ou serviços externos
│ │ └── api.ts
│ ├── styles/ # Configurações globais de design
│ │ ├── GlobalStyles.ts # Resets CSS e estilos globais
│ │ └── theme.ts # Definição de cores, fontes e espaçamentos (Theme Object)
│ ├── utils/ # Funções utilitárias e ajudantes
│ │ └── formatDate.ts
│ ├── App.tsx # Componente principal e rotas
│ └── main.tsx # Ponto de entrada da aplicação
├── .gitignore
├── package.json
├── tsconfig.json # Configuração do TypeScript
└── vite.config.ts # Configuração do Build Tool (Vite)
