import { useParams, Link } from "react-router-dom";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaTrophy,
  FaUsers,
  FaMoneyBillWave,
} from "react-icons/fa";

import styles from "../styles/torneioDetalhes.module.css";

import quadra1 from "../mockup/imagens/quadraCoberta.jpg";


const torneios = [
  {
    id: 1,

    nome: "Torneio de Futevôlei Pro",

    data: "25/05 a 25/06",

    local: "Beach Tennis Arena 1",

    horario: "08:00 às 18:00",

    valor: "R$ 100,00",

    premiacao: "R$ 1.000,00",

    participantes: "Até 16 duplas",

    imagem: quadra1,

    descricao:
      "Torneio de Futevôlei Pro destinado aos participantes interessados em competir e participar de uma experiência esportiva.",
  },


  {
    id: 2,

    nome: "Torneio de Futevôlei Pro",

    data: "14/06 a 24/06",

    local: "Beach Tennis Arena 1",

    horario: "08:00 às 18:00",

    valor: "R$ 100,00",

    premiacao: "R$ 1.000,00",

    participantes: "Até 16 duplas",

    imagem: quadra1,

    descricao:
      "Torneio de Futevôlei Pro destinado aos participantes interessados em competir e participar de uma experiência esportiva.",
  },


  {
    id: 3,

    nome: "Torneio de Futevôlei Pro",

    data: "30/05 a 30/06",

    local: "Beach Tennis Arena 1",

    horario: "08:00 às 18:00",

    valor: "R$ 100,00",

    premiacao: "R$ 1.000,00",

    participantes: "Até 16 duplas",

    imagem: quadra1,

    descricao:
      "Torneio de Futevôlei Pro destinado aos participantes interessados em competir e participar de uma experiência esportiva.",
  },
];


function TorneioDetalhes() {

  const { id } = useParams();


  const torneio = torneios.find(
    (item) => item.id === Number(id)
  );


  if (!torneio) {

    return (

      <div className={styles.pageWrapper}>

        <div className={styles.container}>

          <h2>
            Torneio não encontrado
          </h2>

          <Link
            to="/torneios"
            className={styles.voltar}
          >
            ← Voltar para torneios
          </Link>

        </div>

      </div>

    );
  }


  return (

    <div className={styles.pageWrapper}>

      <main className={styles.container}>


        {/* VOLTAR */}

        <Link
          to="/torneios"
          className={styles.voltar}
        >
          ← Voltar
        </Link>


        {/* IMAGEM */}

        <img
          src={torneio.imagem}
          alt={torneio.nome}
          className={styles.imagem}
        />


        {/* NOME */}

        <h1>
          {torneio.nome}
        </h1>


        {/* INFORMAÇÕES */}

        <div className={styles.informacoes}>


          <div>

            <FaCalendarAlt />

            <span>

              <strong>
                Data
              </strong>

              {torneio.data}

            </span>

          </div>


          <div>

            <FaMapMarkerAlt />

            <span>

              <strong>
                Local
              </strong>

              {torneio.local}

            </span>

          </div>


          <div>

            <FaClock />

            <span>

              <strong>
                Horário
              </strong>

              {torneio.horario}

            </span>

          </div>


          <div>

            <FaUsers />

            <span>

              <strong>
                Participantes
              </strong>

              {torneio.participantes}

            </span>

          </div>


          <div>

            <FaTrophy />

            <span>

              <strong>
                Premiação
              </strong>

              {torneio.premiacao}

            </span>

          </div>


          <div>

            <FaMoneyBillWave />

            <span>

              <strong>
                Valor da inscrição
              </strong>

              {torneio.valor}

            </span>

          </div>


        </div>


        {/* DESCRIÇÃO */}

        <section className={styles.descricao}>

          <h2>
            Sobre o torneio
          </h2>

          <p>
            {torneio.descricao}
          </p>

        </section>


        {/* BOTÃO */}

        <Link
          to={`/inscricao/${torneio.id}`}
          className={styles.inscrever}
        >
          Inscrever-se
        </Link>


      </main>

    </div>

  );
}


export default TorneioDetalhes;