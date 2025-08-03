/**
 * Controller de Atendimentos - Camada de controle
 * Implementa padrões REST e orientação a objetos
 */

const AtendimentoService = require('../services/AtendimentoService');

/**
 * Função pura para criar resposta de sucesso
 * @param {*} data - Dados da resposta
 * @param {string} message - Mensagem de sucesso
 * @returns {Object} Resposta formatada
 */
const createSuccessResponse = (data, message = 'Operação realizada com sucesso') => ({
    success: true,
    message,
    data
});

/**
 * Função pura para criar resposta de erro
 * @param {string} message - Mensagem de erro
 * @param {number} statusCode - Código de status HTTP
 * @returns {Object} Resposta de erro formatada
 */
const createErrorResponse = (message, statusCode = 500) => ({
    success: false,
    message,
    statusCode
});

/**
 * Função pura para validar ID
 * @param {string} id - ID a ser validado
 * @returns {boolean} True se válido
 */
const isValidId = (id) => {
    const numId = parseInt(id);
    return !isNaN(numId) && numId > 0;
};

/**
 * Classe AtendimentoController - Controlador de atendimentos
 * Implementa padrões de orientação a objetos para controle de requisições
 */
class AtendimentoController {
    /**
     * Lista todos os atendimentos
     * GET /atendimentos
     */
    static async listarTodos(req, res) {
        try {
            const atendimentos = await AtendimentoService.listarTodos();
            const response = createSuccessResponse(atendimentos, 'Atendimentos listados com sucesso');
            res.status(200).json(response);
        } catch (error) {
            console.error('Erro no controller ao listar atendimentos:', error);
            const errorResponse = createErrorResponse('Erro ao listar atendimentos');
            res.status(500).json(errorResponse);
        }
    }

    /**
     * Busca atendimento por ID
     * GET /atendimento/:id
     */
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            // Validar ID
            if (!isValidId(id)) {
                const errorResponse = createErrorResponse('ID inválido', 400);
                return res.status(400).json(errorResponse);
            }

            const atendimento = await AtendimentoService.buscarPorId(parseInt(id));

            if (!atendimento) {
                const errorResponse = createErrorResponse('Atendimento não encontrado', 404);
                return res.status(404).json(errorResponse);
            }

            const response = createSuccessResponse(atendimento, 'Atendimento encontrado');
            res.status(200).json(response);
        } catch (error) {
            console.error('Erro no controller ao buscar atendimento:', error);
            const errorResponse = createErrorResponse('Erro ao buscar atendimento');
            res.status(500).json(errorResponse);
        }
    }

    /**
     * Cria novo atendimento
     * POST /atendimento
     */
    static async criar(req, res) {
        try {
            const dadosAtendimento = req.body;

            // Validar se os dados foram enviados
            if (!dadosAtendimento || Object.keys(dadosAtendimento).length === 0) {
                const errorResponse = createErrorResponse('Dados do atendimento são obrigatórios', 400);
                return res.status(400).json(errorResponse);
            }

            const novoAtendimento = await AtendimentoService.criar(dadosAtendimento);
            const response = createSuccessResponse(novoAtendimento, 'Atendimento criado com sucesso');
            res.status(201).json(response);
        } catch (error) {
            console.error('Erro no controller ao criar atendimento:', error);
            
            // Verificar se é erro de validação
            if (error.message.includes('Dados inválidos')) {
                const errorResponse = createErrorResponse(error.message, 400);
                return res.status(400).json(errorResponse);
            }

            const errorResponse = createErrorResponse('Erro ao criar atendimento');
            res.status(500).json(errorResponse);
        }
    }

    /**
     * Atualiza atendimento existente
     * PUT /atendimento/:id
     */
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dadosAtendimento = req.body;

            // Validar ID
            if (!isValidId(id)) {
                const errorResponse = createErrorResponse('ID inválido', 400);
                return res.status(400).json(errorResponse);
            }

            // Validar se os dados foram enviados
            if (!dadosAtendimento || Object.keys(dadosAtendimento).length === 0) {
                const errorResponse = createErrorResponse('Dados do atendimento são obrigatórios', 400);
                return res.status(400).json(errorResponse);
            }

            const atendimentoAtualizado = await AtendimentoService.atualizar(parseInt(id), dadosAtendimento);

            if (!atendimentoAtualizado) {
                const errorResponse = createErrorResponse('Atendimento não encontrado', 404);
                return res.status(404).json(errorResponse);
            }

            const response = createSuccessResponse(atendimentoAtualizado, 'Atendimento atualizado com sucesso');
            res.status(200).json(response);
        } catch (error) {
            console.error('Erro no controller ao atualizar atendimento:', error);
            
            // Verificar se é erro de validação
            if (error.message.includes('Dados inválidos')) {
                const errorResponse = createErrorResponse(error.message, 400);
                return res.status(400).json(errorResponse);
            }

            const errorResponse = createErrorResponse('Erro ao atualizar atendimento');
            res.status(500).json(errorResponse);
        }
    }

    /**
     * Remove atendimento
     * DELETE /atendimento/:id
     */
    static async remover(req, res) {
        try {
            const { id } = req.params;

            // Validar ID
            if (!isValidId(id)) {
                const errorResponse = createErrorResponse('ID inválido', 400);
                return res.status(400).json(errorResponse);
            }

            const removido = await AtendimentoService.remover(parseInt(id));

            if (!removido) {
                const errorResponse = createErrorResponse('Atendimento não encontrado', 404);
                return res.status(404).json(errorResponse);
            }

            const response = createSuccessResponse(null, 'Atendimento removido com sucesso');
            res.status(200).json(response);
        } catch (error) {
            console.error('Erro no controller ao remover atendimento:', error);
            const errorResponse = createErrorResponse('Erro ao remover atendimento');
            res.status(500).json(errorResponse);
        }
    }

    /**
     * Busca atendimentos por tipo
     * GET /atendimentos/tipo/:tipo
     */
    static async buscarPorTipo(req, res) {
        try {
            const { tipo } = req.params;

            // Validar tipo
            const tiposValidos = ['Psicológico', 'Pedagógico', 'Assistência Social'];
            if (!tiposValidos.includes(tipo)) {
                const errorResponse = createErrorResponse('Tipo de atendimento inválido', 400);
                return res.status(400).json(errorResponse);
            }

            const atendimentos = await AtendimentoService.buscarPorTipo(tipo);
            const response = createSuccessResponse(atendimentos, `Atendimentos do tipo ${tipo} listados`);
            res.status(200).json(response);
        } catch (error) {
            console.error('Erro no controller ao buscar por tipo:', error);
            const errorResponse = createErrorResponse('Erro ao buscar atendimentos por tipo');
            res.status(500).json(errorResponse);
        }
    }

    /**
     * Obtém estatísticas dos atendimentos
     * GET /atendimentos/estatisticas
     */
    static async obterEstatisticas(req, res) {
        try {
            const estatisticas = await AtendimentoService.obterEstatisticas();
            const response = createSuccessResponse(estatisticas, 'Estatísticas obtidas com sucesso');
            res.status(200).json(response);
        } catch (error) {
            console.error('Erro no controller ao obter estatísticas:', error);
            const errorResponse = createErrorResponse('Erro ao obter estatísticas');
            res.status(500).json(errorResponse);
        }
    }
}

module.exports = AtendimentoController;
