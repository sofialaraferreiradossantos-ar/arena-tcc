const db = require('../database/connection');

module.exports = {
    async listarDisponibilidades(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de disponibilidades.',
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
    async cadastrarDisponibilidades(request, response) {
        try{
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de Disponibilidades',
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
    async editarDisponibilidades(request, response) {
        try {
            return response.status(200).json({
               sucesso:true,
               mensagem: 'Editar disponibilidades.',
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
    async apagarDisponibilidades(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem:'Apagar disponibilidades.',
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