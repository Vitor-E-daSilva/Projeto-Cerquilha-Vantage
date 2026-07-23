import { useState } from "react";
import useAlunos from "../../hooks/useAlunos";
import styles from "./Dashboard.module.css";
// Importações do Victory
import {
  VictoryPie,
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTooltip,
  VictoryTheme
} from "victory";

function Dashboard() {
  const { carregando, erro, metricas, alunos, turmas } = useAlunos();
  const [abaAtiva, setAbaAtiva] = useState("geral");
  const [buscaTurma, setBuscaTurma] = useState("");
  const [buscaAluno, setBuscaAluno] = useState("");

  // Cores para os gráficos
  const CORES_TURNOS = {
    "Manhã": "#3b82f6",
    "Tarde": "#f59e0b",
    "Noite": "#8b5cf6",
    "Não Informado": "#9ca3af"
  };

  // Checagem básica de conexão com o servidor
  if (carregando || !metricas) {
    return <div className={styles.loadingState}>Calculando métricas e gerando gráficos...</div>;
  }

  if (erro) {
    return <div className={styles.emptyState}>Ocorreu um problema ao carregar as métricas: {erro}</div>;
  }

  // PREPARAÇÃO DE DADOS PARA OS GRÁFICOS (VICTORY)

  // Cria o gráfico de pizza dos turnos
  // VictoryPie precisa do formato: { x: "Nome", y: Valor, fill: "Cor" }
  const dadosTurno = (metricas?.alunosPorTurno || []).map(d => ({
    x: d.name,
    y: d.value,
    label: `${d.name}\n(${d.value})`, // Rótulo que aparece na fatia
    fill: CORES_TURNOS[d.name] || "#9ca3af"
  }));

  // Cria o gráfico de Barras das turmas
  // VictoryBar precisa do formato: { x: "Nome", y: Valor }
  const dadosTurmas = (metricas?.alunosPorTurma || []).map(d => ({
    x: d.nome,
    y: d.totalAlunos,
    label: d.totalAlunos > 0 ? d.totalAlunos.toString() : ""
  }));

  return (
    <div className={styles.dashboardContainer}>

      <header className={styles.header}>
        <h1>Dashboard</h1>
        <p>Acompanhamento em tempo real da alocação de equipamentos e distribuição de turmas.</p>
      </header>

      {/* Navegação por Abas */}
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabBtn} ${abaAtiva === "geral" ? styles.tabBtnActive : ""}`}
          onClick={() => setAbaAtiva("geral")}
        >
          Visão Geral
        </button>
        <button
          className={`${styles.tabBtn} ${abaAtiva === "turmas" ? styles.tabBtnActive : ""}`}
          onClick={() => setAbaAtiva("turmas")}
        >
          Análise por Turma
        </button>
      </div>

      {/* VISÃO GERAL */}
      {abaAtiva === "geral" && (
        <div className={styles.tabContent}>

          {/* Grid de KPIs */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <div className={`${styles.iconContainer} ${styles.blue}`}>👥</div>
              <div className={styles.kpiInfo}>
                <h3>Total de Alunos</h3>
                <p>{metricas.totalAlunos}</p>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={`${styles.iconContainer} ${styles.red}`}>💻</div>
              <div className={styles.kpiInfo}>
                <h3>Notebooks em Uso</h3>
                <p>{metricas.notebooksEmUso}</p>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={`${styles.iconContainer} ${styles.green}`}>✔️</div>
              <div className={styles.kpiInfo}>
                <h3>Notebooks Livres</h3>
                <p>{metricas.notebooksDisponiveis}</p>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={`${styles.iconContainer} ${styles.purple}`}>📊</div>
              <div className={styles.kpiInfo}>
                <h3>Taxa de Ocupação</h3>
                <p>{metricas.taxaOcupacao}%</p>
              </div>
            </div>
          </div>

          <div className={styles.chartsGrid}>

            {/* Gráfico de Rosca (Victory Pie) */}
            <div className={styles.chartCard}>
              <h2>Distribuição por Turno</h2>
              {dadosTurno.length > 0 ? (
                <div style={{ width: '100%', height: '320px', display: 'flex', justifyContent: 'center' }}>
                  <VictoryPie
                    data={dadosTurno}
                    innerRadius={90}
                    style={{
                      data: { fill: ({ datum }) => datum.fill },
                      labels: { fontSize: 14, fill: "var(--text-h)", fontWeight: "500" }
                    }}
                    animate={{ duration: 500 }}
                  />
                </div>
              ) : (
                <div className={styles.emptyState}>Nenhum dado de turno disponível.</div>
              )}
            </div>

            {/* Status da Frota */}
            <div className={`${styles.chartCard} ${styles.centerCard}`}>
              <div>
                <h2 style={{ marginBottom: '8px' }}>Capacidade do Inventário</h2>
                <p style={{ color: 'var(--text)', marginBottom: '30px' }}>Ocupação atual dos {metricas.limiteNotebooks} notebooks.</p>

                <div style={{ width: '100%', backgroundColor: 'var(--border)', height: '24px', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${metricas.taxaOcupacao}%`,
                    backgroundColor: metricas.taxaOcupacao > 90 ? '#ef4444' : 'var(--accent)',
                    height: '100%',
                    transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '14px', color: 'var(--text-h)', fontWeight: '600' }}>
                  <span>0%</span>
                  <span style={{ color: metricas.taxaOcupacao > 90 ? '#ef4444' : 'var(--accent)' }}>
                    {metricas.taxaOcupacao}% Utilizado
                  </span>
                  <span>100%</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {abaAtiva === "turmas" && (
        <div className={styles.tabContent}>

          {/* Gráfico de Barras (Victory Bar) */}
          <div className={styles.chartCard}>
            <h2>Densidade de Alunos por Turma</h2>
            {dadosTurmas.length > 0 ? (
              <div style={{ width: '100%', height: '350px' }}>
                <VictoryChart
                  theme={VictoryTheme.material}
                  domainPadding={{ x: 40 }}
                  width={800}
                  height={350}
                >
                  <VictoryAxis
                    style={{
                      axis: { stroke: "var(--border)" },
                      tickLabels: { fill: "var(--text)", fontSize: 12, padding: 5 },
                      grid: { stroke: "transparent" }
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    style={{
                      axis: { stroke: "transparent" },
                      tickLabels: { fill: "var(--text)", fontSize: 12 },
                      grid: { stroke: "var(--border)", strokeDasharray: "4" }
                    }}
                  />
                  <VictoryBar
                    data={dadosTurmas}
                    labels={({ datum }) => datum.label}
                    labelComponent={<VictoryTooltip pointerLength={5} cornerRadius={4} />}
                    style={{
                      data: { fill: "var(--accent)", width: 35 },
                      labels: { fill: "var(--text-h)", fontSize: 12, fontWeight: "bold" }
                    }}
                    animate={{ duration: 500, onLoad: { duration: 500 } }}
                  />
                </VictoryChart>
              </div>
            ) : (
              <div className={styles.emptyState}>Nenhuma turma com dados no sistema.</div>
            )}
          </div>

          {/* Relação Detalhada de Alunos com Sistema de Pesquisa */}
          <div className={styles.chartCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <h2 style={{ marginBottom: '4px' }}>Relação Detalhada de Alunos</h2>
                <p style={{ color: 'var(--text)', fontSize: '14px', margin: 0 }}>
                  Listagem de equipamentos distribuídos segmentada por turma.
                </p>
              </div>

              {/* Controles de Pesquisa */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Pesquisar turma ou turno..."
                  value={buscaTurma}
                  onChange={(e) => setBuscaTurma(e.target.value)}
                  className={styles.searchInput}
                />
                <input
                  type="text"
                  placeholder="Pesquisar aluno por nome..."
                  value={buscaAluno}
                  onChange={(e) => setBuscaAluno(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            {(() => {
              // Lógica de Filtro em Tempo Real
              const turmasFiltradas = turmas.map(turma => {
                const alunosDaTurma = alunos.filter(a => Number(a.turmaId || a.turma_id) === Number(turma.id));

                // Filtra alunos pelo nome ou email digitado
                const alunosFiltrados = alunosDaTurma.filter(aluno =>
                  aluno.nome.toLowerCase().includes(buscaAluno.toLowerCase()) ||
                  aluno.email.toLowerCase().includes(buscaAluno.toLowerCase())
                );

                return {
                  ...turma,
                  alunosDaTurma: alunosFiltrados
                };
              }).filter(turma => {
                // Filtra turmas pelo nome da turma ou turno, OU se a turma contém alunos encontrados pela busca de alunos
                const matchTurma = turma.nome.toLowerCase().includes(buscaTurma.toLowerCase()) ||
                  turma.turno.toLowerCase().includes(buscaTurma.toLowerCase());

                // Se o usuário buscou um aluno específico, exibe apenas turmas que possuem aquele aluno correspondente
                const temAlunosMatch = turma.alunosDaTurma.length > 0;

                return matchTurma && (buscaAluno === "" ? true : temAlunosMatch);
              });

              if (turmasFiltradas.length === 0) {
                return <div className={styles.emptyState}>Nenhum resultado encontrado para a sua busca.</div>;
              }

              return (
                <div className={styles.listContainer}>
                  {turmasFiltradas.map(turma => (
                    <div key={turma.id} className={styles.turmaGroup}>
                      <div className={styles.turmaHeader}>
                        <h3>{turma.nome}</h3>
                        <span className={styles.turmaBadge}>{turma.turno}</span>
                        <span className={styles.totalBadge}>{turma.alunosDaTurma.length} Aluno(s) Exibido(s)</span>
                      </div>

                      {turma.alunosDaTurma.length > 0 ? (
                        <ul className={styles.alunosList}>
                          {turma.alunosDaTurma.map(aluno => (
                            <li key={aluno.id} className={styles.alunoItem}>
                              <div className={styles.alunoInfoBox}>
                                <span className={styles.alunoName}>{aluno.nome}</span>
                                <span className={styles.alunoEmail}>{aluno.email}</span>
                              </div>
                              <div className={styles.alunoNotebookTag}>
                                Notebook #{aluno.notebookId || aluno.notebook_numero}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div style={{ padding: '16px', fontSize: '13px', color: 'var(--text)', textAlign: 'center' }}>
                          Nenhum aluno corresponde à busca nesta turma.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}

          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;