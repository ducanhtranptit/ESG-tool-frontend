import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { Spinner } from "react-bootstrap";
import DashboardAPI from "../../api/dashboard";
import ReportAPI from "../../api/report";
import { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import "./styles.css";

interface ReportData {
	[key: string]: string | number | undefined;
}

const Dashboard: React.FC = () => {
	const { t } = useTranslation();
	const [data, setData] = useState<any>(null);
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const [years, setYears] = useState<number[]>([]);
	const [loading, setLoading] = useState(true);
	const [downloadLoading, setDownloadLoading] = useState(false);

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
						offsetY: 30,
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
		chart: {
			type: "pie",
			width: "100%",
			height: "100%",
		},
		labels: [
			t("dashboard.environmentWeight"),
			t("dashboard.socialWeight"),
			t("dashboard.governanceWeight"),
		],
	};

	const pieSeries = [
		currentData?.environmentWeight * 100 || 0,
		currentData?.socialWeight * 100 || 0,
		currentData?.governanceWeight * 100 || 0,
	];

	const lineOptions: ApexOptions = {
		chart: {
			height: 550,
			type: "line" as "line",
			stacked: false,
		},
		dataLabels: { enabled: false },
		stroke: { curve: "straight", width: 2 },
		title: { text: t("dashboard.esgScoreOverYears"), align: "left" },
		xaxis: { categories: years },
		yaxis: {
			title: { text: t("dashboard.score") },
			labels: { formatter: (val) => val.toFixed(2).toString() },
		},
		legend: {
			horizontalAlign: "center" as "center",
			offsetX: 40,
		},
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

	const handleExportReport = async (year: number | null): Promise<void> => {
		setDownloadLoading(true);
		try {
			const apiKey = process.env.REACT_APP_REPORT_TEMPLATE_APIKEY;
			if (!apiKey) {
				throw new Error("API not found");
			}
			const filename = "annual-esg-report-template.docx";
			const response = await fetch(
				`https://api-esg-tool.tradeanalytics.vn/api/v1/core/webapp/report/download-report-template?filename=${filename}`,
				{
					headers: {
						"x-api-key": apiKey,
					},
				}
			);
			const arrayBuffer = await response.arrayBuffer();
			const zip = new PizZip(arrayBuffer);
			const doc = new Docxtemplater(zip, {
				paragraphLoop: true,
				linebreaks: true,
			});
			const apiResponse = await ReportAPI.getAllData(year);
			const data: ReportData = apiResponse.data;
			const dynamicData: ReportData = {};
			Object.keys(data).forEach((key) => {
				const value = data[key];
				if (typeof value === "number") {
					dynamicData[key] = parseFloat(value.toFixed(3));
				} else if (typeof value === "string") {
					dynamicData[key] = value;
				} else {
					dynamicData[key] = "";
				}
			});
			doc.setData(dynamicData);
			doc.render();
			const output = doc.getZip().generate({ type: "blob" });
			saveAs(output, `Outline ESG Report ${year}.docx`);
		} catch (error) {
			console.error(error);
		} finally {
			setDownloadLoading(false);
		}
	};

	return (
		<div className="dashboard-container">
			{loading ? (
				<div
					className="d-flex justify-content-center align-items-center "
					style={{ height: "80vh" }}
				>
					<Spinner animation="border" role="status">
						<span className="visually-hidden">
							{t("dashboard.loading")}
						</span>
					</Spinner>
				</div>
			) : (
				<div className="dashboard">
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
								<label htmlFor="year">
									{t("dashboard.selectYear")}
								</label>
								<div className="select-download-container">
									<select
										id="year"
										value={selectedYear ?? ""}
										onChange={(e) =>
											setSelectedYear(
												Number(e.target.value)
											)
										}
									>
										{years.map((year) => (
											<option key={year} value={year}>
												{year}
											</option>
										))}
									</select>
									<button
										onClick={() =>
											handleExportReport(selectedYear)
										}
										disabled={
											!selectedYear || downloadLoading
										}
										className={`download-button btn btn-light ${
											downloadLoading ? "loading" : ""
										}`}
									>
										{downloadLoading ? (
											<>
												<Spinner
													animation="border"
													size="sm"
												/>
											</>
										) : (
											<>
												{t("dashboard.downloadReport")}
												<IoCloudDownloadOutline
													size={16}
												/>
											</>
										)}
									</button>
								</div>
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
									{t("dashboard.rank")}:{" "}
									{currentData?.esgRank}
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
									{t("dashboard.rank")}:{" "}
									{currentData?.environmentRank}
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
									{t("dashboard.rank")}:{" "}
									{currentData?.socialRank}
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
									{t("dashboard.rank")}:{" "}
									{currentData?.governanceRank}
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
								// height={"100%"}
								// width={"175%"}
							/>
						</div>
						<div className="chart-item line-chart">
							<ReactApexChart
								options={lineOptions}
								series={lineSeries}
								// height={"100%"}
								// width={"175%"}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
