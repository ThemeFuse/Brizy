import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PieController,
  PointElement,
  Tooltip
} from "chart.js";

const registerChart = () =>
  ChartJS.register(
    BarController,
    LineController,
    PieController,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Filler,
    Tooltip
  );

class Chart extends ChartJS {
  constructor(item: any, userConfig: any) {
    registerChart();
    super(item, userConfig);
  }
}

export default Chart;
