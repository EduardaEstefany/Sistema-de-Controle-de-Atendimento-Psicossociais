# Sistema de Controle de Atendimentos Psicossociais

## 📋 Descrição

Sistema web desenvolvido para auxiliar no cadastro e controle de atendimentos psicossociais realizados por psicólogos, assistentes sociais e pedagogos de um centro comunitário.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite** - Banco de dados relacional (com suporte para PostgreSQL)
- **CORS** - Middleware para cross-origin requests
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização responsiva
- **JavaScript ES6+** - Lógica e AJAX
- **Font Awesome** - Ícones

### Ferramentas
- **Webpack** - Empacotamento de módulos
- **Babel** - Transpilação JavaScript
- **Nodemon** - Desenvolvimento com hot reload
- **NPM** - Gerenciamento de pacotes

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular com separação clara de responsabilidades:

```
src/
├── backend/
│   ├── config/          # Configurações (banco de dados)
│   ├── controllers/     # Controladores (lógica de controle)
│   ├── models/          # Modelos de dados (OO)
│   ├── routes/          # Rotas da API REST
│   ├── services/        # Serviços de negócio
│   └── server.js        # Configuração do servidor
├── frontend/
│   └── index.js         # Ponto de entrada para Webpack
public/
├── css/
│   └── style.css        # Estilos da aplicação
├── js/
│   └── app.js           # JavaScript principal com AJAX
└── index.html           # Interface principal
```

## 🔧 Paradigmas Implementados

### Programação Orientada a Objetos
- **Classes** para modelos de dados (`Atendimento`)
- **Encapsulamento** com getters/setters
- **Singleton** para conexão com banco
- **Herança** e polimorfismo quando aplicável

### Programação Funcional
- **Funções puras** para validação e formatação
- **Imutabilidade** sempre que possível
- **Composição de funções**
- **High-order functions**

## 📡 API REST

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/atendimentos` | Lista todos os atendimentos |
| GET | `/api/atendimento/:id` | Busca atendimento por ID |
| POST | `/api/atendimento` | Cria novo atendimento |
| PUT | `/api/atendimento/:id` | Atualiza atendimento |
| DELETE | `/api/atendimento/:id` | Remove atendimento |
| GET | `/api/atendimentos/estatisticas` | Estatísticas dos atendimentos |

### Estrutura de Dados

```json
{
  "id": 1,
  "nome": "Nome do Atendido",
  "profissional": "Nome do Profissional",
  "data": "2025-01-15",
  "tipo": "Psicológico|Pedagógico|Assistência Social",
  "observacoes": "Observações do atendimento"
}
```

## �️ Banco de Dados

### SQLite como Solução Principal

Este projeto utiliza **SQLite** como banco de dados principal, embora tenha sido originalmente projetado para PostgreSQL. A escolha do SQLite foi feita pelos seguintes motivos:

#### ✅ Vantagens do SQLite para este projeto:
- **Simplicidade de instalação**: Não requer configuração de servidor de banco separado
- **Portabilidade**: O banco é um arquivo único, fácil de transportar e versionar
- **Zero configuração**: Funciona imediatamente após `npm install`
- **Ideal para desenvolvimento**: Perfeito para projetos acadêmicos e protótipos
- **Performance adequada**: Excelente para aplicações de pequeno a médio porte
- **Compatibilidade**: Mantém a mesma interface SQL do PostgreSQL

#### 🔄 Camada de Compatibilidade
O sistema inclui uma camada de abstração (`database-sqlite.js`) que:
- Traduz queries específicas do PostgreSQL para SQLite
- Mantém a mesma interface da aplicação
- Permite migração futura para PostgreSQL sem alterações no código de negócio
- Simula funcionalidades como connection pooling

#### 📈 Migração para PostgreSQL
Para usar PostgreSQL em produção, basta:
1. Instalar PostgreSQL
2. Configurar variáveis de ambiente
3. Trocar o import de `database-sqlite.js` para `database.js`
4. Executar as migrations

## �🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (v14 ou superior)
- NPM ou Yarn
- *(SQLite incluído automaticamente - não requer instalação separada)*

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd sistema-controle-atendimentos-psicossociais
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados (Opcional)
O sistema funciona automaticamente com SQLite, sem necessidade de configuração adicional. 

Para usar PostgreSQL no futuro, crie um arquivo `.env`:

```env
# Configuração PostgreSQL (opcional)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=atendimentos_psicossociais
DB_USER=postgres
DB_PASSWORD=sua_senha
PORT=3000
NODE_ENV=development
```

**Nota**: Com SQLite, o banco é criado automaticamente no primeiro uso como `database.sqlite`.

### 4. Execute a aplicação

#### Desenvolvimento
```bash
# Servidor backend com hot reload
npm run dev

