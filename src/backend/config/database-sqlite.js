/**
 * Configuração de conexão com SQLite (alternativa para demonstração)
 * Aplicando padrão Singleton para garantir uma única instância de conexão
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

/**
 * Classe Database implementando padrão Singleton para SQLite
 * Encapsula a lógica de conexão com SQLite
 */
class DatabaseSQLite {
    constructor() {
        if (DatabaseSQLite.instance) {
            return DatabaseSQLite.instance;
        }

        // Garantir que o diretório existe
        const dataDir = path.join(__dirname, '../../../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const dbPath = path.join(dataDir, 'atendimentos.db');
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Erro ao conectar com SQLite:', err);
            } else {
                console.log('✅ Conectado ao banco SQLite');
            }
        });

        DatabaseSQLite.instance = this;
    }

    /**
     * Função pura para obter configurações do banco
     * @returns {Object} Configurações do banco de dados
     */
    static getConfig() {
        return {
            type: 'sqlite',
            database: 'atendimentos.db',
            path: path.join(__dirname, '../../data/')
        };
    }

    /**
     * Executa query no banco de dados
     * @param {string} text - Query SQL
     * @param {Array} params - Parâmetros da query
     * @returns {Promise} Resultado da query
     */
    async query(text, params = []) {
        return new Promise((resolve, reject) => {
            // Adaptar sintaxe PostgreSQL para SQLite
            let sqliteQuery = text
                .replace(/SERIAL PRIMARY KEY/g, 'INTEGER PRIMARY KEY AUTOINCREMENT')
                .replace(/\$(\d+)/g, '?'); // Substituir $1, $2... por ?

            if (text.includes('RETURNING')) {
                // SQLite não suporta RETURNING, então fazemos em duas etapas
                const insertQuery = sqliteQuery.replace(/ RETURNING \*/, '');
                
                this.db.run(insertQuery, params, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        // Buscar o registro inserido
                        const selectQuery = 'SELECT * FROM atendimento WHERE id = ?';
                        DatabaseSQLite.instance.db.get(selectQuery, [this.lastID], (err, row) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({ rows: [row], rowCount: 1 });
                            }
                        });
                    }
                });
            } else if (text.toUpperCase().includes('SELECT') && text.toUpperCase().includes('GROUP BY')) {
                // Queries de estatísticas que retornam múltiplas linhas
                this.db.all(sqliteQuery, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ rows, rowCount: rows.length });
                    }
                });
            } else if (text.toUpperCase().startsWith('SELECT')) {
                this.db.all(sqliteQuery, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ rows, rowCount: rows.length });
                    }
                });
            } else if (text.toUpperCase().startsWith('UPDATE')) {
                this.db.run(sqliteQuery, params, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        if (this.changes > 0) {
                            // Buscar o registro atualizado
                            const id = params[params.length - 1]; // ID é o último parâmetro
                            const selectQuery = 'SELECT * FROM atendimento WHERE id = ?';
                            DatabaseSQLite.instance.db.get(selectQuery, [id], (err, row) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve({ rows: [row], rowCount: 1 });
                                }
                            });
                        } else {
                            resolve({ rows: [], rowCount: 0 });
                        }
                    }
                });
            } else {
                this.db.run(sqliteQuery, params, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ rowCount: this.changes || 1 });
                    }
                });
            }
        });
    }

    /**
     * Fecha a conexão com o banco
     */
    async close() {
        return new Promise((resolve) => {
            this.db.close((err) => {
                if (err) {
                    console.error('Erro ao fechar banco:', err);
                } else {
                    console.log('🔌 Conexão com banco fechada');
                }
                resolve();
            });
        });
    }
}

module.exports = new DatabaseSQLite();
