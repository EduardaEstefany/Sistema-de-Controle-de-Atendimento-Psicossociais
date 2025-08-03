# Documentação Técnica - Sistema de Controle de Atendimentos Psicossociais

## 📋 Diagrama de Funcionamento

```
┌─────────────────┐    HTTP/AJAX    ┌─────────────────┐    SQL    ┌─────────────────┐
│                 │ ──────────────→ │                 │ ────────→ │                 │
│    Frontend     │                 │    Backend      │           │   PostgreSQL    │
│   (Browser)     │ ←────────────── │   (Express)     │ ←──────── │    Database     │
│                 │    JSON/REST    │                 │   Data    │                 │
└─────────────────┘                 └─────────────────┘           └─────────────────┘
      │                                      │
      │                                      │
      ▼                                      ▼
┌─────────────────┐                 ┌─────────────────┐
│    Webpack      │                 │   Módulos       │
│   (Bundling)    │                 │ - Routes        │
│                 │                 │ - Controllers   │
└─────────────────┘                 │ - Services      │
                                    │ - Models        │
                                    └─────────────────┘
```

## 🏛️ Arquitetura em Camadas

### Frontend (Apresentação)
- **HTML5**: Estrutura semântica
- **CSS3**: Estilos responsivos com Grid/Flexbox
- **JavaScript ES6+**: Lógica client-side com AJAX
- **Webpack**: Build e empacotamento

### Backend (API REST)
- **Routes**: Definição de endpoints
- **Controllers**: Lógica de controle de requisições
- **Services**: Regras de negócio
- **Models**: Representação de dados

### Persistência
- **PostgreSQL**: Banco relacional
- **Connection Pool**: Otimização de conexões

## 🧩 Módulos e Responsabilidades

### 1. Models (Orientação a Objetos)

#### `Atendimento.js`
```javascript
class Atendimento {
    constructor(dados)     // Encapsulamento
    validate()            // Validação interna
    toJSON()             // Serialização
    static fromDatabase() // Factory method
}
```

**Características OO Implementadas:**
- ✅ Encapsulamento (propriedades privadas com `_`)
- ✅ Getters/Setters com validação
- ✅ Métodos de instância e estáticos
- ✅ Validação interna de dados
- ✅ Factory methods para criação

### 2. Services (Funcional + OO)

#### `AtendimentoService.js`
```javascript
class AtendimentoService {
    static async listarTodos()      // Operação READ
    static async buscarPorId(id)    // Operação READ específica
    static async criar(dados)       // Operação CREATE
    static async atualizar(id, dados) // Operação UPDATE
    static async remover(id)        // Operação DELETE
}
```

**Funções Puras Implementadas:**
```javascript
const buildInsertQuery = (dados) => ({ text, values })
const buildUpdateQuery = (id, dados) => ({ text, values })
const formatDate = (data) => string
```

### 3. Controllers (Orientação a Objetos)

#### `AtendimentoController.js`
```javascript
class AtendimentoController {
    static async listarTodos(req, res)
    static async buscarPorId(req, res)
    static async criar(req, res)
    static async atualizar(req, res)
    static async remover(req, res)
}
```

**Funções Puras para Respostas:**
```javascript
const createSuccessResponse = (data, message) => Object
const createErrorResponse = (message, statusCode) => Object
const isValidId = (id) => boolean
```

### 4. Database (Singleton Pattern)

#### `database.js`
```javascript
class Database {
    constructor()           // Singleton implementation
    async query(text, params) // Método principal
    async close()          // Cleanup
    static getConfig()     // Função pura para config
}
```

## 📡 Frontend - Programação Funcional e OO

### Funções Puras
```javascript
// Formatação e validação
const formatDate = (dateString) => string
const capitalize = (str) => string
const escapeHtml = (text) => string
const getBadgeClass = (tipo) => string
const truncateText = (text, maxLength) => string
```

### Classes para UI
```javascript
class ApiService {
    static async request(url, options)
    static async listarAtendimentos()
    static async criarAtendimento(dados)
    // ... outros métodos AJAX
}

class UIManager {
    constructor()
    init()
    bindEvents()
    switchTab(tabName)
    // ... métodos de interface
}
```

## 🔄 Fluxo de Dados

### 1. Criação de Atendimento
```
Frontend Form Submit
      ↓
JavaScript Validation
      ↓
AJAX POST Request
      ↓
Express Route Handler
      ↓
Controller Validation
      ↓
Service Business Logic
      ↓
Model Data Validation
      ↓
Database INSERT
      ↓
Response Back Through Layers
      ↓
Frontend UI Update
```

### 2. Listagem de Atendimentos
```
Tab Switch Event
      ↓
AJAX GET Request
      ↓
Controller Handler
      ↓
Service Query
      ↓
Database SELECT
      ↓
Model Transformation
      ↓
JSON Response
      ↓
Frontend Rendering
```

## 🛠️ Implementação dos Paradigmas

### Programação Orientada a Objetos

