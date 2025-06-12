
# SmartLocker Front-end Web

<div align="center">
  <img src="https://github.com/Fredericobarbosa/smartlocker_frontend_web/blob/main/src/assets/logo.png" alt="logo"  width="45%">
</div> 

>Front-end web para o sistema SmartLocker, desenvolvido em React, para visualização de estatísticas e gestão de retiradas de notebooks via Iot.

## 📱 Tecnologias e Linguagem

- **JavaScript (React)**

## 📦 Principais bibliotecas utilizadas
- **React**: Biblioteca principal para construção da interface de usuário.

- **react-router-dom**: Utilizada para navegação entre páginas (login, cadastro, dashboard) de forma SPA (Single Page Application).

- **axios**: Responsável pelas requisições HTTP para a API, incluindo autenticação e interceptação de erros.

- **react-icons**: Fornece ícones vetoriais (ex: ícones de usuário, cadeado, olho) para melhorar a experiência visual dos formulários.

- **victory**: Biblioteca de gráficos utilizada para exibir estatísticas e visualizações no dashboard, como gráficos de barras, linhas, área e pizza.

- **chart.js** e **react-chartjs-2**: Disponíveis para gráficos, mas atualmente os gráficos principais do dashboard utilizam a biblioteca Victory.


## 🚀 Como iniciar o projeto

1. **Pré-requisitos:**  
   - Node.js (recomendado: versão 18 ou superior)
   - Yarn ou npm

2. **Instale as dependências:**
   ```bash
   yarn install
   # ou
   npm install
   ```

3. **Configure o ambiente:**  
   O arquivo `.env` já está configurado com o link da API:
   ```
   REACT_APP_API_URL=http://20.57.55.218:5000/smartlocker/api/v1
   ```

4. **Inicie o projeto:**
   ```bash
   yarn start
   # ou
   npm start
   ```
   O app estará disponível em [http://localhost:3000](http://localhost:3000).

🌐 Link da API Backend
A aplicação consome dados da seguinte API:
   ```
   http://20.57.55.218:5000/smartlocker/api/v1
```
## 📁 Estrutura de pastas

- `src/pages/` — Telas principais (login, cadastro, dashboard)
- `src/services/api.js` — Configuração do Axios para comunicação com a API
- `src/routes.js` — Rotas da aplicação
- `src/assets/` — Imagens e logos

## 📝 Observações<br>
- O projeto utiliza variáveis de ambiente para definir a URL da API.<br>
- O login utiliza JWT armazenado no localStorage.<br>
- O dashboard exibe dados estatísticos e gráficos baseados nas informações retornadas pela API.