# Webpack dev server (opcional)
npm run webpack:dev
```

#### Produção
```bash
# Build do frontend
npm run build

# Iniciar servidor
npm start
```

## 🌐 Acesso

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## 📱 Funcionalidades

### Dashboard
- Estatísticas gerais dos atendimentos
- Contadores por tipo de atendimento
- Visualização responsiva

### Cadastro de Atendimento
- Formulário completo com validação
- Campos obrigatórios marcados
- Feedback visual de erros/sucessos

### Lista de Atendimentos
- Tabela responsiva com todos os registros
- Filtros por tipo de atendimento
- Ações de editar e excluir
- Carregamento assíncrono via AJAX

### Interface
- Design responsivo para mobile/desktop
- Navegação por tabs
- Modais para edição
- Toasts para notificações
- Loading states

## 🧪 Funcionalidades AJAX

O frontend utiliza AJAX para todas as operações:

- **Fetch API** nativa para requisições HTTP
- **Promises/Async-Await** para controle assíncrono
- **Tratamento de erros** robusto
- **Loading states** e feedback visual
- **Atualizações dinâmicas** sem recarregar página

## 🔒 Validações

### Backend
- Validação de tipos de dados
- Sanitização de entradas
- Verificação de campos obrigatórios
- Validação de formatos (datas, emails, etc.)

### Frontend
- Validação em tempo real
- Feedback visual imediato
- Prevenção de envios inválidos
- Sanitização de HTML

## 📊 Estrutura do Banco de Dados

### Tabela: atendimentos (SQLite)
```sql
CREATE TABLE atendimentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    profissional TEXT NOT NULL,
    data TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('Psicológico', 'Pedagógico', 'Assistência Social')),
    observacoes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Para PostgreSQL (versão alternativa)
```sql
CREATE TABLE atendimento (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    profissional TEXT NOT NULL,
    data DATE NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('Psicológico', 'Pedagógico', 'Assistência Social')),
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🐛 Debugging

### Logs
- Logs estruturados no servidor
- Timestamps em todas as operações
- Diferenciação por níveis (info, error, debug)

### Desenvolvimento
```bash
# Logs detalhados
NODE_ENV=development npm run dev

# Webpack dev server com hot reload
npm run webpack:dev
```

## 📈 Performance

### Otimizações Implementadas
- **Webpack** para bundling otimizado
- **Babel** para compatibilidade
- **CSS minificado** em produção
- **Compressão GZIP** no servidor
- **Cache de headers** apropriados
- **SQLite** com otimizações de query
- **Connection pooling simulado** para compatibilidade

## 🔐 Segurança

### Medidas Implementadas
- **CORS** configurado adequadamente
- **Sanitização** de inputs
- **Prepared statements** para SQL
- **Validação** server-side
- **Error handling** sem vazamento de informações

## 🚀 Deploy

### Para SQLite (Configuração Atual)
```bash
# Apenas definir o ambiente
NODE_ENV=production
PORT=3000

# O banco SQLite será criado automaticamente
npm run build
npm start
```

### Para PostgreSQL (Configuração Alternativa)
```env
NODE_ENV=production
DB_HOST=seu_host_producao
DB_PORT=5432
DB_NAME=atendimentos_psicossociais
DB_USER=usuario_producao
DB_PASSWORD=senha_segura
PORT=3000
```

### Build de Produção
```bash
npm run build
npm start
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Autor

**Eduarda** - Desenvolvimento Full Stack

## 📞 Suporte

Para suporte ou dúvidas sobre o sistema:
- Criar issue no GitHub
- Documentação inline no código
- Comentários detalhados nos módulos principais

---

*Sistema desenvolvido como projeto acadêmico para demonstração de conceitos de Programação para Web com paradigmas funcionais e orientados a objetos.*
