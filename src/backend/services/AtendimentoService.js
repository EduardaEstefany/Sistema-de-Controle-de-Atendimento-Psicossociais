/**
 * Serviço de Atendimentos - Camada de negócio
 * Implementa operações CRUD com funções puras e métodos de classe
 */

// Tentar usar PostgreSQL, se não disponível usar SQLite
let database;
try {
    database = require('../config/database');
} catch (error) {
    database = require('../config/database-sqlite');
}

const { Atendimento } = require('../models/Atendimento');

/**
 * Função pura para construir query de inserção
 * @param {Object} dados - Dados do atendimento
 * @returns {Object} Query e parâmetros
 */
const buildInsertQuery = (dados) => ({
    text: 'INSERT INTO atendimento (nome, profissional, data, tipo, observacoes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    values: [dados.nome, dados.profissional, dados.data, dados.tipo, dados.observacoes]
});

/**
 * Função pura para construir query de atualização
 * @param {number} id - ID do atendimento
 * @param {Object} dados - Dados do atendimento
 * @returns {Object} Query e parâmetros
 */
const buildUpdateQuery = (id, dados) => ({
    text: 'UPDATE atendimento SET nome = $1, profissional = $2, data = $3, tipo = $4, observacoes = $5 WHERE id = $6 RETURNING *',
    values: [dados.nome, dados.profissional, dados.data, dados.tipo, dados.observacoes, id]
});

/**
 * Função pura para formatar data
 * @param {string} data - Data no formato string
 * @returns {string} Data formatada
 */
const formatDate = (data) => {
    const date = new Date(data);
    return date.toISOString().split('T')[0];
};

/**
 * Classe AtendimentoService - Serviços de atendimento
 * Implementa padrões de orientação a objetos para operações de negócio
 */
class AtendimentoService {
    /**
     * Lista todos os atendimentos
     * @returns {Promise<Array>} Lista de atendimentos
     */
    static async listarTodos() {
        try {
            const result = await database.query('SELECT * FROM atendimento ORDER BY data DESC');
            return result.rows.map(row => Atendimento.fromDatabase(row));
        } catch (error) {
            console.error('Erro ao listar atendimentos:', error);
            throw new Error('Erro interno do servidor');
        }
    }

    /**
     * Busca atendimento por ID
     * @param {number} id - ID do atendimento
     * @returns {Promise<Atendimento|null>} Atendimento encontrado ou null
     */
    static async buscarPorId(id) {
        try {
            const result = await database.query('SELECT * FROM atendimento WHERE id = $1', [id]);
            
            if (result.rows.length === 0) {
                return null;
            }

            return Atendimento.fromDatabase(result.rows[0]);
        } catch (error) {
            console.error('Erro ao buscar atendimento por ID:', error);
            throw new Error('Erro interno do servidor');
        }
    }

    /**
     * Cria um novo atendimento
     * @param {Object} dadosAtendimento - Dados do atendimento
     * @returns {Promise<Atendimento>} Atendimento criado
     */
    static async criar(dadosAtendimento) {
        try {
            // Criar instância do modelo para validação
            const atendimento = new Atendimento(dadosAtendimento);
            
            // Validar dados
            const validacao = atendimento.validate();
            if (!validacao.isValid) {
                throw new Error(`Dados inválidos: ${validacao.errors.join(', ')}`);
            }

            // Formatar data
            const dadosFormatados = {
                ...atendimento.toJSON(),
                data: formatDate(atendimento.data)
            };

            // Construir e executar query
            const query = buildInsertQuery(dadosFormatados);
            const result = await database.query(query.text, query.values);

            return Atendimento.fromDatabase(result.rows[0]);
        } catch (error) {
            console.error('Erro ao criar atendimento:', error);
            throw error;
        }
    }

    /**
     * Atualiza um atendimento existente
     * @param {number} id - ID do atendimento
     * @param {Object} dadosAtendimento - Novos dados do atendimento
     * @returns {Promise<Atendimento|null>} Atendimento atualizado ou null
     */
    static async atualizar(id, dadosAtendimento) {
        try {
            // Verificar se o atendimento existe
            const atendimentoExistente = await this.buscarPorId(id);
            if (!atendimentoExistente) {
                return null;
            }

            // Criar instância com novos dados
            const atendimento = new Atendimento({ ...dadosAtendimento, id });
            
            // Validar dados
            const validacao = atendimento.validate();
            if (!validacao.isValid) {
                throw new Error(`Dados inválidos: ${validacao.errors.join(', ')}`);
            }

            // Formatar data
            const dadosFormatados = {
                ...atendimento.toJSON(),
                data: formatDate(atendimento.data)
            };

            // Construir e executar query
            const query = buildUpdateQuery(id, dadosFormatados);
            const result = await database.query(query.text, query.values);

            return Atendimento.fromDatabase(result.rows[0]);
        } catch (error) {
            console.error('Erro ao atualizar atendimento:', error);
            throw error;
        }
    }

    /**
     * Remove um atendimento
     * @param {number} id - ID do atendimento
     * @returns {Promise<boolean>} True se removido com sucesso
     */
    static async remover(id) {
        try {
            const result = await database.query('DELETE FROM atendimento WHERE id = $1', [id]);
            return result.rowCount > 0;
        } catch (error) {
            console.error('Erro ao remover atendimento:', error);
            throw new Error('Erro interno do servidor');
        }
    }

    /**
     * Busca atendimentos por tipo
     * @param {string} tipo - Tipo de atendimento
     * @returns {Promise<Array>} Lista de atendimentos filtrados
     */
    static async buscarPorTipo(tipo) {
        try {
            const result = await database.query(
                'SELECT * FROM atendimento WHERE tipo = $1 ORDER BY data DESC',
                [tipo]
            );
            return result.rows.map(row => Atendimento.fromDatabase(row));
        } catch (error) {
            console.error('Erro ao buscar atendimentos por tipo:', error);
            throw new Error('Erro interno do servidor');
        }
    }

    /**
     * Estatísticas dos atendimentos
     * @returns {Promise<Object>} Estatísticas
     */
    static async obterEstatisticas() {
        try {
            const result = await database.query(`
                SELECT 
                    tipo,
                    COUNT(*) as total
                FROM atendimento 
                GROUP BY tipo
                ORDER BY total DESC
            `);
            
            // Garantir compatibilidade entre PostgreSQL e SQLite
            let rows = [];
            if (result.rows && Array.isArray(result.rows)) {
                rows = result.rows;
            } else if (Array.isArray(result)) {
                rows = result;
            } else {
                rows = [];
            }
            
            if (rows.length === 0) {
                return {
                    totalAtendimentos: 0,
                    porTipo: {
                        'Psicológico': 0,
                        'Pedagógico': 0,
                        'Assistência Social': 0
                    }
                };
            }
            
            return {
                totalAtendimentos: rows.reduce((acc, row) => acc + parseInt(row.total), 0),
                porTipo: rows.reduce((acc, row) => {
                    acc[row.tipo] = parseInt(row.total);
                    return acc;
                }, {})
            };
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            throw new Error('Erro interno do servidor');
        }
    }
}

module.exports = AtendimentoService;
