import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import api from "../services/api";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit"; //Biblioteca de gráfico colunar, de linha e de pizza
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('window');

const Dashboard = () => {
  const [notebookData, setNotebookData] = useState(null);
  const [averageUsageTime, setAverageUsageTime] = useState(null);
  const [medianUsageTime, setMedianUsageTime] = useState(null);
  const [usageTimeStdDev, setUsageTimeStdDev] = useState(null);
  const [unreturnedNotebooks, setUnreturnedNotebooks] = useState([]);
  const [withdrawalsByCourse, setWithdrawalsByCourse] = useState([]);
  const [withdrawalsByPeriod, setWithdrawalsByPeriod] = useState([]);
  const [top5LongestUsage, setTop5LongestUsage] = useState([]);
  const [dailyWithdrawalsLastWeek, setDailyWithdrawalsLastWeek] = useState([]);
  const [withdrawalForecast, setWithdrawalForecast] = useState([]);
  const [normalDistribution, setNormalDistribution] = useState([]);
  const [usageTimeSkewness, setUsageTimeSkewness] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        const response = await api.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const convertidoMediana = Number(response.data.medianUsageTime);
        const convertidoMedia = Number(response.data.averageUsageTime);


        setNotebookData(response.data.mostFrequentDiscipline);
        setAverageUsageTime(convertidoMedia);
        setMedianUsageTime(convertidoMediana);
        setUsageTimeStdDev(response.data.usageTimeStdDev);
        setUnreturnedNotebooks(response.data.unreturnedNotebooks || []);
        setWithdrawalsByCourse(response.data.withdrawalsByCourse || []);
        setWithdrawalsByPeriod(response.data.withdrawalsByPeriod || []);
        setTop5LongestUsage(response.data.top5LongestAverageUsage || []);
        setDailyWithdrawalsLastWeek(response.data.dailyWithdrawalsLastWeek || []);
        setWithdrawalForecast(response.data.withdrawalForecast || []);
        setNormalDistribution(response.data.normalDistribution || []);
        setUsageTimeSkewness(response.data.usageTimeSkewness || null);

      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      }
    };
    fetchData();
  }, []);
  
  const formatForecastDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const dayOfWeek = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${dayOfWeek}-${day}/${month}`; 
  };

  const filterNext5Days = (forecastData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove a hora para comparar apenas a data
    
    return forecastData.filter(item => {
      const itemDate = new Date(item.next_date);
      itemDate.setHours(0, 0, 0, 0);
      
      // Calcula a diferença em dias
      const diffTime = itemDate - today;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      // Mantém apenas os próximos 5 dias 
      return diffDays >= 0 && diffDays < 6;
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estatística</Text>

      {notebookData ? (
        <>
        <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>Notebooks não devolvidos</Text>
            {unreturnedNotebooks.length === 0 ? (
              <Text style={styles.tableTitle}>Nenhum notebook pendente de devolução.</Text>
            ) : (
              <View style={styles.table}>
                <View style={styles.tableRowHeader}>
                  <Text style={[styles.tableCell, styles.headerText]}>Notebook</Text>
                  <Text style={[styles.tableCell, styles.headerText]}>Disciplina</Text>
                  <Text style={[styles.tableCell, styles.headerText]}>Retirado em</Text>
                </View>

                {unreturnedNotebooks.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.device_name}</Text>
                    <Text style={styles.tableCell}>{item.discipline}</Text>
                    <Text style={styles.tableCell}>{item.checkout_datetime}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.label}>Disciplina com maior número de retiradas  de notebooks</Text>
              <Text style={styles.value}>{notebookData.disciplineName}</Text>

              <Text style={styles.label}>Dia da disciplina</Text>
              <Text style={styles.value}>{notebookData.dayOfDiscipline}</Text>

              <Text style={styles.label}>Total de movimentações</Text>
              <Text style={styles.value}>{notebookData.total}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Tempo médio de uso</Text>
              <Text style={styles.value}>
                {typeof averageUsageTime === 'number'
                  ? `${averageUsageTime.toFixed(1)} minutos`
                  : 'N/A minutos'}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.label}>Mediana de tempo de uso por retirada</Text>
              <Text style={styles.value}>
                {typeof medianUsageTime === 'number'
                  ? `${medianUsageTime.toFixed(1)} minutos`
                  : 'N/A minutos'}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Desvio padrão do tempo de uso</Text>
              <Text style={styles.value}>
                {usageTimeStdDev && typeof usageTimeStdDev.standardDeviation === 'number'
                  ? `${usageTimeStdDev.standardDeviation.toFixed(1)} minutos`
                  : 'N/A minutos'}
              </Text>
            </View>
            
          </View>

          {usageTimeSkewness && (
            <View style={[styles.card, { marginBottom: 24 }]}>
              <Text style={styles.labelAssimetria}>Assimetria do Tempo de Uso</Text>

              <Text style={styles.value}>
                {usageTimeSkewness.skewness !== null
                  ? usageTimeSkewness.skewness.toFixed(3)
                  : 'N/A'}
              </Text>

              <Text style={styles.label}>
                {usageTimeSkewness.interpretation}
              </Text>
            </View>
          )}

          {top5LongestUsage.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Top 5 Notebooks por Tempo Médio de Uso</Text>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ transform: [{ rotate: '-90deg' }], position: 'absolute', left: -62, top: 135 }}>
                  <Text style={{ color: '#fff', fontSize: 12 }}>Tempo de Uso (min)</Text>
                </View>

                <BarChart
                  data={{
                    labels: top5LongestUsage.map(item => item.notebookName),
                    datasets: [
                      {
                        data: top5LongestUsage.map(item => item.averageUsageTimeMinutes),
                      },
                    ],
                  }}
                  width={width - 40}
                  height={300}
                  yAxisLabel=""
                  xAxisSuffix=" min"
                  yAxisInterval={1}
                  chartConfig={{
                    backgroundColor: "#1E1E1E",
                    backgroundGradientFrom: "#1E1E1E",
                    backgroundGradientTo: "#1E1E1E",
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                    labelColor: (opacity = 1) => "#fff",
                    propsForBackgroundLines: {
                      stroke: "#333",
                    },
                  }}
                  verticalLabelRotation={19}
                  horizontalLabelRotation={0}
                  fromZero
                  showBarTops={true}
                  withInnerLines={true}
                  withHorizontalLabels={true}
                  segments={5}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  horizontal={true}
                />
              </View>
              <View style={{ alignItems: 'center', marginTop: 4 }}>
                <Text style={{ color: '#fff', fontSize: 12 }}>Notebooks</Text>
              </View>
            </View>
          )}     

          {normalDistribution && normalDistribution.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Distribuição Normal do Tempo de Uso</Text>
                <View style={{ transform: [{ rotate: '-90deg' }], position: 'absolute', left: -75, top: 135 }}>
                  <Text style={{ color: '#fff', fontSize: 12 }}>Densidade de Probabilidade</Text>
                </View>
                <LineChart
                  data={{
                    labels: normalDistribution.map((item, index) =>
                      index % 5 === 0 ? item.x.toString() : '' 
                    ),
                    datasets: [
                      {
                        data: normalDistribution.map(item => item.y),
                        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, 
                        strokeWidth: 3,
                      }
                    ]
                  }}
                  width={width - 40}
                  height={300}
                  yAxisSuffix=""
                  yAxisInterval={1}
                  xAxisInterval={1}
                  chartConfig={{
                    backgroundColor: "#1E1E1E",
                    backgroundGradientFrom: "#1E1E1E",
                    backgroundGradientTo: "#1E1E1E",
                    decimalPlaces: 5,
                    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    fillShadowGradient: `rgba(33, 150, 243, 0.2)`,
                    fillShadowGradientOpacity: 1,
                    propsForDots: {
                      r: "0", 
                    },
                    propsForBackgroundLines: {
                      stroke: "#444",
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  withDots={false}
                  withInnerLines={true}
                  withOuterLines={true}
                  fromZero={true}
                  segments={5}
                />
              <View style={{ alignItems: 'center', marginTop: -20}}>
                <Text style={{ color: '#fff', fontSize: 12 }}>Tempo de Uso(Minutos)</Text>
              </View>
            </View>
          )} 

          {normalDistribution && normalDistribution.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Probabilidade Acumulada de Duração</Text>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ transform: [{ rotate: '-90deg' }], position: 'absolute', left: -75, top: 135 }}>
                  <Text style={{ color: '#fff', fontSize: 12 }}>Probabilidade Acumulada</Text>
                </View>

                <LineChart
                  data={{
                    labels: normalDistribution.map((item, index) =>
                      index % 5 === 0 ? item.x.toString() : ''
                    ),
                    datasets: [
                      {
                        data: normalDistribution.map(item =>
                          (item.cumulative * 100).toFixed(2) // converte para %
                        ),
                        color: (opacity = 1) => `rgba(3,255, 247, ${opacity})`,
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={width - 40}
                  height={300}
                  yAxisSuffix="%"
                  yAxisInterval={1}
                  chartConfig={{
                    backgroundColor: "#1E1E1E",
                    backgroundGradientFrom: "#1E1E1E",
                    backgroundGradientTo: "#1E1E1E",
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    propsForDots: {
                      r: "2",
                    },
                    propsForBackgroundLines: {
                      stroke: "#444",
                    },
                  }}
                  withDots={false}
                  withInnerLines={true}
                  withOuterLines={true}
                  bezier
                  fromZero
                  segments={5}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </View>
              <View style={{ alignItems: 'center', marginTop: -20 }}>
                <Text style={{ color: '#fff', fontSize: 12 }}>Tempo de Uso(Minutos)</Text>
              </View>
            </View>
          )}

          {withdrawalsByCourse.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Retiradas por Curso</Text>
                <View style={{ transform: [{ rotate: '-90deg' }], position: 'absolute', left: -45, top: 135 }}>
                  <Text style={{ color: '#fff', fontSize: 12 }}>Qtd de Retiradas</Text>
                </View>

              <BarChart
                data={{
                  labels: withdrawalsByCourse.map((item) => item.course),
                  datasets: [
                    {
                      data: withdrawalsByCourse.map((item) => item.total),
                    },
                  ],
                }}
                width={width - 40}
                height={220}
                yAxisLabel=""
                fromZero
                showValuesOnTopOfBars
                chartConfig={{
                  backgroundColor: "#1E1E1E",
                  backgroundGradientFrom: "#1E1E1E",
                  backgroundGradientTo: "#1E1E1E",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForBackgroundLines: {
                    stroke: "#444",
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
              <View style={{ alignItems: 'center', marginTop: -20 }}>
                <Text style={{ color: '#fff', fontSize: 12 }}>Cursos</Text>
              </View>
            </View>

          )}

          {withdrawalsByPeriod.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Retiradas por Período</Text>
              <PieChart
                data={withdrawalsByPeriod.map((item, index) => ({
                  name: item.period,
                  population: item.quantity,
                  color: chartColors[index % chartColors.length],
                  legendFontColor: "#fff",
                  legendFontSize: 12,
                }))}
                width={width - 40}
                height={220}
                chartConfig={{
                  color: () => `#fff`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          )}

          {dailyWithdrawalsLastWeek.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Retiradas Diárias na Última Semana</Text>
                <View style={{ transform: [{ rotate: '-90deg' }], position: 'absolute', left: -42, top: 175 }}>
                  <Text style={{ color: '#fff', fontSize: 12 }}>Qtd de Retiradas</Text>
                </View>
              <BarChart
                data={{
                  labels: dailyWithdrawalsLastWeek.map(item =>
                    item.day.slice(0, 3).charAt(0).toUpperCase() + item.day.slice(1, 3)
                  ),
                  datasets: [
                    {
                      data: dailyWithdrawalsLastWeek.map(item => item.total_withdrawals),
                    },
                  ],
                }}
                width={width - 40}
                height={300}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: "#1E1E1E",
                  backgroundGradientFrom: "#1E1E1E",
                  backgroundGradientTo: "#1E1E1E",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForBackgroundLines: {
                    stroke: "#444",
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#2196F3",
                  },
                }}
                verticalLabelRotation={0}
                fromZero
                showValuesOnTopOfBars
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
              <View style={{ alignItems: 'center', marginTop: -20 }}>
                <Text style={{ color: '#fff', fontSize: 12 }}>Dias da Semana</Text>
              </View>
            </View>
          )}

          {withdrawalForecast.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Previsão de Retiradas para os Próximos Dias</Text>

              <View style={{ transform: [{ rotate: '-90deg' }], position: 'absolute', left: -42, top: 175 }}>
                <Text style={{ color: '#fff', fontSize: 12 }}>Qtd de Retiradas</Text>
              </View>

              <LineChart
                data={{
                  labels: filterNext5Days(withdrawalForecast).map(item => formatForecastDate(item.next_date)),
                  datasets: [
                    {
                      data: filterNext5Days(withdrawalForecast).map(item => item.estimated_quantity),
                      strokeWidth:2, // grossura da linha
                      color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // linha em amarelo
                    },
                  ]
                }}
                width={width - 40}
                height={320}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: "#1E1E1E",
                  backgroundGradientFrom: "#1E1E1E",
                  backgroundGradientTo: "#1E1E1E",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(33, 150, 243,${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForBackgroundLines: {
                    stroke: "#444",
                  },
                  propsForDots: {
                    r: "5",
                    strokeWidth: "2",
                    stroke: "#2196F3",
                  },
                }}
                bezier
                fromZero
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />

              <View style={{ alignItems: 'center', marginTop: -5 }}>
                <Text style={{ color: '#fff', fontSize: 12 }}>Dias da Semana</Text>
              </View>
            </View>
          )}
        </>
      ) : (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    )}
    </ScrollView>

  );
};

const chartColors = ["#2196F3", "#FF9800", "#4CAF50", "#E91E63", "#9C27B0"];
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#121212",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#1E1E1E",
    flex: 1,
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  singleCard: {
    backgroundColor: "#1E1E1E",
    width: "100%",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  label: {
    fontSize: 15,
    color: "#e0e0e0",
    marginBottom: 5,
  },
  labelAssimetria:{
    fontSize: 15,
    color:"#fff",
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: "bold",
  },
  value: {
    fontSize: 18,
    color: "#2196F3",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 85,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  tableContainer: {
    width: "100%",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 30,
  },
  tableTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  tableRowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tableCell: {
    flex: 1,
    color: "#e0e0e0",
    fontSize: 12,
  },
  headerText: {
    fontWeight: "bold",
    color: "#FF2C2C",
  },
  chartContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    padding: 10,
    marginBottom: 30,
    alignItems: "center",
  },
  chartTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartNote: {
    color: "#A0A0A0",
    fontSize: 10,
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default Dashboard;
