import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardAPI from "../../api/dashboard";
import { ApexOptions } from "apexcharts";
import "./styles.css";

const Dashboard: React.FC = () => {
	const [data, setData] = useState<any>(null);
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const [years, setYears] = useState<number[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await DashboardAPI.getAllData();
				console.log(response.data);
				setData(response.data);
				const availableYears = response.data.company.data.map(
					(entry: any) => entry.year
				);
				setYears(availableYears);
				if (availableYears.length > 0) {
					setSelectedYear(availableYears[availableYears.length - 1]);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Error fetching data. Please try again.");
				setData("Failed to fetch data.");
			}
		};

		fetchData();
	}, []);

	const currentData = data?.company?.data?.find(
		(entry: any) => entry.year === selectedYear
	);

	const getColor = (score: number) => {
		if (score < 25) return "#fc0808";
		else if (score < 50) return "#FFFF00";
		else if (score < 75) return "#0000FF";
		else return "#32a834";
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
					dropShadow: {
						enabled: false,
						top: 2,
						left: 0,
						color: "#999",
						opacity: 1,
						blur: 2,
					},
				},
				hollow: {
					margin: 0,
					size: "60%",
					background: "transparent",
				},
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
		fill: {
			colors: [getColor(score)],
		},
		stroke: { lineCap: "round" },
		labels: [label],
	});

	const pieOptions: ApexOptions = {
		chart: { type: "pie" },
		labels: ["Environmental Weight", "Social Weight", "Governance Weight"],
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
		chart: {
			type: "line",
			height: 450,
			zoom: { enabled: true },
		},
		dataLabels: { enabled: false },
		stroke: {
			curve: "straight",
			width: 2,
		},
		title: { text: "E-S-G Score Over Time", align: "left" },
		xaxis: { categories: years },
		yaxis: {
			title: { text: "Score" },
			labels: { formatter: (val) => val.toFixed(2).toString() },
		},
		legend: { position: "top" },
	};

	const lineSeries = [
		{
			name: "Environmental",
			data:
				data?.company?.data.map(
					(entry: any) => entry.environmental * 100
				) || [],
		},
		{
			name: "Social",
			data:
				data?.company?.data.map((entry: any) => entry.social * 100) ||
				[],
		},
		{
			name: "Governance",
			data:
				data?.company?.data.map(
					(entry: any) => entry.governance * 100
				) || [],
		},
	];

	return (
		<div className="dashboard-container">
			<ToastContainer />

			<div className="top-section">
				<div className="left-panel">
					<div className="title-container">
						<h2 className="overview-title">TỔNG QUAN</h2>
						<p className="company-name">
							<span className="company-name-bold">
								{data && data.company
									? data.company.name
									: "Loading..."}
							</span>
							<span className="report-text">
								{" "}
								Báo cáo ESG hàng năm
							</span>
						</p>
					</div>

					<div className="select-group">
						<label htmlFor="year">Chọn năm</label>
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
							Thứ hạng: {currentData?.esgRank}
						</p>
					</div>
					<div className="chart-item">
						<ReactApexChart
							options={generateOptions(
								"Environmental",
								currentData?.environmental * 100 || 0
							)}
							series={[currentData?.environmental * 100 || 0]}
							type="radialBar"
							height={150}
						/>
						<p className="rank-label">
							Thứ hạng: {currentData?.environmentRank}
						</p>
					</div>
					<div className="chart-item">
						<ReactApexChart
							options={generateOptions(
								"Social",
								currentData?.social * 100 || 0
							)}
							series={[currentData?.social * 100 || 0]}
							type="radialBar"
							height={150}
						/>
						<p className="rank-label">
							Thứ hạng: {currentData?.socialRank}
						</p>
					</div>
					<div className="chart-item">
						<ReactApexChart
							options={generateOptions(
								"Governance",
								currentData?.governance * 100 || 0
							)}
							series={[currentData?.governance * 100 || 0]}
							type="radialBar"
							height={150}
						/>
						<p className="rank-label">
							Thứ hạng: {currentData?.governanceRank}
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
		</div>
	);
};

export default Dashboard;