#### ✅ Encapsulamento
```javascript
class Atendimento {
    constructor(dados) {
        this._nome = dados.nome;  // Propriedade privada
    }
    
    get nome() { return this._nome; }  // Getter
    
    set nome(value) {                  // Setter com validação
        if (!this._validateNome(value)) {
            throw new Error('Nome inválido');
        }
        this._nome = value;
    }
}
```

#### ✅ Herança e Polimorfismo
```javascript
class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;  // Singleton
        }
        // ... implementação
    }
}
```

#### ✅ Abstração
```javascript
class AtendimentoService {
    static async criar(dados) {
        // Abstrai complexidade de validação e persistência
        const atendimento = new Atendimento(dados);
        const validacao = atendimento.validate();
        // ...
    }
}
```

### Programação Funcional

#### ✅ Funções Puras
```javascript
// Entrada → Saída (sem efeitos colaterais)
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

const buildInsertQuery = (dados) => ({
    text: 'INSERT INTO atendimento (...) VALUES (...)',
    values: [dados.nome, dados.profissional, ...]
});
```

#### ✅ Imutabilidade
```javascript
// Sempre retorna novos objetos
const createSuccessResponse = (data, message) => ({
    success: true,
    message,
    data: { ...data }  // Spread para imutabilidade
});
```

#### ✅ Higher-Order Functions
```javascript
// Map para transformação de dados
const renderAtendimentos = (atendimentos) => {
    return atendimentos.map(createRowHTML).join('');
};

// Filter para busca
const filterAtendimentos = (atendimentos, tipo) => {
    return atendimentos.filter(a => !tipo || a.tipo === tipo);
};
```

#### ✅ Composição de Funções
```javascript
const processAtendimento = compose(
    validateData,
    sanitizeInput,
    formatDates
);
```

## 🔍 Validações Implementadas

### Backend (Server-side)
```javascript
// Model validation
validate() {
    const errors = [];
    if (!validateNome(this._nome)) errors.push('Nome inválido');
    if (!validateData(this._data)) errors.push('Data inválida');
    return { isValid: errors.length === 0, errors };
}

// Controller validation
if (!isValidId(id)) {
    return res.status(400).json(createErrorResponse('ID inválido'));
}
```

### Frontend (Client-side)
```javascript
// HTML5 validation
<input type="text" required minlength="2">
<input type="date" required>
<select required>

// JavaScript validation
const validateForm = (formData) => {
    return Object.entries(formData).every(([key, value]) => {
        return validators[key] ? validators[key](value) : true;
    });
};
```

## 📊 Performance e Otimizações

### Backend
- **Connection Pooling**: PostgreSQL pool para reuso de conexões
- **Prepared Statements**: Previne SQL injection e melhora performance
- **Error Handling**: Tratamento robusto sem vazamento de dados
- **Middleware**: Logging e validação modulares

### Frontend
- **Webpack**: Bundle otimizado e code splitting
- **Babel**: Transpilação para compatibilidade
- **CSS Grid/Flexbox**: Layout moderno e responsivo
- **Lazy Loading**: Carregamento sob demanda
- **AJAX**: Atualizações sem reload da página

### Database
- **Índices**: Campos de busca indexados
- **Constraints**: Validação a nível de banco
- **Triggers**: Timestamps automáticos

## 🔧 Configurações

### Webpack (webpack.config.js)
```javascript
module.exports = {
    entry: './src/frontend/index.js',
    output: { path: 'public/dist', filename: 'bundle.js' },
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    }
};
```

### Express Server
```javascript
app.use(cors(getCorsConfig()));
app.use(bodyParser.json());
app.use('/api', atendimentoRoutes);
app.use(express.static('public'));
```

## 🧪 Testes (Estrutura Proposta)

### Backend Tests
```javascript
describe('AtendimentoService', () => {
    test('deve criar atendimento válido', async () => {
        const dados = { nome: 'João', profissional: 'Dr. Silva' };
        const resultado = await AtendimentoService.criar(dados);
        expect(resultado.id).toBeDefined();
    });
});
```

### Frontend Tests
```javascript
describe('APIService', () => {
    test('deve fazer requisição GET', async () => {
        const atendimentos = await ApiService.listarAtendimentos();
        expect(Array.isArray(atendimentos)).toBe(true);
    });
});
```

## 📈 Métricas e Monitoring

### Logs Estruturados
```javascript
console.log(`[${timestamp}] ${method} ${url} - ${status}`);
console.error('Erro na operação:', { error, context });
```

### Health Check
```javascript
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});
```

## 🚀 Deploy e Produção

### Variáveis de Ambiente
```env
NODE_ENV=production
DB_HOST=production_host
PORT=3000
```

### Build Pipeline
```bash
npm run build    # Webpack production build
npm start        # Inicia servidor
```

### Docker (Opcional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

**Conclusão**: O sistema implementa com sucesso os paradigmas de programação orientada a objetos e funcional, demonstrando modularidade, reutilização de código, e separação clara de responsabilidades, atendendo a todos os requisitos técnicos especificados.
