# Sistema de Controle de Atendimentos Psicossociais

## 📋 Descrição

Sistema web desenvolvido para auxiliar no cadastro e controle de atendimentos psicossociais realizados por psicólogos, assistentes sociais e pedagogos de um centro comunitário.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
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

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (v14 ou superior)
- PostgreSQL (v12 ou superior)
- NPM ou Yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd sistema-controle-atendimentos-psicossociais
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
Crie um banco PostgreSQL e configure as variáveis no arquivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=atendimentos_psicossociais
DB_USER=postgres
DB_PASSWORD=sua_senha
PORT=3000
NODE_ENV=development
```

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

## 📊 Banco de Dados

### Tabela: atendimento
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
- **Connection pooling** no PostgreSQL

## 🔐 Segurança

### Medidas Implementadas
- **CORS** configurado adequadamente
- **Sanitização** de inputs
- **Prepared statements** para SQL
- **Validação** server-side
- **Error handling** sem vazamento de informações

## 🚀 Deploy

### Variáveis de Ambiente para Produção
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
