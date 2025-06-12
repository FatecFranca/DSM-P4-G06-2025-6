import React, { useEffect, useState } from "react";
import {
  VictoryBar,
  VictoryLine,
  VictoryPie,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
  VictoryTooltip,
  VictoryScatter,
  VictoryVoronoiContainer,
  VictoryArea,
} from "victory";
import api from "../services/api";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    notebookData: null,
    averageUsageTime: null,
    medianUsageTime: null,
    usageTimeStdDev: null,
    unreturnedNotebooks: [],
    withdrawalsByCourse: [],
    withdrawalsByPeriod: [],
    top5LongestUsage: [],
    dailyWithdrawalsLastWeek: [],
    withdrawalForecast: [],
    normalDistribution: [],
    usageTimeSkewness: null,
    loading: true,
  });

  const chartColors = ["#2196F3", "#FF9800", "#4CAF50", "#E91E63", "#9C27B0"];

  const navigate = useNavigate();

  const clickLogout = () => {
    try {
      localStorage.removeItem("userToken");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro ao realizar o logout:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await api.get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDashboardData({
          notebookData: response.data.mostFrequentDiscipline,
          averageUsageTime: Number(response.data.averageUsageTime),
          medianUsageTime: Number(response.data.medianUsageTime),
          usageTimeStdDev: response.data.usageTimeStdDev,
          unreturnedNotebooks: response.data.unreturnedNotebooks || [],
          withdrawalsByCourse: response.data.withdrawalsByCourse || [],
          withdrawalsByPeriod: response.data.withdrawalsByPeriod || [],
          top5LongestUsage: response.data.top5LongestAverageUsage || [],
          dailyWithdrawalsLastWeek:
            response.data.dailyWithdrawalsLastWeek || [],
          withdrawalForecast: response.data.withdrawalForecast || [],
          normalDistribution: response.data.normalDistribution || [],
          usageTimeSkewness: response.data.usageTimeSkewness || null,
          loading: false,
        });
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  const filteredForecast = dashboardData.withdrawalForecast;

  if (dashboardData.loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button className="logout-button" onClick={clickLogout}>
          Sair
          <FaSignOutAlt style={{ marginRight: "5px" }} />
        </button>
      </div>

      <h1 className="title">Smartlocker Insights</h1>

      {dashboardData.notebookData && (
        <>
          {/* Tabela de notebooks não devolvidos */}
          <div className="table-container">
            <h2 className="table-title">Notebooks não devolvidos</h2>
            {dashboardData.unreturnedNotebooks.length === 0 ? (
              <p className="no-data">Nenhum notebook pendente de devolução.</p>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Notebook</th>
                      <th>Disciplina</th>
                      <th>Retirado em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.unreturnedNotebooks.map((item, index) => (
                      <tr key={index}>
                        <td>{item.device_name}</td>
                        <td>{item.discipline}</td>
                        <td>{item.checkout_datetime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="metrics-layout-3col">
            {/* Coluna 1 - Disciplina */}
            <div className="metric-col">
              <div className="metric-card disciplina-card">
                <div className="metric-content">
                  <h3>Disciplina com maior número de retiradas</h3>
                  <p className="metric-value">
                    {dashboardData.notebookData.disciplineName}
                  </p>
                  <h3>Dia da disciplina:</h3>
                  <p className="metric-value">
                    {dashboardData.notebookData.dayOfDiscipline}
                  </p>
                  <h3>Total de movimentações:</h3>
                  <p className="metric-value">
                    {dashboardData.notebookData.total}
                  </p>
                </div>
              </div>
            </div>

            {/* Coluna 2 - Métricas de tempo */}
            <div className="metric-col">
              <div className="metric-card">
                <div className="metric-content">
                  <h3>Tempo médio de uso</h3>
                  <p className="metric-value">
                    {dashboardData.averageUsageTime?.toFixed(1) || "N/A"}{" "}
                    minutos
                  </p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-content">
                  <h3>Mediana de tempo de uso</h3>
                  <p className="metric-value">
                    {dashboardData.medianUsageTime?.toFixed(1) || "N/A"} minutos
                  </p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-content">
                  <h3>Desvio padrão</h3>
                  <p className="metric-value">
                    {dashboardData.usageTimeStdDev?.standardDeviation?.toFixed(
                      1
                    ) || "N/A"}{" "}
                    minutos
                  </p>
                </div>
              </div>
            </div>

            {/* Coluna 3 - Assimetria */}
            <div className="metric-col">
              <div className="metric-card assimetria-card">
                <div className="metric-content">
                  <h3>Assimetria do Tempo de Uso</h3>
                  <p className="metric-value">
                    {dashboardData.usageTimeSkewness?.skewness?.toFixed(3) ||
                      "N/A"}
                  </p>
                  <p className="metric-description">
                    {dashboardData.usageTimeSkewness?.interpretation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-row">
            {/* Gráfico: Top 5 Notebooks por Tempo Médio de Uso */}
            {dashboardData.top5LongestUsage.length > 0 && (
              <div className="chart-container">
                <h2>Top 5 Notebooks por Tempo Médio de Uso</h2>
                <div className="chart-wrapper small-chart">
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={{ x: 30, y: 20 }}
                    padding={{ top: 20, bottom: 45, left: 90, right: 30 }}
                    responsive={true}
                    height={250}
                  >
                    <VictoryAxis
                      tickFormat={dashboardData.top5LongestUsage.map(
                        (item) => item.notebookName
                      )}
                      style={{
                        axis: { stroke: "#666" }, // Cor da linha do eixo
                        tickLabels: {
                          fontSize: 10,
                          textAnchor: "end",
                          fill: "#fff", // Cor do texto dos ticks
                          padding: 5,
                        },
                        grid: { stroke: "#666" }, // Cor da grade
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      label="Tempo de Uso (Minutos)"
                      axisLabelComponent={
                        <VictoryLabel
                          dy={25}
                          style={{
                            fill: "#e0e0e0",
                            fontSize: 12,
                            fontWeight: "bold",
                          }} // Cor do label do eixo
                        />
                      }
                      style={{
                        axis: { stroke: "#666" },
                        tickLabels: {
                          fontSize: 10,
                          fill: "#e0e0e0",
                        },
                        grid: { stroke: "#666" },
                      }}
                    />
                    <VictoryBar
                      horizontal
                      data={dashboardData.top5LongestUsage}
                      x="notebookName"
                      y="averageUsageTimeMinutes"
                      style={{
                        data: { fill: chartColors[0] },
                      }}
                      labels={({ datum }) =>
                        `${datum.averageUsageTimeMinutes.toFixed(1)} min`
                      }
                      labelComponent={
                        <VictoryTooltip
                          style={{
                            fontSize: 10,
                            fill: "#ffffff", // Cor do texto do tooltip
                          }}
                          flyoutStyle={{
                            stroke: "#333",
                            fill: "#1E1E1E", // Cor de fundo do tooltip
                          }}
                        />
                      }
                    />
                  </VictoryChart>
                </div>
              </div>
            )}

            {/* Gráfico: Distribuição Normal */}
            {dashboardData.normalDistribution.length > 0 && (
              <div className="chart-container">
                <h2>Distribuição Normal do Tempo de Uso</h2>
                <div className="chart-wrapper small-chart">
                  <VictoryChart
                    theme={VictoryTheme.material}
                    responsive={true}
                    height={250}
                  >
                    <defs>
                      <linearGradient
                        id="normalDistGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor={chartColors[0]}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor={chartColors[0]}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <VictoryArea
                      data={dashboardData.normalDistribution}
                      x="x"
                      y="y"
                      style={{
                        data: {
                          fill: "url(#normalDistGradient)",
                          fillOpacity: 0.4,
                          stroke: "transparent",
                        },
                      }}
                    />
                    <VictoryAxis
                      label="Tempo de Uso (Minutos)"
                      axisLabelComponent={
                        <VictoryLabel
                          dy={25}
                          style={{
                            fill: "#e0e0e0",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        />
                      }
                      style={{
                        axis: { stroke: "#666" },
                        tickLabels: {
                          fontSize: 10,
                          fill: "#e0e0e0",
                        },
                        grid: { stroke: "#666" },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      label="Densidade de Probabilidade"
                      axisLabelComponent={
                        <VictoryLabel
                          dy={-31}
                          style={{
                            fill: "#e0e0e0",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        />
                      }
                      style={{
                        axis: { stroke: "#666" },
                        tickLabels: {
                          fontSize: 10,
                          fill: "#e0e0e0",
                        },
                        grid: { stroke: "#666" },
                      }}
                    />
                    <VictoryLine
                      data={dashboardData.normalDistribution}
                      x="x"
                      y="y"
                      style={{
                        data: {
                          stroke: chartColors[0],
                          strokeWidth: 2,
                        },
                      }}
                    />
                  </VictoryChart>
                </div>
              </div>
            )}
          </div>

          <div className="chart-row">
            {dashboardData.normalDistribution &&
              dashboardData.normalDistribution.length > 0 && (
                <div className="chart-container">
                  <h2 className="chart-title">
                    Probabilidade Acumulada de Duração
                  </h2>
                  <div style={{ position: "relative" }}>
                    <VictoryChart
                      theme={VictoryTheme.material}
                      responsive={true}
                      height={250}
                    >
                      {/* Definição do gradiente para a área */}
                      <defs>
                        <linearGradient
                          id="probabilityGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#2196F3"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="#2196F3"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>

                      {/* Área preenchida abaixo da linha */}
                      <VictoryArea
                        data={dashboardData.normalDistribution}
                        x="x"
                        y={(datum) => datum.cumulative * 100}
                        style={{
                          data: {
                            fill: "url(#probabilityGradient)",
                            fillOpacity: 0.4,
                            stroke: "transparent",
                          },
                        }}
                        interpolation="basis"
                      />
                      {/* Y Axis (rotated -90deg) */}
                      <VictoryAxis
                        dependentAxis
                        label="Probabilidade Acumulada"
                        tickCount={8}
                        axisLabelComponent={
                          <VictoryLabel
                            angle={-90}
                            dy={-30}
                            style={{
                              fill: "#e0e0e0",
                              fontSize: 12,
                              fontWeight: "bold",
                            }}
                          />
                        }
                        tickFormat={(t) => `${t}%`}
                        style={{
                          axis: { stroke: "#666" },
                          tickLabels: { fill: "#e0e0e0", fontSize: 10 },
                          grid: { stroke: "#666" },
                        }}
                      />

                      {/* X Axis */}
                      <VictoryAxis
                        label="Tempo de Uso (Minutos)"
                        axisLabelComponent={
                          <VictoryLabel
                            dy={30}
                            style={{
                              fill: "#e0e0e0",
                              fontSize: 12,
                              fontWeight: "bold",
                            }}
                          />
                        }
                        tickValues={dashboardData.normalDistribution
                          .filter((_, index) => index % 3 === 0)
                          .map((item) => item.x)}
                        style={{
                          axis: { stroke: "#666" },
                          tickLabels: { fill: "#e0e0e0", fontSize: 10 },
                          grid: { stroke: "#666" },
                        }}
                      />

                      {/* Line Chart */}
                      <VictoryLine
                        data={dashboardData.normalDistribution}
                        x="x"
                        y={(datum) => datum.cumulative * 100}
                        style={{
                          data: {
                            stroke: "#2196F3",
                            strokeWidth: 2,
                          },
                        }}
                        interpolation="basis"
                      />

                      <VictoryScatter
                        data={dashboardData.normalDistribution}
                        x="x"
                        y={(datum) => datum.cumulative * 100}
                        size={2}
                        style={{
                          data: {
                            fill: "#2196F3",
                          },
                        }}
                      />
                    </VictoryChart>
                  </div>
                </div>
              )}

            {/* Gráfico: Retiradas por Curso */}
            {dashboardData.withdrawalsByCourse.length > 0 && (
              <div className="chart-container">
                <h2>Retiradas por Curso</h2>
                <div className="chart-wrapper small-chart">
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={60}
                    responsive={true}
                    height={250}
                    categories={{
                      x: dashboardData.withdrawalsByCourse.map(
                        (item) => item.course
                      ),
                    }}
                  >
                    <VictoryAxis
                      label="Cursos"
                      axisLabelComponent={
                        <VictoryLabel
                          dy={30}
                          style={{
                            fill: "#e0e0e0",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        />
                      }
                      tickFormat={dashboardData.withdrawalsByCourse.map(
                        (item) => item.course
                      )}
                      style={{
                        axis: { stroke: "#666" },
                        tickLabels: {
                          angle: -20,
                          textAnchor: "end",
                          fontSize: 10,
                          fill: "#e0e0e0",
                          padding: 5,
                        },
                        grid: { stroke: "#666" },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      label="Qtd de Retiradas"
                      axisLabelComponent={
                        <VictoryLabel
                          dy={-30}
                          style={{
                            fill: "#e0e0e0",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        />
                      }
                      style={{
                        axis: { stroke: "#666" },
                        tickLabels: {
                          fontSize: 10,
                          fill: "#e0e0e0",
                        },
                        grid: { stroke: "#666" },
                      }}
                    />
                    <VictoryBar
                      data={dashboardData.withdrawalsByCourse}
                      x="course"
                      y="total"
                      barRatio={0.5}
                      style={{
                        data: { fill: chartColors[0] },
                      }}
                      labels={({ datum }) => datum.total}
                      labelComponent={
                        <VictoryTooltip
                          style={{
                            fontSize: 10,
                            fill: "#ffffff",
                          }}
                          flyoutStyle={{
                            stroke: "#333",
                            fill: "#1E1E1E",
                          }}
                        />
                      }
                    />
                  </VictoryChart>
                </div>
              </div>
            )}
          </div>

          <div className="chart-row">
            {/* Gráfico: Retiradas por Período */}
            {dashboardData.withdrawalsByPeriod.length > 0 &&
              (() => {
                const pieData = dashboardData.withdrawalsByPeriod.map(
                  (item, index) => ({
                    x: item.period,
                    y: item.quantity,
                    fill: chartColors[index % chartColors.length],
                  })
                );

                return (
                  <div className="chart-container">
                    <h2>Retiradas por Período</h2>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <VictoryPie
                        data={pieData}
                        colorScale={chartColors}
                        labels={({ datum }) => `${datum.x}: ${datum.y}`}
                        labelComponent={
                          <VictoryTooltip
                            style={{
                              fontSize: 10,
                              fill: "#ffffff",
                            }}
                            flyoutStyle={{
                              stroke: "#333",
                              fill: "#1E1E1E",
                            }}
                          />
                        }
                        responsive={true}
                        height={250}
                        padding={{ top: 20, bottom: 40, left: 50, right: 50 }}
                        style={{
                          labels: {
                            fontSize: 10,
                            fill: "#ffffff",
                          },
                        }}
                      />
                      <div style={{ marginLeft: 20 }}>
                        <h4
                          style={{
                            marginBottom: "0.5rem",
                            color: "#e0e0e0",
                          }}
                        >
                          Períodos
                        </h4>
                        <ul
                          style={{
                            listStyle: "none",
                            padding: 0,
                            margin: 0,
                          }}
                        >
                          {pieData.map((item, index) => (
                            <li
                              key={index}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "0.4rem",
                              }}
                            >
                              <div
                                style={{
                                  width: 14,
                                  height: 14,
                                  backgroundColor: item.fill,
                                  marginRight: 8,
                                  borderRadius: "50%",
                                }}
                              />
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "#e0e0e0",
                                }}
                              >
                                {item.x}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()}

            {/* Gráfico: Retiradas Diárias */}
            {dashboardData.dailyWithdrawalsLastWeek.length > 0 &&
              (() => {
                const weekDays = [
                  "Dom",
                  "Seg",
                  "Ter",
                  "Qua",
                  "Qui",
                  "Sex",
                  "Sáb",
                ];

                const alignedWithdrawals = weekDays.map((day) => {
                  const match = dashboardData.dailyWithdrawalsLastWeek.find(
                    (item) => {
                      const dayAbbr = item.day.slice(0, 3).toLowerCase();
                      return dayAbbr === day.toLowerCase().slice(0, 3);
                    }
                  );
                  return {
                    day,
                    total_withdrawals: match
                      ? Number(match.total_withdrawals)
                      : 0,
                  };
                });
                return (
                  <div className="chart-container">
                    <h2>Retiradas Diárias na Última Semana</h2>
                    <div className="chart-wrapper small-chart">
                      <VictoryChart
                        theme={VictoryTheme.material}
                        domainPadding={20}
                        responsive={true}
                        height={250}
                      >
                        <VictoryAxis
                          label="Dias da Semana"
                          axisLabelComponent={
                            <VictoryLabel
                              dy={25}
                              style={{
                                fill: "#e0e0e0",
                                fontSize: 12,
                                fontWeight: "bold",
                              }}
                            />
                          }
                          tickFormat={alignedWithdrawals.map(
                            (item) => item.day
                          )}
                          style={{
                            axis: { stroke: "#666" },
                            tickLabels: {
                              fontSize: 10,
                              fill: "#e0e0e0",
                              padding: 5,
                            },
                            grid: { stroke: "#666" },
                          }}
                        />
                        <VictoryAxis
                          dependentAxis
                          label="Qtd de Retiradas"
                          axisLabelComponent={
                            <VictoryLabel
                              dy={-25}
                              style={{
                                fill: "#e0e0e0",
                                fontSize: 12,
                                fontWeight: "bold",
                              }}
                            />
                          }
                          style={{
                            axis: { stroke: "#666" },
                            tickLabels: {
                              fontSize: 10,
                              fill: "#e0e0e0",
                            },
                            grid: { stroke: "#666" },
                          }}
                        />
                        <VictoryBar
                          data={alignedWithdrawals}
                          x="day"
                          y="total_withdrawals"
                          style={{
                            data: { fill: chartColors[0] },
                          }}
                          labels={({ datum }) => datum.total_withdrawals}
                          labelComponent={
                            <VictoryTooltip
                              style={{
                                fontSize: 10,
                                fill: "#ffffff",
                              }}
                              flyoutStyle={{
                                stroke: "#333",
                                fill: "#1E1E1E",
                              }}
                            />
                          }
                        />
                      </VictoryChart>
                    </div>
                  </div>
                );
              })()}
          </div>

          <div
            className="chart-row"
            style={{ display: "flex", justifyContent: "center" }}
          >
            {dashboardData.withdrawalForecast.length > 0 && (
              <div
                className="chart-container"
                style={{
                  width: "100%",
                  maxWidth: "800px",
                  overflow: "visible",
                }}
              >
                <h2>Previsão de Movimentação via Regressão Linear</h2>
                <div
                  className="chart-wrapper small-chart"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "325px",
                    overflow: "visible",
                  }}
                >
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={30}
                    width={800}
                    height={325}
                    padding={{
                      top: 50,
                      bottom: 80,
                      left: 70,
                      right: 50,
                    }}
                    containerComponent={
                      <VictoryVoronoiContainer responsive={false} />
                    }
                  >
                    {/* Eixos (mantidos como no seu código original) */}
                    <VictoryAxis
                      label="Dias da Semana"
                      tickValues={filteredForecast.map(
                        (item) => item.next_date
                      )}
                      axisLabelComponent={
                        <VictoryLabel
                          dy={35}
                          style={{
                            fill: "#e0e0e0",
                            fontSize: 14,
                            fontWeight: "bold",
                          }}
                        />
                      }
                      style={{
                        axis: { stroke: "#666" },
                        tickLabels: {
                          angle: 0,
                          textAnchor: "end",
                          fontSize: 12,
                          fill: "#e0e0e0",
                          padding: 10,
                        },
                        grid: { stroke: "#666", strokeDasharray: "4,4" },
                      }}
                    />

                    <VictoryAxis
                      dependentAxis
                      label="Qtd. Estimada"
                      axisLabelComponent={
                        <VictoryLabel
                          angle={-90}
                          dy={-30}
                          style={{
                            fill: "#e0e0e0",
                            fontSize: 14,
                            fontWeight: "bold",
                          }}
                        />
                      }
                      style={{
                        axis: { stroke: "#666" },
                        tickLabels: {
                          fontSize: 12,
                          fill: "#e0e0e0",
                        },
                        grid: { stroke: "#666", strokeDasharray: "4,4" },
                      }}
                    />

                    {/* Área preenchida abaixo da linha */}
                    <VictoryArea
                      data={filteredForecast.map((item) => ({
                        x: item.next_date,
                        y: item.estimated_quantity,
                      }))}
                      style={{
                        data: {
                          fill: "url(#areaGradient)", // Gradiente definido abaixo
                          fillOpacity: 0.4,
                          stroke: "transparent",
                        },
                      }}
                    />

                    {/* Definição do gradiente */}
                    <defs>
                      <linearGradient
                        id="areaGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor={chartColors[0]}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor={chartColors[0]}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>

                    {/* Linha principal (mantida como original) */}
                    <VictoryLine
                      data={filteredForecast.map((item) => ({
                        x: item.next_date,
                        y: item.estimated_quantity,
                      }))}
                      style={{
                        data: {
                          stroke: chartColors[0],
                          strokeWidth: 3,
                        },
                      }}
                    />

                    {/* Pontos do scatter (mantidos como original) */}
                    <VictoryScatter
                      data={filteredForecast.map((item) => ({
                        x: item.next_date,
                        y: item.estimated_quantity,
                      }))}
                      style={{
                        data: {
                          fill: chartColors[0],
                          stroke: "#fff",
                          strokeWidth: 1,
                        },
                      }}
                      size={5}
                      labels={({ datum }) => datum.y.toFixed(1)}
                      labelComponent={
                        <VictoryTooltip
                          style={{
                            fontSize: 12,
                            fill: "#ffffff",
                          }}
                          flyoutStyle={{
                            stroke: "#333",
                            fill: "#1E1E1E",
                            strokeWidth: 1,
                          }}
                        />
                      }
                    />
                  </VictoryChart>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
