const db = require('../database/connection');

module.exports = {
    async listarParticipantesEquipes(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de participantes de equipe.',
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
    async cadastrarParticipantesEquipes(request, response) {
        try{
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de Participantes de Equipe',
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
    async editarParticipantesEquipes(request, response) {
        try {
            return response.status(200).json({
               sucesso:true,
               mensagem: 'Editar participantes de equipe.',
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
    async apagarParticipantesEquipes(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem:'Apagar participantes de equipes.',
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