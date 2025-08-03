/**
 * Ponto de entrada da aplicação
 * Inicializa o servidor e configura o banco de dados
 */

const Server = require('./src/backend/server');

// Tentar usar PostgreSQL, se não disponível usar SQLite
let database;
try {
    database = require('./src/backend/config/database');
} catch (error) {
    console.log('📋 PostgreSQL não disponível, usando SQLite para demonstração...');
    database = require('./src/backend/config/database-sqlite');
}

/**
 * Função pura para criação da tabela de atendimentos
 * @returns {string} SQL para criação da tabela
 */
const getCreateTableSQL = () => `
    CREATE TABLE IF NOT EXISTS atendimento (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        profissional TEXT NOT NULL,
        data DATE NOT NULL,
        tipo TEXT NOT NULL CHECK (tipo IN ('Psicológico', 'Pedagógico', 'Assistência Social')),
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Índices para melhor performance
    CREATE INDEX IF NOT EXISTS idx_atendimento_data ON atendimento(data);
    CREATE INDEX IF NOT EXISTS idx_atendimento_tipo ON atendimento(tipo);
    CREATE INDEX IF NOT EXISTS idx_atendimento_profissional ON atendimento(profissional);
`;

/**
 * Função para inserir dados de exemplo (apenas em desenvolvimento)
 * @returns {string} SQL para inserção de dados compatível com SQLite
 */
const getInsertSampleDataSQL = () => `
    INSERT OR IGNORE INTO atendimento (nome, profissional, data, tipo, observacoes) 
    VALUES 
        ('Maria Silva', 'Dr. João Santos', '2025-01-15', 'Psicológico', 'Primeira consulta - ansiedade'),
        ('Carlos Oliveira', 'Profª Ana Costa', '2025-01-16', 'Pedagógico', 'Dificuldades de aprendizagem'),
        ('Fernanda Lima', 'Ass. Social Paula', '2025-01-17', 'Assistência Social', 'Orientação sobre benefícios'),
        ('Roberto Mendes', 'Dr. João Santos', '2025-01-18', 'Psicológico', 'Acompanhamento de depressão'),
        ('Juliana Souza', 'Profª Ana Costa', '2025-01-19', 'Pedagógico', 'Avaliação pedagógica');
`;

/**
 * Inicializa o banco de dados
 */
async function initializeDatabase() {
    try {
        console.log('🔧 Configurando banco de dados...');
        
        // Criar tabela
        await database.query(getCreateTableSQL());
        console.log('✅ Tabela de atendimentos criada/verificada');

        // Inserir dados de exemplo apenas em desenvolvimento
        if (process.env.NODE_ENV !== 'production') {
            await database.query(getInsertSampleDataSQL());
            console.log('📝 Dados de exemplo inseridos');
        }

        console.log('✅ Banco de dados inicializado com sucesso');
    } catch (error) {
        console.error('❌ Erro ao inicializar banco de dados:', error);
        throw error;
    }
}

/**
 * Função principal da aplicação
 */
async function main() {
    try {
        console.log('🚀 Iniciando Sistema de Controle de Atendimentos Psicossociais...');
        
        // Inicializar banco de dados
        await initializeDatabase();
        
        // Criar e iniciar servidor
        const server = new Server();
        await server.start();
        
        console.log('✅ Sistema iniciado com sucesso!');
        
        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('📤 Recebido SIGTERM, parando servidor...');
            await server.stop();
            await database.close();
            process.exit(0);
        });

        process.on('SIGINT', async () => {
            console.log('📤 Recebido SIGINT, parando servidor...');
            await server.stop();
            await database.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Erro fatal ao iniciar aplicação:', error);
        process.exit(1);
    }
}

// Executar aplicação
if (require.main === module) {
    main();
}

module.exports = main;
