# Vendrâmico - Soluções de IA Personalizadas

## Descrição do Projeto

O site da **Vendrâmico** é uma plataforma web moderna e responsiva desenvolvida para apresentar os serviços de personalização de modelos de Inteligência Artificial. A empresa se especializa em pegar modelos de IA existentes e adaptá-los para necessidades específicas de clientes, oferecendo soluções inteligentes para automação, vendas e atendimento ao cliente.

Este projeto foi desenvolvido seguindo as melhores práticas de desenvolvimento web, com foco em performance, acessibilidade e experiência do usuário.

## Funcionalidades Principais

*   **Página Inicial (Home):** Apresenta a empresa, seus diferenciais e um resumo das soluções oferecidas.
*   **Soluções de IA:** Detalhes sobre as diferentes IAs personalizadas (Atendimento ao Cliente, Vendas e Marketing, Assistente Virtual Especializado, Análise de Dados).
*   **Como Funciona:** Explica o processo de desenvolvimento e implementação das soluções de IA.
*   **Benefícios:** Destaca as vantagens de escolher a Vendrâmico, como disponibilidade 24/7, redução de custos e personalização avançada.
*   **Formulário de Contato:** Permite que os usuários entrem em contato com a empresa para solicitar informações ou orçamentos.
*   **Navegação Responsiva:** Adapta-se a diferentes tamanhos de tela (desktops, tablets e smartphones).
*   **Animações e Interatividade:** Elementos visuais dinâmicos para melhorar a experiência do usuário.
*   **Persistência de Dados (LocalStorage):** O formulário de contato utiliza o `localStorage` do navegador para salvar rascunhos de dados, garantindo que o usuário não perca o que digitou em caso de navegação ou recarregamento da página.




## Tecnologias Utilizadas

### Frontend

*   **HTML5:** Utilizado para a estruturação semântica do conteúdo da página.
*   **CSS3:** Responsável pela estilização e layout responsivo, empregando Flexbox, Grid e Custom Properties para um design moderno e adaptável.
*   **JavaScript ES6+ (Vanilla JS):** Implementa a interatividade e funcionalidades dinâmicas do site, incluindo manipulação do DOM, validação de formulários e animações.

### Persistência de Dados

*   **LocalStorage:** Utilizado para armazenar temporariamente os dados do formulário de contato no navegador do usuário, permitindo a recuperação de rascunhos em caso de interrupção.

### Ferramentas e Metodologias

*   **Vite:** Ferramenta de build para desenvolvimento frontend, embora o projeto final seja servido como arquivos estáticos.
*   **Metodologia BEM (Block, Element, Modifier):** Adotada para a organização e nomenclatura de classes CSS, promovendo a modularidade e reusabilidade do código.
*   **Intersection Observer API:** Utilizada para otimizar o carregamento de animações baseadas na visibilidade dos elementos na tela.




## Como Configurar e Rodar a Aplicação

Para configurar e rodar este projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/ArtzAlves/projetoFinal.git
    ```
2.  **Navegue até o diretório do projeto:**
    ```bash
    cd projetoFinal
    ```
3.  **Abra o arquivo `index.html` no seu navegador:**
    Você pode simplesmente clicar duas vezes no arquivo `index.html` ou arrastá-lo para a janela do seu navegador. Alternativamente, você pode usar uma extensão de servidor local (como o `Live Server` para VS Code) para servir os arquivos.

    *Exemplo usando `Live Server` (extensão VS Code):*
    Instale a extensão e clique com o botão direito no `index.html`, selecionando "Open with Live Server".

    *Exemplo usando Python (para servir arquivos estáticos):*
    ```bash
    python -m http.server 8000
    ```
    Após executar o comando acima, abra seu navegador e acesse `http://localhost:8000`.

## Estrutura do Projeto

```
projetoFinal/
├── index.html              # Página principal do site
├── analise-dados.html      # Página de detalhes para IA de Análise de Dados
├── assistente-virtual.html # Página de detalhes para Assistente Virtual
├── central-ajuda.html      # Página da Central de Ajuda
├── ia-atendimento.html     # Página de detalhes para IA de Atendimento
├── ia-vendas.html          # Página de detalhes para IA de Vendas
├── politica-privacidade.html # Página de Política de Privacidade
├── termos-uso.html         # Página de Termos de Uso
├── css/
│   └── styles.css          # Estilos CSS principais
├── images/
│   ├── ai-brain-icon.jpg   # Ícone de cérebro IA
│   ├── ai-icons-set.jpg    # Conjunto de ícones de IA
│   ├── digital-transformation-icon.png # Ícone de transformação digital
│   ├── favicon.png         # Favicon do site
│   ├── placeholder.txt     # Arquivo placeholder
│   ├── startup-icon.png    # Ícone de startup
│   └── vendramico-logo.png # Logo da empresa Vendrâmico
├── js/
│   └── script.js           # Lógica JavaScript principal
├── README.md               # Este arquivo de documentação
├── package.json            # Arquivo de configuração do Node.js (para Vite)
├── package-lock.json       # Bloqueio de dependências do Node.js
└── vite.config.js          # Configuração do Vite
```


