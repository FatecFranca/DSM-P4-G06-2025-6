# Sistema backend - SMARTLOCKER API 1.0 💻🔐

Smartlocker é um sistema backend do Projeto Interdisciplinar da FATEC FRANCA (4 SEMESTRE) para gerenciamento de notebooks em armários de salas de aula para a diretoria de ensino, onde é possível receber requisições de leituras de tags NFC por um dispositivo IOT posicionado em um armário, registrar as movimentações de notebooks e devolver um relatório completo com calculos estatísticos para os gestores.  
Construído com NestJS, Node.js, Express e TypeScript, seguindo boas práticas de arquitetura e organização de código.

## ⚙️ Funcionalidades

### Funcionalidades Principais

- **Captura e Registro de Leituras NFC:** A API recebe as leituras das tags NFC capturadas pelo dispositivo IoT e armazena os registros brutos na tabela `nfc_capture` com timestamp.
- **Processamento das Movimentações:** A partir das leituras NFC, a API consulta as informações pré-cadastradas no banco de dados de notebooks, armários, salas, cursos e horários para montar e registrar as movimentações na tabela `movements`, contendo dados completos de checkout e devolução.
- **Consulta de Dados Estatísticos:** A API disponibiliza dados e cálculos estatísticos (média, mediana, moda, desvio padrão, regressão, etc.) com base nas movimentações registradas, para uso em dashboards gerenciais.
- **Integração com Banco de Dados Pré-configurado:** Os cadastros de notebooks, armários, salas, cursos e horários são realizados previamente pela equipe organizadora, e a API utiliza esses dados para validar e estruturar as movimentações.
- **Cadastro e Autenticação de Usuários:** Gerenciamento de usuários com autenticação para acesso aos dados do dashboard.

### Funcionalidades Técnicas

- Manipulação de banco de dados com PrismaORM e MySQL
- Autenticação de usuários com JWT e proteção de rotas
- Proteção de dados sensíveis com bcrypt
- Validação e transformação de dados com DTOs (utilizando class-validator e class-transformer)
- Tratamento abrangente de erros centralizado no NestJS
- Documentação interativa da API com Swagger
- Estrutura modular

## 🧪 Stack Tecnológica

- **Framework**: NestJS
- **Linguagem**: TypeScript
- **Banco de Dados**: MySQL com Prisma

## ⚠️ Pré-requisitos

- Node.js (v18.18.1 ou superior)
- MySQL 8.0 (Server and Workbench)

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd smartlocker-backend-api
```

2. Instale as dependências:

```bash
npm install
```

3. Configuração do Banco de Dados: Certifique-se de que você tenha um schema de banco criado antecipadamente, e note que o nome do schema que você criar no banco de dados deve ser o mesmo a ser utilizado no DATABASE_URL.  
   Crie o arquivo .env na RAIZ do projeto com suas credenciais de banco de dados seguindo o seguinte formato:

```bash
DATABASE_URL="mysql://root:sua_senha_do_mysql@localhost:3306/api_smartlocker"

JWT_SECRET_KEY="key_jwt"
EXPIRES_IN="1d"
```

4. Execute esta migração no prisma para criar as tabelas (Este comando irá criar sua primeira migration dentro da pasta migrations que estará dentro da pasta prisma):

```bash

npx prisma migrate dev --name init

```

5. Após realizar todos os passos anteriores inicie a aplicação:

```bash
npm run start:dev
```

## 📚 Documentação da API

Para acessar a documentação interativa da SmartlockerAPI via SwaggerUI clique [aqui](https://smartlocker-api-swagger.vercel.app/#/)

### Endpoints Principais (Obs: Após o url prefix da API)

#### AUTH

- `POST /auth/register` - Registrar uma conta
- `POST /auth/login` - Realizar login de uma conta

#### NFC-CAPTURE

- `POST /nfc-capture` - Registrar a captura de uma tag NFC (vinda do IoT)

#### METRICS (DASHBOARD)

- `GET /dashboard` - Consultar aluno detalhadamente

## 📐 Arquitetura

### Esquema do Banco de Dados

#### Tabela users

- id (int)
- name (string)
- email (string, único)
- password (string)
- createdAt (datetime)

#### Tabela rooms

- id (int)
- name (string)
- location (string)

#### Tabela cabinets

- id (int)
- name (string)
- room_id (int, Foreign Key para rooms.id)

#### Tabela notebooks

- id (int)
- nfc_tag (string)
- device_name (string)
- serial_number (string)
- cabinet_id (int, Foreign Key para cabinets.id)

#### Tabela courses

- id (int)
- short_name (string)
- course_name (string)
- period (enum: Matutino, Noturno)

#### Tabela schedules

- id (int)
- course_id (int, Foreign Key para courses.id)
- room_id (int, Foreign Key para rooms.id)
- day_of_week (string)
- discipline (string)
- start_time (time)
- end_time (time)

#### Tabela nfc_capture

- id (int)
- nfc_tag (string)
- datetime (datetime)

#### Tabela movements

- id (int)
- notebook_id (int, Foreign Key para notebooks.id)
- checkout_datetime (datetime)
- return_datetime (datetime, nullable)
- schedule_id (int, Foreign Key para schedules.id)
- room_id (int, Foreign Key para rooms.id)

#### Enum courses_period

- Matutino
- Noturno
