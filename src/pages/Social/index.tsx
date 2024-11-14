import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import SocialAPI from "../../api/social";
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

const SocialPage: React.FC = () => {
	const [sexRatioChartData, setSexRatioChartData] = useState<ChartData[]>([]);
	const [trainingChartData, setTrainingChartData] = useState<ChartData[]>([]);
	const [salaryChangeChartData, setSalaryChangeChartData] = useState<
		ChartData[]
	>([]);
	const [riskChartData, setRiskChartData] = useState<ChartData[]>([]);
	const [expenditureChartData, setExpenditureChartData] = useState<
		ChartData[]
	>([]);
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const [loading, setLoading] = useState(true);

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
			setLoading(true);
			try {
				const sexRatioDataResponse =
					await SocialAPI.getDataForSexRatioChart(lang);
				const trainingDataResponse =
					await SocialAPI.getDataForTrainingChart(lang);
				const salaryChangeDataResponse =
					await SocialAPI.getDataForSalaryChangeChart(lang);
				const riskDataResponse = await SocialAPI.getDataForRiskChart(
					lang
				);
				const expenditureDataResponse =
					await SocialAPI.getDataForExpenditureChart(lang);

				setSexRatioChartData(sexRatioDataResponse.data);
				setTrainingChartData(trainingDataResponse.data);
				setSalaryChangeChartData(salaryChangeDataResponse.data);
				setRiskChartData(riskDataResponse.data);
				setExpenditureChartData(expenditureDataResponse.data);
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
		const sexRatioCategories =
			sexRatioChartData[0]?.dataChart.map((item) => item.year) || [];
		const trainingCategories =
			trainingChartData[0]?.dataChart.map((item) => item.year) || [];
		const salaryChangeCategories =
			salaryChangeChartData[0]?.dataChart.map((item) => item.year) || [];
		const riskCategories =
			riskChartData[0]?.dataChart.map((item) => item.year) || [];
		const expenditureCategories =
			expenditureChartData[0]?.dataChart.map((item) => item.year) || [];

		const sexRatioSeries = createSeries(sexRatioChartData);
		const trainingSeries = createSeries(trainingChartData);
		const salaryChangeSeries = createSeries(salaryChangeChartData);
		const riskSeries = createSeries(riskChartData);
		const expenditureSeries = createSeries(expenditureChartData);

		const sexRatioChartOptions = createChartOptions(
			t("chart.social.sexRatioChart"),
			sexRatioCategories,
			sexRatioSeries
		);
		const trainingChartOptions = createChartOptions(
			t("chart.social.trainingChart"),
			trainingCategories,
			trainingSeries
		);
		const salaryChangeChartOptions = createChartOptions(
			t("chart.social.salaryChangeChart"),
			salaryChangeCategories,
			salaryChangeSeries
		);
		const riskChartOptions = createChartOptions(
			t("chart.social.riskChart"),
			riskCategories,
			riskSeries
		);
		const expenditureChartOptions = createChartOptions(
			t("chart.social.expenditureChart"),
			expenditureCategories,
			expenditureSeries
		);

		return (
			<div>
				<div className="chart">
					<ReactApexChart
						options={sexRatioChartOptions.options}
						series={sexRatioChartOptions.series}
						type="line"
						height={550}
					/>
					<ReactApexChart
						options={trainingChartOptions.options}
						series={trainingChartOptions.series}
						type="line"
						height={550}
					/>
					<ReactApexChart
						options={salaryChangeChartOptions.options}
						series={salaryChangeChartOptions.series}
						type="line"
						height={550}
					/>
					<ReactApexChart
						options={riskChartOptions.options}
						series={riskChartOptions.series}
						type="line"
						height={550}
					/>
					<ReactApexChart
						options={expenditureChartOptions.options}
						series={expenditureChartOptions.series}
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

export default SocialPage;
