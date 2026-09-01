const db = require('../database/connection');

module.exports = {
    async listarQuadras(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de quadras.',
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
    async cadastrarQuadras(request, response) {
        try{
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de Quadras',
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
    async editarQuadras(request, response) {
        try {
            return response.status(200).json({
               sucesso:true,
               mensagem: 'Editar quadras.',
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
    async apagarQuadras(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem:'Apagar quadras.',
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