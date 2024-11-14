import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
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
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const [loading, setLoading] = useState(true); // Trạng thái loading

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
			setLoading(true); // Bắt đầu trạng thái loading
			try {
				const waterDataResponse =
					await EnvironmentAPI.getDataForWaterChart(lang);
				const wasteDataResponse =
					await EnvironmentAPI.getDataForWasteChart(lang);
				const electricityDataResponse =
					await EnvironmentAPI.getDataForElectricityChart(lang);
				const inkPapersDataResponse =
					await EnvironmentAPI.getDataForInkPapersChart(lang);

				setWaterChartData(waterDataResponse.data);
				setWasteChartData(wasteDataResponse.data);
				setElectricityChartData(electricityDataResponse.data);
				setInkPapersChartData(inkPapersDataResponse.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [lang]);

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
					offsetX: 110,
					style: {
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
			t("chart.environment.waterChart"), // lấy tiêu đề từ t() dựa trên JSON
			waterCategories,
			waterSeries
		);
		const wasteChartOptions = createChartOptions(
			t("chart.environment.wasteChart"),
			wasteCategories,
			wasteSeries
		);
		const electricityChartOptions = createChartOptions(
			t("chart.environment.electricityChart"),
			electricityCategories,
			electricitySeries
		);
		const inkPapersChartOptions = createChartOptions(
			t("chart.environment.inkPapersChart"),
			inkPapersCategories,
			inkPapersSeries
		);

		return (
			<div>
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

	return (
		<div>
			{loading ? (
				<div
					className="d-flex justify-content-center align-items-center"
					style={{ height: "80vh" }}
				>
					<Spinner animation="border" role="status">
						<span className="visually-hidden">Loading...</span>
					</Spinner>
				</div>
			) : (
				<MyChart />
			)}
		</div>
	);
};

export default EnvironmentPage;
