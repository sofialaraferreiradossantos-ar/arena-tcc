const db = require('../database/connection');

module.exports = {
    async listarAgendamentos(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de agendamentos.',
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
    async cadastrarAgendamentos(request, response) {
        try{
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de Agendamentos',
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
    async editarAgendamentos(request, response) {
        try {
            return response.status(200).json({
               sucesso:true,
               mensagem: 'Editar agendamentos.',
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
    async apagarAgendamentos(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem:'Apagar agendamentos.',
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