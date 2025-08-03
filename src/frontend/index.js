/**
 * Ponto de entrada do frontend para Webpack
 * Este arquivo será processado pelo Webpack para gerar o bundle
 */

// Importar CSS principal
import '../../public/css/style.css';

// Importar módulos JavaScript
import '../../public/js/app.js';

// Log de inicialização
console.log('🎯 Frontend bundle carregado via Webpack!');

// Exportar para uso global se necessário
export default {
    version: '1.0.0',
    name: 'Sistema de Controle de Atendimentos Psicossociais'
};
