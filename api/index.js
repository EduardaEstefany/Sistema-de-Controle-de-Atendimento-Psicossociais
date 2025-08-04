// Dados mock em memória
const mockData = [
    { id: 1, nome: 'Maria Silva', profissional: 'Dr. João', data: '2025-01-15', tipo: 'Psicológico', observacoes: 'Primeira consulta' },
    { id: 2, nome: 'Pedro Santos', profissional: 'Profa. Ana', data: '2025-01-16', tipo: 'Pedagógico', observacoes: 'Avaliação' },
    { id: 3, nome: 'Julia Costa', profissional: 'Ass. Carmen', data: '2025-01-17', tipo: 'Assistência Social', observacoes: 'Orientação' },
    { id: 4, nome: 'Carlos Lima', profissional: 'Dr. João', data: '2025-01-18', tipo: 'Psicológico', observacoes: 'Acompanhamento' },
    { id: 5, nome: 'Ana Souza', profissional: 'Profa. Ana', data: '2025-01-19', tipo: 'Pedagógico', observacoes: 'Reforço' }
];

let nextId = 6;

// Handler function para Vercel
export default function handler(req, res) {
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { method, url } = req;
    
    // GET /api/atendimentos
    if (method === 'GET' && url === '/api/atendimentos') {
        return res.json({ success: true, data: mockData });
    }
    
    // GET /api/atendimento/:id
    if (method === 'GET' && url.startsWith('/api/atendimento/')) {
        const id = url.split('/').pop();
        const item = mockData.find(a => a.id == id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Não encontrado' });
        }
        return res.json({ success: true, data: item });
    }
    
    // POST /api/atendimento
    if (method === 'POST' && url === '/api/atendimento') {
        const { nome, profissional, data, tipo, observacoes } = req.body;
        const novo = { id: nextId++, nome, profissional, data, tipo, observacoes };
        mockData.push(novo);
        return res.json({ success: true, data: novo });
    }
    
    // PUT /api/atendimento/:id
    if (method === 'PUT' && url.startsWith('/api/atendimento/')) {
        const id = url.split('/').pop();
        const index = mockData.findIndex(a => a.id == id);
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Não encontrado' });
        }
        Object.assign(mockData[index], req.body);
        return res.json({ success: true, data: mockData[index] });
    }
    
    // DELETE /api/atendimento/:id
    if (method === 'DELETE' && url.startsWith('/api/atendimento/')) {
        const id = url.split('/').pop();
        const index = mockData.findIndex(a => a.id == id);
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Não encontrado' });
        }
        mockData.splice(index, 1);
        return res.json({ success: true, message: 'Removido' });
    }
    
    // GET /api/atendimentos/estatisticas
    if (method === 'GET' && url === '/api/atendimentos/estatisticas') {
        const tipos = {};
        mockData.forEach(a => {
            tipos[a.tipo] = (tipos[a.tipo] || 0) + 1;
        });
        return res.json({ 
            success: true, 
            data: { 
                totalAtendimentos: mockData.length, 
                porTipo: tipos 
            } 
        });
    }
    
    // Health check
    if (method === 'GET' && url === '/health') {
        return res.json({ status: 'OK', total: mockData.length });
    }
    
    // Default response
    res.status(404).json({ success: false, message: 'Endpoint não encontrado' });
}
