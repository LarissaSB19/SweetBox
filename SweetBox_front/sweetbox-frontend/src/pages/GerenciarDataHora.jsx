import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GerenciarHorarios() {

    const [horarios, setHorarios] = useState([]);
    const [data, setData] = useState("");
    const [hora, setHora] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        carregarHorarios();
    }, []);

    async function carregarHorarios() {

        try {

            const response = await fetch(
                "http://localhost:5179/api/HorarioBloqueado"
            );

            const data = await response.json();

            setHorarios(data);

        } catch (erro) {
            console.error(erro);
        }
    }

    async function bloquearHorario() {

        if (!data) {
            alert("Selecione uma data!");
            return;
        }

        try {

            if (!hora) {

                const horariosDoDia = gerarHorarios();

                for (const horario of horariosDoDia) {

                    const novoHorario = {
                        data: data + "T00:00:00",
                        hora: horario + ":00"
                    };

                    await fetch(
                        "http://localhost:5179/api/HorarioBloqueado",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(novoHorario)
                        }
                    );
                }

                alert("Dia inteiro bloqueado!");

            } else {

                const novoHorario = {
                    data: data + "T00:00:00",
                    hora: hora + ":00"
                };

                const response = await fetch(
                    "http://localhost:5179/api/HorarioBloqueado",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(novoHorario)
                    }
                );

                if (!response.ok) {
                    throw new Error("Erro ao bloquear horário");
                }

                alert("Horário bloqueado!");
            }

            setData("");
            setHora("");

            carregarHorarios();

        } catch (erro) {

            console.error(erro);
            alert("Erro ao bloquear");
        }
    }

    async function removerHorario(id) {

        try {

            const response = await fetch(
                `http://localhost:5179/api/HorarioBloqueado/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao remover");
            }

            carregarHorarios();

        } catch (erro) {
            console.error(erro);
        }
    }

    function formatarData(dataString) {

        const data = new Date(dataString);

        return data.toLocaleDateString("pt-BR");
    }

    function gerarHorarios() {

        const horarios = [];

        for (let hora = 7; hora <= 20; hora++) {

            horarios.push(`${String(hora).padStart(2, "0")}:00`);

            if (hora !== 20) {
                horarios.push(`${String(hora).padStart(2, "0")}:30`);
            }
        }

        return horarios;
    }

    function getMinDate() {

        const hoje = new Date();

        hoje.setDate(hoje.getDate() + 5);

        return hoje.toISOString().split("T")[0];
    }


    return (
        <div style={styles.container}>
            <button
                type="button"
                id="btnVoltar"
                className="btn btn-sm"
                style={{
                    backgroundColor: "#ccac99",
                    display: "block",
                    marginRight: "auto",
                    marginBottom: "20px"
                }}
                onClick={() => navigate(-1)}
            >
                Voltar
            </button>

            <h1 style={styles.titulo}>
                📅 Gerenciar Horários
            </h1>

            <div style={styles.card}>

                <div
                    style={styles.dataContainer}
                    onClick={() =>
                        document.getElementById("dataEntrega").showPicker()
                    }
                >

                <input
                    id="dataEntrega"
                    type="date"
                    value={data}
                    min={getMinDate()}
                    onChange={(e) => setData(e.target.value)}
                    onKeyDown={(e) => e.preventDefault()}
                    onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                    style={styles.inputData}
                />

                </div>

                    <div style={styles.horariosContainer}>

                        {gerarHorarios().map((horario, index) => {

                            const bloqueado = horarios.some((item) => {

                                const dataBloqueada = item.data.split("T")[0];
                                const horaBloqueada = item.hora.substring(0, 5);

                                return (
                                    dataBloqueada === data &&
                                    horaBloqueada === horario
                                );
                            });

                            return (

                                <button
                                    key={index}
                                    disabled={bloqueado}
                                    onClick={() => setHora(horario)}
                                    style={{
                                        ...styles.horarioBtn,

                                        ...(hora === horario
                                            ? styles.horarioSelecionado
                                            : {}),

                                        ...(bloqueado
                                            ? styles.horarioBloqueado
                                            : {})
                                    }}
                                >
                                    {bloqueado
                                        ? `${horario} 🚫`
                                        : horario}
                                </button>

                            );
                        })}

                    </div>

                <button
                    style={{
                        ...styles.botao,
                        opacity: !data ? 0.6 : 1,
                        cursor: !data ? "not-allowed" : "pointer"
                    }}
                    disabled={!data}
                    onClick={bloquearHorario}
                >
                    🚫 Bloquear Horário ou Dia
                </button>

            </div>

            <div style={styles.lista}>

                <h2 style={styles.subtitulo}>
                    Horários Bloqueados
                </h2>

                {horarios.length === 0 && (
                    <p style={styles.vazio}>
                        Nenhum horário bloqueado.
                    </p>
                )}

                {Object.values(

                    [...horarios]

                        .sort((a, b) => {

                            const dataHoraA = new Date(
                                `${a.data.split("T")[0]}T${a.hora}`
                            );

                            const dataHoraB = new Date(
                                `${b.data.split("T")[0]}T${b.hora}`
                            );

                            return dataHoraA - dataHoraB;
                        })

                        .reduce((acc, item) => {

                            const data = item.data.split("T")[0];

                            if (!acc[data]) {
                                acc[data] = [];
                            }

                            acc[data].push(item);

                            return acc;

                        }, {})

                ).map((grupo, index) => {

                    const todosHorarios = gerarHorarios().length;

                    const diaCompletoBloqueado =
                        grupo.length >= todosHorarios;

                    return (

                        <div
                            key={index}
                            style={styles.item}
                        >

                            <div>

                                <strong>
                                    {formatarData(grupo[0].data)}
                                </strong>

                                <p style={styles.hora}>

                                    {diaCompletoBloqueado
                                        ? "🚫 Dia inteiro bloqueado"
                                        : `🕒 ${grupo
                                            .map(item => item.hora.substring(0, 5))
                                            .join(" • ")}`}

                                </p>

                            </div>

                            <button
                                style={{
                                    ...styles.remover,
                                    background: "#f3e5dc",
                                    color: "#5a3e36"
                                }}
                                onClick={() => {

                                    grupo.forEach(item => {
                                        removerHorario(item.idHorarioBloqueado);
                                    });

                                }}
                            >
                                Remover
                            </button>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}

const styles = {

    container: {
        minHeight: "100vh",
        background: "#f6eee8",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },

    titulo: {
        textAlign: "center",
        color: "#6b463c",
        marginBottom: "35px",
        fontSize: "38px",
        fontWeight: "700",
        width: "100%"
    },

    card: {
        background: "#fff",
        padding: "35px",
        borderRadius: "28px",
        marginBottom: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        width: "100%",
        maxWidth: "900px",
    },

    subtitulo: {
        color: "#6b463c",
        marginBottom: "25px",
        fontSize: "30px",
        fontWeight: "700"
    },

    inputs: {
        display: "flex",
        gap: "18px",
        marginBottom: "25px",
        flexWrap: "wrap"
    },

    input: {
        flex: 1,
        padding: "16px",
        borderRadius: "16px",
        border: "2px solid #ead9cf",
        background: "#fffaf7",
        fontSize: "16px",
        color: "#5a3e36",
        outline: "none",
        transition: "0.2s"
    },

    horariosContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
        gap: "14px",
        marginTop: "10px"
    },

    horarioBtn: {
        border: "none",
        borderRadius: "14px",
        padding: "15px 10px",
        background: "#f3e5dc",
        color: "#5a3e36",
        fontWeight: "600",
        fontSize: "15px",
        cursor: "pointer",
        transition: "0.2s",
        boxShadow: "0 3px 8px rgba(0,0,0,0.05)"
    },

    horarioSelecionado: {
        background: "#c79081",
        color: "#fff",
        transform: "scale(1.03)"
    },

    horarioBloqueado: {
        background: "#e0e0e0",
        color: "#888",
        cursor: "not-allowed",
        opacity: 0.7,
        textDecoration: "line-through"
    },

    botao: {
        width: "100%",
        padding: "16px",
        border: "none",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #c79081, #dfa579)",
        color: "#fff",
        fontWeight: "700",
        fontSize: "17px",
        cursor: "pointer",
        marginTop: "25px",
        transition: "0.2s",
        boxShadow: "0 6px 15px rgba(199,144,129,0.35)"
    },

    lista: {
        background: "#fff",
        padding: "35px",
        borderRadius: "28px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        width: "100%",
        maxWidth: "900px"
    },

    vazio: {
        color: "#888",
        textAlign: "center",
        fontSize: "15px"
    },

    item: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px",
        marginBottom: "15px",
        background: "#fffaf7",
        borderRadius: "18px",
        border: "1px solid #f1dfd6"
    },

    hora: {
        marginTop: "6px",
        color: "#777",
        fontSize: "15px"
    },

    remover: {
        border: "none",
        background: "#f3e5dc",
        color: "#5a3e36",
        padding: "12px 18px",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "0.2s"
    },

    label: {
        display: "block",
        marginBottom: "12px",
        color: "#6b463c",
        fontWeight: "600",
        fontSize: "18px"
    },

    dataContainer: {
        width: "100%",
        cursor: "pointer"
    },

    inputData: {
        width: "100%",
        padding: "18px",
        borderRadius: "18px",
        border: "2px solid #ead9cf",
        background: "#fffaf7",
        fontSize: "16px",
        color: "#5a3e36",
        outline: "none",
        marginBottom: "30px",
        boxSizing: "border-box",
        cursor: "pointer",
        boxShadow: "0 3px 10px rgba(0,0,0,0.03)"
    },
};