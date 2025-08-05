# Viagium Frontend

Frontend do Viagium, plataforma para pacotes de viagem, reservas, avaliações, gestão de afiliados e hotéis. Desenvolvido com **React**, **TypeScript** e **Vite**, focado em escalabilidade, experiência do usuário e integração com APIs REST.

---

## 🏗️ Arquitetura

- **React + TypeScript**: Componentes funcionais, tipagem forte.
- **Vite**: Build e desenvolvimento rápido.
- **TailwindCSS**: Estilização utilitária e responsiva.
- **React Router DOM**: SPA com rotas dinâmicas.
- **Axios**: Requisições HTTP.
- **Styled Components & MUI**: Componentes de UI e estilização dinâmica.
- **Keen Slider**: Carrossel responsivo.
- **Recharts**: Gráficos para dashboards.
- **React Icons**: Ícones SVG.

---

## 📁 Estrutura de Pastas

```
src/
├── assets/              # Imagens e SVGs
│   └── img/
├── components/          # Componentes reutilizáveis (Button, Footer, Navbar, etc)
├── hooks/               # Hooks customizados (ex: useReservations)
├── mocks/               # Dados mockados para testes/desenvolvimento
├── pages/               # Páginas principais (Package, RoomType, Review, Registration, etc)
│   ├── affiliatedashboard/
│   ├── affiliatepage/
│   ├── admindashboard/
│   ├── package/
│   ├── registration/
│   ├── reservation/
│   ├── review/
│   └── roomtype/
├── types/               # Tipos e interfaces TypeScript
├── utils/               # Funções utilitárias (validações, máscaras, helpers, autenticação, API)
│   ├── apiClient.ts     
│   ├── auth.ts          
│   ├── cepApi.ts        
│   ├── masks.ts         
│   └── validations.ts   
├── App.tsx              # Componente raiz
├── main.tsx             # Ponto de entrada
├── index.css            # Estilos globais e Tailwind
├── App.css              # Estilos específicos do App
└── vite-env.d.ts        # Tipos do Vite
```

---

## 🛠️ Principais Bibliotecas

- **React** `^19.1.0`
- **React DOM** `^19.1.0`
- **React Router DOM** `^7.7.0`
- **Axios** `^1.11.0`
- **TailwindCSS** `^4.1.11`
- **Keen Slider** `^6.8.6`
- **React Icons** `^5.5.0`
- **@mui/material** `^7.2.0`
- **Styled Components** `^6.1.19`
- **Recharts** `^3.1.0`
- **Serve** `^14.2.0`

---

## ⚙️ Utils

### [`apiClient.ts`](src/utils/apiClient.ts)
- Cliente Axios configurado para consumir a API do backend.
- Intercepta requisições para adicionar automaticamente o token JWT do usuário ou afiliado.
- Intercepta respostas 401 para realizar logout e redirecionar para a tela de login adequada.

### [`auth.ts`](src/utils/auth.ts)
- Gerencia autenticação JWT para usuários e afiliados.
- Métodos para salvar, recuperar e limpar tokens no localStorage.
- Função de logout global que limpa todos os dados de autenticação.

### [`cepApi.ts`](src/utils/cepApi.ts)
- Busca dados de endereço pelo CEP usando a [AwesomeAPI](https://cep.awesomeapi.com.br/).
- Retorna informações completas de endereço, cidade, estado, latitude/longitude e DDD.

### [`validations.ts`](src/utils/validations.ts)
- **Validação de CPF e CNPJ**: Com dígito verificador.
- **Validação de passaporte, e-mail, senha forte, telefone, CEP, Cadastur, datas futuras, aceite dos termos, chegada após partida**.
- **Confirmação de e-mail e senha**: Garante que os campos coincidem.
- **Validação de campos obrigatórios**: Verifica preenchimento.

### [`masks.ts`](src/utils/masks.ts)
- **Máscaras para CPF, CNPJ, telefone, passaporte, CEP, Inscrição Estadual, Cadastur, moeda (BRL), cartão de crédito, datas de validade**.
- Funções para aplicar e remover máscaras, garantindo formatação correta dos dados para exibição e envio à API.

---

## 🧩 Componentes Reutilizáveis

- **Button, Input, Badge, LoadingModal, TravelPackageCard, HotelCarousel, Footer, Navbar**
- **ModalHotel**: Modal dinâmico para cadastro/edição de hotéis.
- **StarRating**: Avaliação interativa.
- **BaseModal**: Modal base para dashboards.

---

## 📝 Páginas Principais

- **Pacotes de Viagem**: Visualização, filtro, detalhes, avaliações.
- **Cadastro de Tipos de Quarto**: Upload de imagens, diferenciais, geração automática/manual de números de quartos.
- **Reserva**: Resumo, passageiros, valores.
- **Avaliação**: Envio e exibição de reviews.
- **Dashboard Admin/Afiliado**: Gestão de pacotes, usuários, hotéis.

---

## 🚀 Scripts

- `npm run dev` — Ambiente de desenvolvimento
- `npm run build` — Build de produção
- `npm run lint` — ESLint
- `npm run preview` — Preview do build
- `npm start` — Build + serve produção

---

## 📚 Convenções & Boas Práticas

- **Componentização**: Cada página/funcionalidade em componentes.
- **Tipagem**: Interfaces e tipos para segurança.
- **Estilização**: Tailwind, styled-components e MUI.
- **Validação**: Frontend robusto antes do envio ao backend.
- **Acessibilidade**: aria-labels, navegação por teclado.

---

## 🖼️ Imagens & Assets

- Imagens em `src/assets/img/`
- SVGs/logos em `src/assets/`

---

## 📝 Observações

- Integração desenvolvida para APIs REST.
- Estrutura expansível para novas páginas/componentes.
- Suporte a animações, modais, carrosséis e feedback visual.

---

**Contribua, reporte bugs e sugestões via Issues no GitHub!**
