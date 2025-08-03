/**
 * Sistema de Controle de Atendimentos Psicossociais - Frontend JavaScript
 * Implementa AJAX, programação funcional e orientada a objetos
 */

// Configurações da API
const API_CONFIG = {
    baseURL: '/api',
    endpoints: {
        atendimentos: '/atendimentos',
        atendimento: '/atendimento',
        estatisticas: '/atendimentos/estatisticas'
    }
};

/**
 * Funções puras para manipulação de dados
 */

// Função pura para formatar data
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

// Função pura para capitalizar primeira letra
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Função pura para sanitizar HTML
const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// Função pura para obter classe CSS do badge de tipo
const getBadgeClass = (tipo) => {
    const classes = {
        'Psicológico': 'badge-psicologico',
        'Pedagógico': 'badge-pedagogico',
        'Assistência Social': 'badge-assistencia'
    };
    return classes[tipo] || 'badge-psicologico';
};

// Função pura para truncar texto
const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

/**
 * Classe para gerenciamento de API - AJAX com orientação a objetos
 */
class ApiService {
    /**
     * Faz requisição HTTP usando fetch
     * @param {string} url - URL da requisição
     * @param {Object} options - Opções da requisição
     * @returns {Promise} Promise com a resposta
     */
    static async request(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, finalOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    /**
     * Lista todos os atendimentos
     * @returns {Promise<Array>} Lista de atendimentos
     */
    static async listarAtendimentos() {
        const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.atendimentos}`;
        const response = await this.request(url);
        return response.data;
    }

    /**
     * Busca atendimento por ID
     * @param {number} id - ID do atendimento
     * @returns {Promise<Object>} Atendimento encontrado
     */
    static async buscarAtendimento(id) {
        const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.atendimento}/${id}`;
        const response = await this.request(url);
        return response.data;
    }

    /**
     * Cria novo atendimento
     * @param {Object} dados - Dados do atendimento
     * @returns {Promise<Object>} Atendimento criado
     */
    static async criarAtendimento(dados) {
        const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.atendimento}`;
        const response = await this.request(url, {
            method: 'POST',
            body: JSON.stringify(dados)
        });
        return response.data;
    }

    /**
     * Atualiza atendimento
     * @param {number} id - ID do atendimento
     * @param {Object} dados - Novos dados do atendimento
     * @returns {Promise<Object>} Atendimento atualizado
     */
    static async atualizarAtendimento(id, dados) {
        const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.atendimento}/${id}`;
        const response = await this.request(url, {
            method: 'PUT',
            body: JSON.stringify(dados)
        });
        return response.data;
    }

    /**
     * Remove atendimento
     * @param {number} id - ID do atendimento
     * @returns {Promise<boolean>} True se removido com sucesso
     */
    static async removerAtendimento(id) {
        const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.atendimento}/${id}`;
        await this.request(url, { method: 'DELETE' });
        return true;
    }

    /**
     * Obtém estatísticas
     * @returns {Promise<Object>} Estatísticas dos atendimentos
     */
    static async obterEstatisticas() {
        const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.estatisticas}`;
        const response = await this.request(url);
        return response.data;
    }
}

/**
 * Classe para gerenciamento da interface - UI Manager
 */
class UIManager {
    constructor() {
        this.currentTab = 'dashboard';
        this.editingId = null;
        this.init();
    }

    /**
     * Inicializa a interface
     */
    init() {
        this.bindEvents();
        this.loadInitialData();
        this.setCurrentDate();
    }

