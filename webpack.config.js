/**
 * Configuração do Webpack para empacotamento do frontend
 * Implementa build moderno com otimizações
 */

const path = require('path');

module.exports = {
    // Ponto de entrada da aplicação
    entry: './src/frontend/index.js',
    
    // Configuração de saída
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'bundle.js',
        clean: true, // Limpa o diretório de saída antes de cada build
    },
    
    // Modo de desenvolvimento ou produção
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    
    // Source maps para debugging
    devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
    
    // Configuração do module
    module: {
        rules: [
            {
                // Processamento de arquivos JavaScript
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        cacheDirectory: true,
                    }
                }
            },
            {
                // Processamento de arquivos CSS
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                // Processamento de arquivos de imagem
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext][query]'
                }
            },
            {
                // Processamento de fontes
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext][query]'
                }
            }
        ]
    },
    
    // Resolução de módulos
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src/frontend'),
            '@components': path.resolve(__dirname, 'src/frontend/components'),
            '@utils': path.resolve(__dirname, 'src/frontend/utils'),
            '@services': path.resolve(__dirname, 'src/frontend/services')
        }
    },
    
    // Configuração do servidor de desenvolvimento
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 8080,
        hot: true,
        open: true,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false
            }
        }
    },
    
    // Otimizações
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                }
            }
        }
    },
    
    // Performance hints
    performance: {
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};
