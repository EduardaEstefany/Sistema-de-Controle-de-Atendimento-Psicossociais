/**
 * Configuração de conexão com o banco de dados PostgreSQL
 * Aplicando padrão Singleton para garantir uma única instância de conexão
 */

const { Pool } = require('pg');
require('dotenv').config();

/**
 * Classe Database implementando padrão Singleton
 * Encapsula a lógica de conexão com PostgreSQL
 */
class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }

        // Verificar se as variáveis de ambiente estão configuradas
        if (!process.env.DB_HOST || !process.env.DB_USER) {
            throw new Error('Variáveis de ambiente do PostgreSQL não configuradas');
        }

        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        Database.instance = this;
    }

    /**
     * Função pura para obter configurações do banco
     * @returns {Object} Configurações do banco de dados
     */
    static getConfig() {
        return {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
        };
    }

    /**
     * Executa query no banco de dados
     * @param {string} text - Query SQL
     * @param {Array} params - Parâmetros da query
     * @returns {Promise} Resultado da query
     */
    async query(text, params) {
        try {
            const result = await this.pool.query(text, params);
            return result;
        } catch (error) {
            console.error('Erro na execução da query:', error);
            throw error;
        }
    }

    /**
     * Fecha a conexão com o banco
     */
    async close() {
        await this.pool.end();
    }
}

module.exports = new Database();
