const db = require('../database/connection');

module.exports = {
    async listarPagamentos(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de pagamentos.',
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async cadastrarPagamentos(request, response) {
        try{
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de Pagamentos',
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async editarPagamentos(request, response) {
        try {
            return response.status(200).json({
               sucesso:true,
               mensagem: 'Editar pagamentos.',
               dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    async apagarPagamentos(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem:'Apagar pagamentos.',
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
}