/**
 * Modelo Atendimento - Representa um atendimento psicossocial
 * Implementa padrões de Orientação a Objetos com encapsulamento
 */

/**
 * Funções puras para validação de dados
 */
const validateNome = (nome) => typeof nome === 'string' && nome.trim().length >= 2;
const validateProfissional = (profissional) => typeof profissional === 'string' && profissional.trim().length >= 2;
const validateData = (data) => !isNaN(Date.parse(data));
const validateTipo = (tipo) => ['Psicológico', 'Pedagógico', 'Assistência Social'].includes(tipo);

/**
 * Função pura para sanitizar strings
 * @param {string} str - String a ser sanitizada
 * @returns {string} String sanitizada
 */
const sanitizeString = (str) => {
    return typeof str === 'string' ? str.trim() : '';
};

/**
 * Classe Atendimento - Modelo de dados para atendimentos
 */
class Atendimento {
    /**
     * Construtor da classe Atendimento
     * @param {Object} dados - Dados do atendimento
     */
    constructor(dados = {}) {
        this._id = dados.id || null;
        this._nome = sanitizeString(dados.nome);
        this._profissional = sanitizeString(dados.profissional);
        this._data = dados.data;
        this._tipo = dados.tipo;
        this._observacoes = sanitizeString(dados.observacoes);
    }

    // Getters - Encapsulamento dos dados
    get id() { return this._id; }
    get nome() { return this._nome; }
    get profissional() { return this._profissional; }
    get data() { return this._data; }
    get tipo() { return this._tipo; }
    get observacoes() { return this._observacoes; }

    // Setters com validação
    set nome(value) {
        if (!validateNome(value)) {
            throw new Error('Nome deve ter pelo menos 2 caracteres');
        }
        this._nome = sanitizeString(value);
    }

    set profissional(value) {
        if (!validateProfissional(value)) {
            throw new Error('Profissional deve ter pelo menos 2 caracteres');
        }
        this._profissional = sanitizeString(value);
    }

    set data(value) {
        if (!validateData(value)) {
            throw new Error('Data inválida');
        }
        this._data = value;
    }

    set tipo(value) {
        if (!validateTipo(value)) {
            throw new Error('Tipo deve ser: Psicológico, Pedagógico ou Assistência Social');
        }
        this._tipo = value;
    }

    set observacoes(value) {
        this._observacoes = sanitizeString(value);
    }

    /**
     * Valida todos os dados do atendimento
     * @returns {Object} Resultado da validação
     */
    validate() {
        const errors = [];

        if (!validateNome(this._nome)) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }

        if (!validateProfissional(this._profissional)) {
            errors.push('Profissional deve ter pelo menos 2 caracteres');
        }

        if (!validateData(this._data)) {
            errors.push('Data inválida');
        }

        if (!validateTipo(this._tipo)) {
            errors.push('Tipo deve ser: Psicológico, Pedagógico ou Assistência Social');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Converte o objeto para formato JSON limpo
     * @returns {Object} Objeto serializado
     */
    toJSON() {
        return {
            id: this._id,
            nome: this._nome,
            profissional: this._profissional,
            data: this._data,
            tipo: this._tipo,
            observacoes: this._observacoes
        };
    }

    /**
     * Cria uma instância a partir de dados do banco
     * @param {Object} row - Linha do banco de dados
     * @returns {Atendimento} Nova instância
     */
    static fromDatabase(row) {
        return new Atendimento({
            id: row.id,
            nome: row.nome,
            profissional: row.profissional,
            data: row.data,
            tipo: row.tipo,
            observacoes: row.observacoes
        });
    }
}

module.exports = {
    Atendimento,
    validateNome,
    validateProfissional,
    validateData,
    validateTipo,
    sanitizeString
};
