/**
 * Servidor simplificado para Vercel - Compatível com Serverless
 * Versão ultra-simplificada sem SQLite para garantir funcionamento
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Dados em memória (simulando banco de dados)
let atendimentos = [
    {
        id: 1,
        nome: 'Maria Silva',
        profissional: 'Dr. João Santos',
        data: '2025-01-15',
        tipo: 'Psicológico',
        observacoes: 'Primeira consulta - ansiedade',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 2,
        nome: 'Pedro Oliveira',
        profissional: 'Profa. Ana Costa',
        data: '2025-01-16',
        tipo: 'Pedagógico',
        observacoes: 'Dificuldades de aprendizagem',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 3,
        nome: 'Julia Santos',
        profissional: 'Ass. Social Carmen',
        data: '2025-01-17',
        tipo: 'Assistência Social',
        observacoes: 'Orientação familiar',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 4,
        nome: 'Carlos Mendes',
        profissional: 'Dr. João Santos',
        data: '2025-01-18',
        tipo: 'Psicológico',
        observacoes: 'Sessão de acompanhamento',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 5,
        nome: 'Fernanda Lima',
        profissional: 'Profa. Ana Costa',
        data: '2025-01-19',
        tipo: 'Pedagógico',
        observacoes: 'Avaliação pedagógica',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

let nextId = 6;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.get('/api/atendimentos', (req, res) => {
    try {
        res.json({ 
            success: true, 
            data: atendimentos.sort((a, b) => b.id - a.id) 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/atendimento/:id', (req, res) => {
    try {
        const { id } = req.params;
        const atendimento = atendimentos.find(a => a.id === parseInt(id));
        
        if (!atendimento) {
            return res.status(404).json({ 
                success: false, 
                message: 'Atendimento não encontrado' 
            });
        }
        
        res.json({ success: true, data: atendimento });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/atendimento', (req, res) => {
    try {
        const { nome, profissional, data, tipo, observacoes } = req.body;
        
        if (!nome || !profissional || !data || !tipo) {
            return res.status(400).json({ 
                success: false, 
                message: 'Campos obrigatórios não informados' 
            });
        }
        
        const novoAtendimento = {
            id: nextId++,
            nome,
            profissional,
            data,
            tipo,
            observacoes: observacoes || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        atendimentos.push(novoAtendimento);
        
        res.json({ 
            success: true, 
            message: 'Atendimento criado com sucesso',
            id: novoAtendimento.id,
            data: novoAtendimento
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/atendimento/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { nome, profissional, data, tipo, observacoes } = req.body;
        
        const index = atendimentos.findIndex(a => a.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Atendimento não encontrado' 
            });
        }
        
        atendimentos[index] = {
            ...atendimentos[index],
            nome: nome || atendimentos[index].nome,
            profissional: profissional || atendimentos[index].profissional,
            data: data || atendimentos[index].data,
            tipo: tipo || atendimentos[index].tipo,
            observacoes: observacoes !== undefined ? observacoes : atendimentos[index].observacoes,
            updated_at: new Date().toISOString()
        };
        
        res.json({ 
            success: true, 
            message: 'Atendimento atualizado com sucesso',
            data: atendimentos[index]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/atendimento/:id', (req, res) => {
    try {
        const { id } = req.params;
        const index = atendimentos.findIndex(a => a.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Atendimento não encontrado' 
            });
        }
        
        atendimentos.splice(index, 1);
        
        res.json({ 
            success: true, 
            message: 'Atendimento removido com sucesso' 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/atendimentos/estatisticas', (req, res) => {
    try {
        const total = atendimentos.length;
        const porTipo = {};
        
        atendimentos.forEach(atendimento => {
            porTipo[atendimento.tipo] = (porTipo[atendimento.tipo] || 0) + 1;
        });
        
        res.json({
            success: true,
            data: {
                totalAtendimentos: total,
                porTipo: porTipo
            }
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
        environment: 'production',
        totalAtendimentos: atendimentos.length
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
