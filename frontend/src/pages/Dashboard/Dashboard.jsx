import { useState } from "react";
import useAlunos from "../../hooks/useAlunos";
import styles from "./Dashboard.module.css";
// Importações do Recharts para desenhar os gráficos
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend 
} from "recharts";

function Dashboard() {
  const { carregando, erro, metricas } = useAlunos();
  const [abaAtiva, setAbaAtiva] = useState("geral"); // 'geral' | 'turmas'

  // Prepara as cores para o gráfico de rosca (Turnos)
  const CORES_TURNOS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"];

  // Formata os dados de turno do objeto para o array exigido pelo Recharts
  const dadosTurno = metricas?.alunosPorTurno 
    ? Object.keys(metricas.alunosPorTurno).map((chave) => ({
        name: chave,
        value: metricas.alunosPorTurno[chave],
      }))
    : [];

  if (carregando && !metricas) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando dados do Dashboard...</div>;
  }

  if (erro) {
    return <div className={styles.emptyState}>Erro ao carregar métricas: {erro}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>

      <header className={styles.header}>
        <h1>Dashboard Analítico</h1>
        <p>Acompanhamento em tempo real da alocação de equipamentos.</p>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s ease' }}>
          
          {/* Grid de KPIs (Métricas Principais) */}
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

          {/* Gráficos da Visão Geral */}
          <div className={styles.chartsGrid}>
            
            {/* Gráfico de Rosca - Distribuição por Turno */}
            <div className={styles.chartCard}>
              <h2>Distribuição por Turno</h2>
              {dadosTurno.length > 0 ? (
                <div className={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosTurno}
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {dadosTurno.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CORES_TURNOS[index % CORES_TURNOS.length]} />
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
            <div className={styles.chartCard} style={{ justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ marginBottom: '8px' }}>Capacidade do Inventário</h2>
                <p style={{ color: 'var(--text)', marginBottom: '30px' }}>Ocupação atual dos {metricas.limiteNotebooks} notebooks.</p>
                
                <div style={{ width: '100%', backgroundColor: 'var(--border)', height: '24px', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${metricas.taxaOcupacao}%`, 
                    backgroundColor: metricas.taxaOcupacao > 90 ? '#ef4444' : '#8b5cf6', 
                    height: '100%', 
                    transition: 'width 1s ease-out' 
                  }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '14px', color: 'var(--text-h)', fontWeight: '500' }}>
                  <span>0%</span>
                  <span>{metricas.taxaOcupacao}% Utilizado</span>
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
        <div className={styles.chartCard} style={{ animation: 'fadeIn 0.3s ease' }}>
          <h2>Alunos Alocados por Turma</h2>
          
          {metricas?.alunosPorTurma && metricas.alunosPorTurma.length > 0 ? (
            <div className={styles.chartWrapper} style={{ minHeight: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricas.alunosPorTurma}
                  margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
                >
                  <XAxis 
                    dataKey="nome" 
                    tick={{ fill: 'var(--text)' }} 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                  />
                  <YAxis tick={{ fill: 'var(--text)' }} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'var(--accent-bg)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="totalAlunos" 
                    name="Qtd. Alunos" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={styles.emptyState}>Nenhuma turma cadastrada ou com alunos.</div>
          )}
        </div>
      )}

    </div>
  );
}

export default Dashboard;