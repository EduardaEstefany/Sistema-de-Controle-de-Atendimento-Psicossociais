/**
 * Servidor básico para Vercel - Máxima compatibilidade serverless
 * Versão minimalista garantida para funcionar
 */

const express = require('express');
const path = require('path');

const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.static('public'));

// Dados mock em memória
const mockData = [
    { id: 1, nome: 'Maria Silva', profissional: 'Dr. João', data: '2025-01-15', tipo: 'Psicológico', observacoes: 'Primeira consulta' },
    { id: 2, nome: 'Pedro Santos', profissional: 'Profa. Ana', data: '2025-01-16', tipo: 'Pedagógico', observacoes: 'Avaliação' },
    { id: 3, nome: 'Julia Costa', profissional: 'Ass. Carmen', data: '2025-01-17', tipo: 'Assistência Social', observacoes: 'Orientação' },
    { id: 4, nome: 'Carlos Lima', profissional: 'Dr. João', data: '2025-01-18', tipo: 'Psicológico', observacoes: 'Acompanhamento' },
    { id: 5, nome: 'Ana Souza', profissional: 'Profa. Ana', data: '2025-01-19', tipo: 'Pedagógico', observacoes: 'Reforço' }
];

let nextId = 6;

// API Routes
app.get('/api/atendimentos', (req, res) => {
    res.json({ success: true, data: mockData });
});

app.get('/api/atendimento/:id', (req, res) => {
    const item = mockData.find(a => a.id == req.params.id);
    if (!item) {
        return res.status(404).json({ success: false, message: 'Não encontrado' });
    }
    res.json({ success: true, data: item });
});

app.post('/api/atendimento', (req, res) => {
    const { nome, profissional, data, tipo, observacoes } = req.body;
    const novo = { id: nextId++, nome, profissional, data, tipo, observacoes };
    mockData.push(novo);
    res.json({ success: true, data: novo });
});

app.put('/api/atendimento/:id', (req, res) => {
    const index = mockData.findIndex(a => a.id == req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Não encontrado' });
    }
    Object.assign(mockData[index], req.body);
    res.json({ success: true, data: mockData[index] });
});

app.delete('/api/atendimento/:id', (req, res) => {
    const index = mockData.findIndex(a => a.id == req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Não encontrado' });
    }
    mockData.splice(index, 1);
    res.json({ success: true, message: 'Removido' });
});

app.get('/api/atendimentos/estatisticas', (req, res) => {
    const tipos = {};
    mockData.forEach(a => {
        tipos[a.tipo] = (tipos[a.tipo] || 0) + 1;
    });
    res.json({ 
        success: true, 
        data: { 
            totalAtendimentos: mockData.length, 
            porTipo: tipos 
        } 
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', total: mockData.length });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
