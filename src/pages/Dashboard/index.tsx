import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Spinner } from "react-bootstrap";
import DashboardAPI from "../../api/dashboard";
import { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next";
import "./styles.css";

const Dashboard: React.FC = () => {
	const { t } = useTranslation();
	const [data, setData] = useState<any>(null);
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const [years, setYears] = useState<number[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await DashboardAPI.getAllData();
				setData(response.data);
				const availableYears = response.data.company.data.map(
					(entry: any) => entry.year
				);
				setYears(availableYears);
				if (availableYears.length > 0) {
					setSelectedYear(availableYears[availableYears.length - 1]);
				}
			} catch (error) {
				console.error(t("dashboard.fetchError"), error);
				setData(t("dashboard.fetchFail"));
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [t]);

	const currentData = data?.company?.data?.find(
		(entry: any) => entry.year === selectedYear
	);

	const getColor = (score: number) => {
		if (score < 25) return "#D32F2F";
		else if (score < 50) return "#FF8C00";
		else if (score < 75) return "#FFD700";
		else return "#5EE27A";
	};

	const generateOptions = (label: string, score: number): ApexOptions => ({
		chart: {
			type: "radialBar",
			offsetY: -20,
			sparkline: { enabled: true },
		},
		plotOptions: {
			radialBar: {
				startAngle: -90,
				endAngle: 90,
				track: {
					background: "#e7e7e7",
					strokeWidth: "97%",
					margin: 5,
				},
				hollow: { margin: 0, size: "60%", background: "transparent" },
				dataLabels: {
					name: {
						show: true,
						fontSize: "16px",
						fontWeight: 600,
						offsetY: 20,
						color: "#000",
					},
					value: {
						offsetY: -20,
						fontSize: "22px",
						fontWeight: 700,
						show: true,
						color: "#000",
						formatter: (val) => val.toFixed(2),
					},
				},
			},
		},
		fill: { colors: [getColor(score)] },
		stroke: { lineCap: "round" },
		labels: [label],
	});

	const pieOptions: ApexOptions = {
		chart: { type: "pie" },
		labels: [
			t("dashboard.environmentWeight"),
			t("dashboard.socialWeight"),
			t("dashboard.governanceWeight"),
		],
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: { width: 300 },
					legend: { position: "bottom" },
				},
			},
		],
	};

	const pieSeries = [
		currentData?.environmentWeight * 100 || 0,
		currentData?.socialWeight * 100 || 0,
		currentData?.governanceWeight * 100 || 0,
	];

	const lineOptions: ApexOptions = {
		chart: { type: "line", height: 450, zoom: { enabled: true } },
		dataLabels: { enabled: false },
		stroke: { curve: "straight", width: 2 },
		title: { text: t("dashboard.esgScoreOverYears"), align: "left" },
		xaxis: { categories: years },
		yaxis: {
			title: { text: t("dashboard.score") },
			labels: { formatter: (val) => val.toFixed(2).toString() },
		},
		legend: { position: "top" },
	};

	const lineSeries = [
		{
			name: t("dashboard.environmental"),
			data:
				data?.company?.data.map(
					(entry: any) => entry.environmental * 100
				) || [],
		},
		{
			name: t("dashboard.social"),
			data:
				data?.company?.data.map((entry: any) => entry.social * 100) ||
				[],
		},
		{
			name: t("dashboard.governance"),
			data:
				data?.company?.data.map(
					(entry: any) => entry.governance * 100
				) || [],
		},
	];

	return (
		<div className="dashboard-container">
			{loading ? (
				<div
					className="d-flex justify-content-center align-items-center spinner-grow text-success"
					style={{ height: "80vh" }}
				>
					<Spinner animation="border" role="status">
						<span className="visually-hidden">{t("dashboard.loading")}</span>
					</Spinner>
				</div>
			) : (
				<>
					<div className="top-section">
						<div className="left-panel">
							<div className="title-container">
								<h2 className="overview-title">
									{t("dashboard.overview")}
								</h2>
								<p className="company-name">
									<span className="company-name-bold">
										{data?.company
											? data.company.name
											: t("dashboard.loading")}
									</span>
									<span className="report-text">
										{" "}
										{t("dashboard.annualEsgReport")}
									</span>
								</p>
							</div>

							<div className="select-group">
								<label htmlFor="year">{t("dashboard.selectYear")}</label>
								<select
									id="year"
									value={selectedYear ?? ""}
									onChange={(e) =>
										setSelectedYear(Number(e.target.value))
									}
								>
									{years.map((year) => (
										<option key={year} value={year}>
											{year}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="right-panel">
							<div className="chart-item">
								<ReactApexChart
									options={generateOptions(
										"ESG",
										currentData?.esg * 100 || 0
									)}
									series={[currentData?.esg * 100 || 0]}
									type="radialBar"
									height={150}
								/>
								<p className="rank-label">
									{t("dashboard.rank")}: {currentData?.esgRank}
								</p>
							</div>
							<div className="chart-item">
								<ReactApexChart
									options={generateOptions(
										t("dashboard.environmental"),
										currentData?.environmental * 100 || 0
									)}
									series={[
										currentData?.environmental * 100 || 0,
									]}
									type="radialBar"
									height={150}
								/>
								<p className="rank-label">
									{t("dashboard.rank")}: {currentData?.environmentRank}
								</p>
							</div>
							<div className="chart-item">
								<ReactApexChart
									options={generateOptions(
										t("dashboard.social"),
										currentData?.social * 100 || 0
									)}
									series={[currentData?.social * 100 || 0]}
									type="radialBar"
									height={150}
								/>
								<p className="rank-label">
									{t("dashboard.rank")}: {currentData?.socialRank}
								</p>
							</div>
							<div className="chart-item">
								<ReactApexChart
									options={generateOptions(
										t("dashboard.governance"),
										currentData?.governance * 100 || 0
									)}
									series={[
										currentData?.governance * 100 || 0,
									]}
									type="radialBar"
									height={150}
								/>
								<p className="rank-label">
									{t("dashboard.rank")}: {currentData?.governanceRank}
								</p>
							</div>
						</div>
					</div>

					<div className="bottom-section">
						<div className="chart-item pie-chart">
							<ReactApexChart
								options={pieOptions}
								series={pieSeries}
								type="pie"
								height={"100%"}
								width={"175%"}
							/>
						</div>
						<div className="chart-item line-chart">
							<ReactApexChart
								options={lineOptions}
								series={lineSeries}
								height={"100%"}
								width={"175%"}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Dashboard;
