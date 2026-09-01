const db = require('../database/connection');

module.exports = {
    async listarEquipesTorneios(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de equipes de torneios.',
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
    async cadastrarEquipesTorneios(request, response) {
        try{
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de Equipes de Torneios',
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
    async editarEquipesTorneios(request, response) {
        try {
            return response.status(200).json({
               sucesso:true,
               mensagem: 'Editar equipes de torneios.',
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
    async apagarEquipesTorneios(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem:'Apagar equipes de torneios.',
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