import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactApexChart from "react-apexcharts";
import EnvironmentAPI from "../../api/environment";
import "./styles.css";

interface DataChart {
	year: number;
	metric: number | null;
}

interface ChartData {
	name: string;
	criteriaId: number;
	IChart: number;
	dataChart: DataChart[];
}

const EnvironmentPage: React.FC = () => {
	const [waterChartData, setWaterChartData] = useState<ChartData[]>([]);
	const [wasteChartData, setWasteChartData] = useState<ChartData[]>([]);
	const [electricityChartData, setElectricityChartData] = useState<
		ChartData[]
	>([]);
	const [inkPapersChartData, setInkPapersChartData] = useState<ChartData[]>(
		[]
	);

	const colors = ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"];

	const createSeries = (data: ChartData[]) => {
		return data.map((item, index) => ({
			name: `${item.name}`,
			type: item.IChart === 1 ? "column" : "line",
			data: item.dataChart.map((point) =>
				point.metric !== null ? point.metric : 0
			),
			color: colors[index % colors.length],
		}));
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const waterDataResponse =
					await EnvironmentAPI.getDataForWaterChart();
				const wasteDataResponse =
					await EnvironmentAPI.getDataForWasteChart();
				const electricityDataResponse =
					await EnvironmentAPI.getDataForElectricityChart();
				const inkPapersDataResponse =
					await EnvironmentAPI.getDataForInkPapersChart();

				setWaterChartData(waterDataResponse.data);
				setWasteChartData(wasteDataResponse.data);
				setElectricityChartData(electricityDataResponse.data);
				setInkPapersChartData(inkPapersDataResponse.data);
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Error fetching data. Please try again.");
			}
		};

		fetchData();
	}, []);

	const createChartOptions = (
		title: string,
		categories: number[],
		series: any[]
	) => {
		const yaxis = series.map((serie: any, index: number) => ({
			seriesName: serie.name,
			opposite: index % 2 === 0,
			axisTicks: { show: true },
			axisBorder: { show: true, color: serie.color },
			labels: { style: { colors: serie.color } }, 
			title: {
				text: serie.name, 
				style: { color: serie.color }, 
			},
			tooltip: {
				enabled: true,
			},
		}));

		return {
			series: series,
			options: {
				chart: {
					height: 550,
					type: "line" as "line",
					stacked: false,
				},
				colors: series.map((s: any) => s.color),
				dataLabels: {
					enabled: false,
				},
				stroke: {
					width: Array(series.length).fill(3),
				},
				title: {
					text: title,
					align: "left" as "left",
					offsetX: 110,style: {
					fontSize: "20px",
					fontWeight: "bold",
				},
				},
				xaxis: {
					categories: categories,
				},
				yaxis: yaxis,
				tooltip: {
					fixed: {
						enabled: true,
						position: "topLeft",
						offsetY: 30,
						offsetX: 60,
					},
				},
				legend: {
					horizontalAlign: "center" as "center",
					offsetX: 40,
				},
			},
		};
	};

	const MyChart = () => {
		const waterCategories =
			waterChartData[0]?.dataChart.map((item) => item.year) || [];
		const wasteCategories =
			wasteChartData[0]?.dataChart.map((item) => item.year) || [];
		const electricityCategories =
			electricityChartData[0]?.dataChart.map((item) => item.year) || [];
		const inkPapersCategories =
			inkPapersChartData[0]?.dataChart.map((item) => item.year) || [];
		const waterSeries = createSeries(waterChartData);
		const wasteSeries = createSeries(wasteChartData);
		const electricitySeries = createSeries(electricityChartData);
		const inkPapersSeries = createSeries(inkPapersChartData);

		const waterChartOptions = createChartOptions(
			"Water Chart",
			waterCategories,
			waterSeries
		);
		const wasteChartOptions = createChartOptions(
			"Waste Chart",
			wasteCategories,
			wasteSeries
		);
		const electricityChartOptions = createChartOptions(
			"Electricity Chart",
			electricityCategories,
			electricitySeries
		);
		const inkPapersChartOptions = createChartOptions(
			"Ink Papers Chart",
			inkPapersCategories,
			inkPapersSeries
		);

		return (
			<div>
				<ToastContainer />
				<div className="chart">
					<ReactApexChart
						options={waterChartOptions.options}
						series={waterChartOptions.series}
						type="line"
						height={550}
					/>
					<ReactApexChart
						options={wasteChartOptions.options}
						series={wasteChartOptions.series}
						type="line"
						height={550}
					/>
					<ReactApexChart
						options={electricityChartOptions.options}
						series={electricityChartOptions.series}
						type="line"
						height={550}
					/>
					<ReactApexChart
						options={inkPapersChartOptions.options}
						series={inkPapersChartOptions.series}
						type="line"
						height={550}
					/>
				</div>
			</div>
		);
	};

	return <MyChart />;
};

export default EnvironmentPage;
