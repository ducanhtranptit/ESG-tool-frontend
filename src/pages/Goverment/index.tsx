import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import GovernanceAPI from "../../api/governance"; // API thực tế để lấy dữ liệu
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

const GovernancePage: React.FC = () => {
	const [sexRatioChartData, setSexRatioChartData] = useState<ChartData[]>([]);
	const [supplierRatioChartData, setSupplierRatioChartData] = useState<
		ChartData[]
	>([]);
	const [violateChartData, setViolateChartData] = useState<ChartData[]>([]);
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
			setLoading(true);
			try {
				const sexRatioDataResponse =
					await GovernanceAPI.getDataForSexRatioChart(lang);
				const supplierRatioDataResponse =
					await GovernanceAPI.getDataForSupplierRatioChart(lang);
				const violateDataResponse =
					await GovernanceAPI.getDataForViolateChart(lang);

				setSexRatioChartData(sexRatioDataResponse.data);
				setSupplierRatioChartData(supplierRatioDataResponse.data);
				setViolateChartData(violateDataResponse.data);
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

	const createViolateChartOptions = (categories: string[], series: any[]) => {
		return {
			series: series,
			options: {
				chart: {
					type: "bar" as "bar",
					height: 350,
					stacked: true,
					stackType: "100%" as "100%",
				},
				title: {
					text: t("chart.governance.violateChart"), // Tiêu đề động cho biểu đồ vi phạm
					align: "left" as "left",
					style: {
						fontSize: "20px",
						fontWeight: "bold",
					},
				},
				responsive: [
					{
						breakpoint: 480,
						options: {
							legend: {
								position: "bottom" as "bottom",
								offsetX: -10,
								offsetY: 0,
							},
						},
					},
				],
				xaxis: {
					categories: categories,
				},
				fill: {
					opacity: 1,
				},
				legend: {
					position: "right" as "right",
					offsetX: 0,
					offsetY: 50,
				},
			},
		};
	};

	const MyChart = () => {
		const sexRatioCategories =
			sexRatioChartData[0]?.dataChart.map((item) => item.year) || [];
		const supplierRatioCategories =
			supplierRatioChartData[0]?.dataChart.map((item) => item.year) || [];
		const sexRatioSeries = createSeries(sexRatioChartData);
		const supplierRatioSeries = createSeries(supplierRatioChartData);

		const violateCategories =
			violateChartData[0]?.dataChart.map((item) => String(item.year)) ||
			[];
		const violateSeries = violateChartData.map((item) => ({
			name: `${item.name}`,
			data: item.dataChart.map((point) =>
				point.metric !== null ? point.metric : 0
			),
		}));

		const sexRatioChartOptions = createChartOptions(
			t("chart.governance.sexRatioChart"), // Tiêu đề động cho biểu đồ tỷ lệ giới tính
			sexRatioCategories,
			sexRatioSeries
		);
		const supplierRatioChartOptions = createChartOptions(
			t("chart.governance.supplierRatioChart"), // Tiêu đề động cho biểu đồ tỷ lệ nhà cung ứng
			supplierRatioCategories,
			supplierRatioSeries
		);
		const violateChartOptions = createViolateChartOptions(
			violateCategories,
			violateSeries
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
						options={supplierRatioChartOptions.options}
						series={supplierRatioChartOptions.series}
						type="line"
						height={550}
					/>
					<ReactApexChart
						options={violateChartOptions.options}
						series={violateChartOptions.series}
						type="bar"
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

export default GovernancePage;
