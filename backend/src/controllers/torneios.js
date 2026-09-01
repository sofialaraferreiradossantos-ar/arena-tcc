const db = require('../database/connection');

module.exports = {
    async listarTorneios(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de torneios.',
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
    async cadastrarTorneios(request, response) {
        try{
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de Torneios',
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
    async editarTorneios(request, response) {
        try {
            return response.status(200).json({
               sucesso:true,
               mensagem: 'Editar torneios.',
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
    async apagarTorneios(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem:'Apagar torneios.',
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