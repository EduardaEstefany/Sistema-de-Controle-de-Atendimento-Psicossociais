/**
 * Servidor Principal - Express.js Application
 * Implementa servidor web com middlewares e rotas modulares
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Importar rotas
const atendimentoRoutes = require('./routes/atendimentoRoutes-simple');

/**
 * Função pura para configurar middlewares CORS
 * @returns {Object} Configurações do CORS
 */
const getCorsConfig = () => ({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
});

/**
 * Classe Server - Encapsula configuração do servidor Express
 */
class Server {
    constructor(port = process.env.PORT || 3000) {
        this.app = express();
        this.port = port;
        this.configureMiddlewares();
        this.configureRoutes();
        this.configureErrorHandling();
    }

    /**
     * Configura middlewares da aplicação
     */
    configureMiddlewares() {
        // CORS
        this.app.use(cors(getCorsConfig()));

        // Body parser
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

        // Servir arquivos estáticos
        this.app.use(express.static(path.join(__dirname, '../../public')));

        // Log de requisições
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
            next();
        });
    }

    /**
     * Configura rotas da aplicação
     */
    configureRoutes() {
        // Rota de health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development'
            });
        });

        // Rotas da API
        this.app.use('/api', atendimentoRoutes);

        // Rota para servir o frontend
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../../public/index.html'));
        });

        // Rota catch-all para SPA
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../../public/index.html'));
        });
    }

    /**
     * Configura tratamento de erros
     */
    configureErrorHandling() {
        // Middleware para rotas não encontradas
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                message: 'Rota não encontrada',
                path: req.originalUrl
            });
        });

        // Middleware global de tratamento de erros
        this.app.use((error, req, res, next) => {
            console.error('Erro não tratado:', error);
            
            res.status(error.status || 500).json({
                success: false,
                message: process.env.NODE_ENV === 'production' 
                    ? 'Erro interno do servidor' 
                    : error.message,
                ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
            });
        });
    }

    /**
     * Inicia o servidor
     * @returns {Promise} Promise que resolve quando o servidor estiver rodando
     */
    start() {
        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(this.port, () => {
                    console.log(`🚀 Servidor rodando na porta ${this.port}`);
                    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
                    console.log(`📱 Acesse: http://localhost:${this.port}`);
                    resolve(this.server);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Para o servidor
     * @returns {Promise} Promise que resolve quando o servidor for parado
     */
    stop() {
        return new Promise((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    console.log('🛑 Servidor parado');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = Server;
