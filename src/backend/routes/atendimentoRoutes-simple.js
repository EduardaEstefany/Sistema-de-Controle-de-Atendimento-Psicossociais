/**
 * Rotas de Atendimentos - Versão Simplificada
 * Utiliza express.Router() para modularização
 */

const express = require('express');
const AtendimentoController = require('../controllers/AtendimentoController');

const router = express.Router();

/**
 * Middleware para log das requisições
 */
const logRequest = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
};

/**
 * Middleware para validação de Content-Type em requisições POST/PUT
 */
const validateContentType = (req, res, next) => {
    if (['POST', 'PUT'].includes(req.method)) {
        if (!req.is('application/json')) {
            return res.status(400).json({
                success: false,
                message: 'Content-Type deve ser application/json'
            });
        }
    }
    next();
};

// Aplicar middlewares
router.use(logRequest);
router.use(validateContentType);

// Rotas da API

// GET /atendimentos - Lista todos os atendimentos
router.get('/atendimentos', AtendimentoController.listarTodos);

// GET /atendimento/:id - Busca atendimento por ID  
router.get('/atendimento/:id', AtendimentoController.buscarPorId);

// POST /atendimento - Cria novo atendimento
router.post('/atendimento', AtendimentoController.criar);

// PUT /atendimento/:id - Atualiza atendimento existente
router.put('/atendimento/:id', AtendimentoController.atualizar);

// DELETE /atendimento/:id - Remove atendimento
router.delete('/atendimento/:id', AtendimentoController.remover);

// GET /atendimentos/estatisticas - Obtém estatísticas dos atendimentos
router.get('/atendimentos/estatisticas', AtendimentoController.obterEstatisticas);

module.exports = router;
