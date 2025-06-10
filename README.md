# SmartLocker Front-end Mobile

<div align="center">
  <img src="https://github.com/Fredericobarbosa/smartlocker_frontend_mobile/blob/main/assets/logo.png" alt="logo"  width="45%">
</div> 

> Aplicativo mobile para visualização de estatísticas e gestão de retiradas de notebooks via Iot.

## 📱 Tecnologias e Linguagem

- **Linguagem:** JavaScript (React Native)
- **Framework:** Expo

## 📦 Principais bibliotecas utilizadas

- **react-native**: Base para desenvolvimento mobile multiplataforma.
- **expo**: Framework para facilitar o desenvolvimento, build e testes do app(Emulação).
- **@react-navigation/native**: Navegação entre telas.
- **@react-navigation/stack**: Navegação do tipo stack (pilha de telas) usado para determinar as rotas.
- **axios**: Requisições HTTP para comunicação com a API.
- **react-native-chart-kit**: Exibição de gráficos (barras, linhas, pizza) nas telas.
- **@react-native-async-storage/async-storage**: Armazenamento local de dados (ex: token do usuário).
- **styled-components**: Estilização de componentes usando CSS-in-JS.
- **react-native-svg**: Suporte a gráficos SVG (dependência de bibliotecas de gráficos).
- **@expo/vector-icons**: Ícones prontos para uso no app.
- **react-native-gesture-handler, react-native-reanimated, react-native-screens, react-native-safe-area-context**: Suporte a gestos, animações e navegação fluida.
- **react-native-responsive-screen**: Responsividade para diferentes tamanhos de tela.

## 🚀 Como iniciar o projeto

1. **Pré-requisitos:**
   - Node.js instalado
   - Expo CLI instalado globalmente (`npm install -g expo-cli`)

2. **Instale as dependências:**
   ```
   npm install


3. **Inicie o projeto:**
   ```
   npm start 
   ou 
   npx expo start
Ou, para rodar diretamente no Android:
   ```
   npm run android
```
Para Para iOS (Mac):
   ```
   npm run ios
```
Para web:
   ```
    npm run web
```

4. **Abra o app no seu dispositivo:**
   - Use o aplicativo Expo Go para escanear o QR code exibido no terminal ou navegador.

🌐 Link da API Backend
A aplicação consome dados da seguinte API:
   ```
   http://20.57.55.218:5000/smartlocker/api/v1
```

📁 Estrutura básica
   ```
    App.js
    src/
    pages/
        login.js
        cadastro.js
        dashboard.js
    services/
        api.js
    routes.js
```

📝 Observações<br>
    - Certifique-se de estar na mesma rede do backend para acessar a API.<br>
    - O projeto utiliza Expo, facilitando o desenvolvimento e testes em dispositivos reais.
