/**
 * Sistema de Atendimentos - Servidor Completo Funcional
 * Versão simplificada para garantir funcionamento
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Tentar usar PostgreSQL, se não disponível usar SQLite
let database;
try {
    database = require('./src/backend/config/database');
} catch (error) {
    console.log('📋 PostgreSQL não disponível, usando SQLite para demonstração...');
    database = require('./src/backend/config/database-sqlite');
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Importar controller
const AtendimentoController = require('./src/backend/controllers/AtendimentoController');

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rotas da API
app.get('/api/atendimentos', AtendimentoController.listarTodos);
app.get('/api/atendimento/:id', AtendimentoController.buscarPorId);
app.post('/api/atendimento', AtendimentoController.criar);
app.put('/api/atendimento/:id', AtendimentoController.atualizar);
app.delete('/api/atendimento/:id', AtendimentoController.remover);
app.get('/api/atendimentos/estatisticas', AtendimentoController.obterEstatisticas);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Servir frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        path: req.originalUrl
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Erro não tratado:', error);
    res.status(error.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Erro interno do servidor' 
            : error.message
    });
});

// Inicializar banco de dados
async function initDatabase() {
    try {
        console.log('🔧 Configurando banco de dados...');
        
        // Criar tabela
        await database.query(`
            CREATE TABLE IF NOT EXISTS atendimento (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                profissional TEXT NOT NULL,
                data DATE NOT NULL,
                tipo TEXT NOT NULL CHECK (tipo IN ('Psicológico', 'Pedagógico', 'Assistência Social')),
                observacoes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela de atendimentos criada/verificada');

        // Inserir dados de exemplo
        if (process.env.NODE_ENV !== 'production') {
            await database.query(`
                INSERT OR IGNORE INTO atendimento (nome, profissional, data, tipo, observacoes) 
                VALUES 
                    ('Maria Silva', 'Dr. João Santos', '2025-01-15', 'Psicológico', 'Primeira consulta - ansiedade'),
                    ('Carlos Oliveira', 'Profª Ana Costa', '2025-01-16', 'Pedagógico', 'Dificuldades de aprendizagem'),
                    ('Fernanda Lima', 'Ass. Social Paula', '2025-01-17', 'Assistência Social', 'Orientação sobre benefícios'),
                    ('Roberto Mendes', 'Dr. João Santos', '2025-01-18', 'Psicológico', 'Acompanhamento de depressão'),
                    ('Juliana Souza', 'Profª Ana Costa', '2025-01-19', 'Pedagógico', 'Avaliação pedagógica')
            `);
            console.log('📝 Dados de exemplo inseridos');
        }

        console.log('✅ Banco de dados inicializado com sucesso');
    } catch (error) {
        console.error('❌ Erro ao inicializar banco de dados:', error);
        throw error;
    }
}

// Iniciar servidor
async function startServer() {
    try {
        await initDatabase();
        
        app.listen(port, () => {
            console.log(`🚀 Servidor rodando na porta ${port}`);
            console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📱 Acesse: http://localhost:${port}`);
            console.log('✅ Sistema iniciado com sucesso!');
        });
    } catch (error) {
        console.error('❌ Erro fatal ao iniciar aplicação:', error);
        process.exit(1);
    }
}

startServer();
