/**
 * Servidor simplificado para Vercel - Compatível com Serverless
 * Usa SQLite em memória para evitar problemas de persistência
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// Banco em memória para Vercel
let db = new sqlite3.Database(':memory:');
let isInitialized = false;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Função para inicializar banco em memória
async function initializeDatabase() {
    if (isInitialized) return;
    
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Criar tabela
            db.run(`
                CREATE TABLE IF NOT EXISTS atendimentos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    profissional TEXT NOT NULL,
                    data TEXT NOT NULL,
                    tipo TEXT NOT NULL CHECK (tipo IN ('Psicológico', 'Pedagógico', 'Assistência Social')),
                    observacoes TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            });

            // Inserir dados de exemplo
            const dadosExemplo = [
                ['Maria Silva', 'Dr. João Santos', '2025-01-15', 'Psicológico', 'Primeira consulta - ansiedade'],
                ['Pedro Oliveira', 'Profa. Ana Costa', '2025-01-16', 'Pedagógico', 'Dificuldades de aprendizagem'],
                ['Julia Santos', 'Ass. Social Carmen', '2025-01-17', 'Assistência Social', 'Orientação familiar'],
                ['Carlos Mendes', 'Dr. João Santos', '2025-01-18', 'Psicológico', 'Sessão de acompanhamento'],
                ['Fernanda Lima', 'Profa. Ana Costa', '2025-01-19', 'Pedagógico', 'Avaliação pedagógica'],
                ['Roberto Costa', 'Ass. Social Carmen', '2025-01-20', 'Assistência Social', 'Cadastro social'],
                ['Ana Paula', 'Dr. João Santos', '2025-01-21', 'Psicológico', 'Terapia de grupo'],
                ['Lucas Ferreira', 'Profa. Ana Costa', '2025-01-22', 'Pedagógico', 'Reforço escolar'],
                ['Mariana Souza', 'Ass. Social Carmen', '2025-01-23', 'Assistência Social', 'Documentação'],
                ['Rafael Alves', 'Dr. João Santos', '2025-01-24', 'Psicológico', 'Consulta individual']
            ];

            let completed = 0;
            dadosExemplo.forEach(([nome, profissional, data, tipo, observacoes]) => {
                db.run(
                    'INSERT INTO atendimentos (nome, profissional, data, tipo, observacoes) VALUES (?, ?, ?, ?, ?)',
                    [nome, profissional, data, tipo, observacoes],
                    (err) => {
                        if (err) console.error('Erro ao inserir:', err);
                        completed++;
                        if (completed === dadosExemplo.length) {
                            isInitialized = true;
                            resolve();
                        }
                    }
                );
            });
        });
    });
}

// Rotas da API
app.get('/api/atendimentos', async (req, res) => {
    try {
        await initializeDatabase();
        db.all('SELECT * FROM atendimentos ORDER BY id DESC', (err, rows) => {
            if (err) {
                res.status(500).json({ success: false, message: err.message });
                return;
            }
            res.json({ success: true, data: rows });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/atendimento/:id', async (req, res) => {
    try {
        await initializeDatabase();
        const { id } = req.params;
        db.get('SELECT * FROM atendimentos WHERE id = ?', [id], (err, row) => {
            if (err) {
                res.status(500).json({ success: false, message: err.message });
                return;
            }
            if (!row) {
                res.status(404).json({ success: false, message: 'Atendimento não encontrado' });
                return;
            }
            res.json({ success: true, data: row });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/atendimento', async (req, res) => {
    try {
        await initializeDatabase();
        const { nome, profissional, data, tipo, observacoes } = req.body;
        
        db.run(
            'INSERT INTO atendimentos (nome, profissional, data, tipo, observacoes) VALUES (?, ?, ?, ?, ?)',
            [nome, profissional, data, tipo, observacoes],
            function(err) {
                if (err) {
                    res.status(500).json({ success: false, message: err.message });
                    return;
                }
                res.json({ 
                    success: true, 
                    message: 'Atendimento criado com sucesso',
                    id: this.lastID 
                });
            }
        );
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/atendimento/:id', async (req, res) => {
    try {
        await initializeDatabase();
        const { id } = req.params;
        const { nome, profissional, data, tipo, observacoes } = req.body;
        
        db.run(
            'UPDATE atendimentos SET nome = ?, profissional = ?, data = ?, tipo = ?, observacoes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [nome, profissional, data, tipo, observacoes, id],
            function(err) {
                if (err) {
                    res.status(500).json({ success: false, message: err.message });
                    return;
                }
                if (this.changes === 0) {
                    res.status(404).json({ success: false, message: 'Atendimento não encontrado' });
                    return;
                }
                res.json({ success: true, message: 'Atendimento atualizado com sucesso' });
            }
        );
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/atendimento/:id', async (req, res) => {
    try {
        await initializeDatabase();
        const { id } = req.params;
        
        db.run('DELETE FROM atendimentos WHERE id = ?', [id], function(err) {
            if (err) {
                res.status(500).json({ success: false, message: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ success: false, message: 'Atendimento não encontrado' });
                return;
            }
            res.json({ success: true, message: 'Atendimento removido com sucesso' });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/atendimentos/estatisticas', async (req, res) => {
    try {
        await initializeDatabase();
        
        db.all('SELECT COUNT(*) as total FROM atendimentos', (err, totalRows) => {
            if (err) {
                res.status(500).json({ success: false, message: err.message });
                return;
            }
            
            db.all('SELECT tipo, COUNT(*) as count FROM atendimentos GROUP BY tipo', (err, tipoRows) => {
                if (err) {
                    res.status(500).json({ success: false, message: err.message });
                    return;
                }
                
                const porTipo = {};
                tipoRows.forEach(row => {
                    porTipo[row.tipo] = row.count;
                });
                
                res.json({
                    success: true,
                    data: {
                        totalAtendimentos: totalRows[0].total,
                        porTipo: porTipo
                    }
                });
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: 'production'
    });
});

// Rota para servir o frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota catch-all
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Para Vercel
module.exports = app;