    /**
     * Vincula eventos aos elementos
     */
    bindEvents() {
        // Navegação por tabs
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Formulário de novo atendimento
        const formAtendimento = document.getElementById('form-atendimento');
        formAtendimento.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(e.target);
        });

        // Botão de atualizar lista
        document.getElementById('btn-atualizar').addEventListener('click', () => {
            this.loadAtendimentos();
        });

        // Filtro por tipo
        document.getElementById('filtro-tipo').addEventListener('change', (e) => {
            this.filterAtendimentos(e.target.value);
        });

        // Modal de edição
        this.bindModalEvents();

        // Toast
        document.getElementById('toast-close').addEventListener('click', () => {
            this.hideToast();
        });
    }

    /**
     * Vincula eventos do modal
     */
    bindModalEvents() {
        const modal = document.getElementById('modal-editar');
        const btnSalvar = document.getElementById('btn-salvar-edicao');
        const btnCancelar = document.getElementById('btn-cancelar-edicao');
        const btnClose = modal.querySelector('.modal-close');

        btnSalvar.addEventListener('click', () => this.handleEditSubmit());
        btnCancelar.addEventListener('click', () => this.hideModal());
        btnClose.addEventListener('click', () => this.hideModal());

        // Fechar modal clicando fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal();
            }
        });
    }

    /**
     * Troca de tab
     * @param {string} tabName - Nome da tab
     */
    switchTab(tabName) {
        // Atualizar botões
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Atualizar conteúdo
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;

        // Carregar dados específicos da tab
        if (tabName === 'lista-atendimentos') {
            this.loadAtendimentos();
        } else if (tabName === 'dashboard') {
            this.loadEstatisticas();
        }
    }

    /**
     * Define data atual no campo de data
     */
    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('data').value = today;
    }

    /**
     * Carrega dados iniciais
     */
    async loadInitialData() {
        try {
            await this.loadEstatisticas();
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            this.showToast('Erro ao carregar dados iniciais', 'error');
        }
    }

    /**
     * Carrega estatísticas do dashboard
     */
    async loadEstatisticas() {
        try {
            const stats = await ApiService.obterEstatisticas();
            
            document.getElementById('total-atendimentos').textContent = stats.totalAtendimentos;
            document.getElementById('total-psicologico').textContent = stats.porTipo['Psicológico'] || 0;
            document.getElementById('total-pedagogico').textContent = stats.porTipo['Pedagógico'] || 0;
            document.getElementById('total-assistencia').textContent = stats.porTipo['Assistência Social'] || 0;
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            this.showToast('Erro ao carregar estatísticas', 'error');
        }
    }

    /**
     * Carrega lista de atendimentos
     */
    async loadAtendimentos() {
        const tbody = document.getElementById('tbody-atendimentos');
        const loading = document.getElementById('loading');
        const emptyState = document.getElementById('empty-state');

        try {
            // Mostrar loading
            loading.classList.remove('hidden');
            tbody.innerHTML = '';
            emptyState.classList.add('hidden');

            const atendimentos = await ApiService.listarAtendimentos();

            // Esconder loading
            loading.classList.add('hidden');

            if (atendimentos.length === 0) {
                emptyState.classList.remove('hidden');
                return;
            }

            this.renderAtendimentos(atendimentos);
        } catch (error) {
            console.error('Erro ao carregar atendimentos:', error);
            loading.classList.add('hidden');
            this.showToast('Erro ao carregar atendimentos', 'error');
        }
    }

    /**
     * Renderiza lista de atendimentos na tabela
     * @param {Array} atendimentos - Lista de atendimentos
     */
    renderAtendimentos(atendimentos) {
        const tbody = document.getElementById('tbody-atendimentos');
        
        // Função pura para criar HTML de uma linha
        const createRowHTML = (atendimento) => `
            <tr>
                <td>${atendimento.id}</td>
                <td>${escapeHtml(atendimento.nome)}</td>
                <td>${escapeHtml(atendimento.profissional)}</td>
                <td>${formatDate(atendimento.data)}</td>
                <td>
                    <span class="badge ${getBadgeClass(atendimento.tipo)}">
                        ${atendimento.tipo}
                    </span>
                </td>
                <td class="observacoes" title="${escapeHtml(atendimento.observacoes || '')}">
                    ${escapeHtml(truncateText(atendimento.observacoes))}
                </td>
                <td class="acoes">
                    <button class="btn btn-sm btn-primary" onclick="app.editAtendimento(${atendimento.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteAtendimento(${atendimento.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;

        tbody.innerHTML = atendimentos.map(createRowHTML).join('');
    }

    /**
     * Filtra atendimentos por tipo
     * @param {string} tipo - Tipo de atendimento
     */
    filterAtendimentos(tipo) {
        const rows = document.querySelectorAll('#tbody-atendimentos tr');
        
        rows.forEach(row => {
            if (!tipo) {
                row.style.display = '';
            } else {
                const tipoCell = row.querySelector('.badge');
                const tipoText = tipoCell ? tipoCell.textContent.trim() : '';
                row.style.display = tipoText === tipo ? '' : 'none';
            }
        });
    }

    /**
     * Manipula submit do formulário
     * @param {HTMLFormElement} form - Formulário
     */
    async handleFormSubmit(form) {
        try {
            const formData = new FormData(form);
            const dados = Object.fromEntries(formData.entries());

            await ApiService.criarAtendimento(dados);
            
            this.showToast('Atendimento cadastrado com sucesso!', 'success');
            form.reset();
            this.setCurrentDate();
            
            // Atualizar estatísticas e lista se necessário
            await this.loadEstatisticas();
            if (this.currentTab === 'lista-atendimentos') {
                await this.loadAtendimentos();
            }
        } catch (error) {
            console.error('Erro ao criar atendimento:', error);
            this.showToast(`Erro ao cadastrar atendimento: ${error.message}`, 'error');
        }
    }

    /**
     * Edita um atendimento
     * @param {number} id - ID do atendimento
     */
    async editAtendimento(id) {
        try {
            const atendimento = await ApiService.buscarAtendimento(id);
            this.showEditModal(atendimento);
        } catch (error) {
            console.error('Erro ao buscar atendimento:', error);
            this.showToast('Erro ao carregar dados do atendimento', 'error');
        }
    }

    /**
     * Mostra modal de edição
     * @param {Object} atendimento - Dados do atendimento
     */
    showEditModal(atendimento) {
        this.editingId = atendimento.id;
        
        document.getElementById('edit-id').value = atendimento.id;
        document.getElementById('edit-nome').value = atendimento.nome;
        document.getElementById('edit-profissional').value = atendimento.profissional;
        document.getElementById('edit-data').value = atendimento.data;
        document.getElementById('edit-tipo').value = atendimento.tipo;
        document.getElementById('edit-observacoes').value = atendimento.observacoes || '';
        
        const modal = document.getElementById('modal-editar');
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('show'), 10);
    }

    /**
     * Esconde modal de edição
     */
    hideModal() {
        const modal = document.getElementById('modal-editar');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.add('hidden');
            this.editingId = null;
        }, 300);
    }

    /**
     * Manipula submit da edição
     */
    async handleEditSubmit() {
        try {
            const form = document.getElementById('form-editar');
            const formData = new FormData(form);
            const dados = Object.fromEntries(formData.entries());
            
            await ApiService.atualizarAtendimento(this.editingId, dados);
            
            this.showToast('Atendimento atualizado com sucesso!', 'success');
            this.hideModal();
            
            // Atualizar dados
            await this.loadEstatisticas();
            if (this.currentTab === 'lista-atendimentos') {
                await this.loadAtendimentos();
            }
        } catch (error) {
            console.error('Erro ao atualizar atendimento:', error);
            this.showToast(`Erro ao atualizar atendimento: ${error.message}`, 'error');
        }
    }

    /**
     * Remove um atendimento
     * @param {number} id - ID do atendimento
     */
    async deleteAtendimento(id) {
        if (!confirm('Tem certeza que deseja remover este atendimento?')) {
            return;
        }

        try {
            await ApiService.removerAtendimento(id);
            
            this.showToast('Atendimento removido com sucesso!', 'success');
            
            // Atualizar dados
            await this.loadEstatisticas();
            if (this.currentTab === 'lista-atendimentos') {
                await this.loadAtendimentos();
            }
        } catch (error) {
            console.error('Erro ao remover atendimento:', error);
            this.showToast(`Erro ao remover atendimento: ${error.message}`, 'error');
        }
    }

    /**
     * Mostra toast de notificação
     * @param {string} message - Mensagem
     * @param {string} type - Tipo (success, error, warning, info)
     */
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageEl = document.getElementById('toast-message');
        
        // Limpar classes anteriores
        toast.className = 'toast';
        toast.classList.add(type);
        
        messageEl.textContent = message;
        
        toast.classList.add('show');
        
        // Auto-hide após 5 segundos
        setTimeout(() => {
            this.hideToast();
        }, 5000);
    }

    /**
     * Esconde toast
     */
    hideToast() {
        const toast = document.getElementById('toast');
        toast.classList.remove('show');
    }
}

/**
 * Inicialização da aplicação
 */
document.addEventListener('DOMContentLoaded', () => {
    // Criar instância global da aplicação
    window.app = new UIManager();
    
    console.log('🚀 Sistema de Controle de Atendimentos Psicossociais iniciado!');
});
