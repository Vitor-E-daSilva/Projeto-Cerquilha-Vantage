import { useState } from "react";
import useAlunos from "../../hooks/useAlunos";
import styles from "./Dashboard.module.css";
// Importações do Recharts
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend 
} from "recharts";

function Dashboard() {
  const { carregando, erro, metricas } = useAlunos();
  const [abaAtiva, setAbaAtiva] = useState("geral"); 

  const CORES_TURNOS = {
    "Manhã": "#3b82f6",
    "Tarde": "#f59e0b",
    "Noite": "#8b5cf6",
    "Não Informado": "#9ca3af"
  };

  // Se estiver carregando OU se a métrica ainda for nula, mostra a tela de carregamento antes de tentar ler qualquer coisa!
  if (carregando || !metricas) {
    return <div className={styles.loadingState}>Calculando métricas da frota...</div>;
  }

  if (erro) {
    return <div className={styles.emptyState}>Ocorreu um problema ao carregar as métricas: {erro}</div>;
  }

  // AGORA É SEGURO LER! Pois já garantimos que "metricas" existe logo acima.
  // O banco já manda o array prontinho!
  const dadosTurno = metricas?.alunosPorTurno || [];
  const dadosTurmas = metricas?.alunosPorTurma || [];

  return (
    <div className={styles.dashboardContainer}>

      <header className={styles.header}>
        <h1>Dashboard Analítico</h1>
        <p>Acompanhamento em tempo real da alocação de equipamentos por turmas e turnos.</p>
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

      {/* =========================================
          ABA 1: VISÃO GERAL
      ========================================= */}
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
            
            {/* Gráfico de Rosca - Distribuição por Turno */}
            <div className={styles.chartCard}>
              <h2>Distribuição por Turno</h2>
              {dadosTurno.length > 0 ? (
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dadosTurno}
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {dadosTurno.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CORES_TURNOS[entry.name] || "#9ca3af"} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} Alunos`, 'Total']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className={styles.emptyState}>Nenhum dado de turno disponível.</div>
              )}
            </div>

            {/* Status da Frota (Medidor Simples) */}
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

      {/* =========================================
          ABA 2: ANÁLISE POR TURMA
      ========================================= */}
      {abaAtiva === "turmas" && (
        <div className={styles.tabContent}>
          <div className={styles.chartCard}>
            <h2>Densidade de Alunos por Turma</h2>
            
            {dadosTurmas.length > 0 ? (
              <div style={{ width: '100%', height: '400px', marginTop: '20px' }}>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={dadosTurmas}
                    margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
                  >
                    <XAxis 
                      dataKey="nome" 
                      tick={{ fill: 'var(--text)' }} 
                      tickMargin={10}
                    />
                    <YAxis 
                      tick={{ fill: 'var(--text)' }} 
                      allowDecimals={false} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{ fill: 'var(--accent-bg)', opacity: 0.4 }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value) => [value, "Alunos"]}
                    />
                    <Bar 
                      dataKey="totalAlunos" 
                      fill="var(--accent)" 
                      radius={[6, 6, 0, 0]} 
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className={styles.emptyState}>Nenhuma turma cadastrada no sistema.</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;