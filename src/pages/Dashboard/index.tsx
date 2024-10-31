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

	const generateOptions = (label: string): ApexOptions => ({
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
			type: "gradient",
			gradient: {
				shade: "dark",
				type: "horizontal",
				shadeIntensity: 0.5,
				gradientToColors: ["#ABE5A1"],
				stops: [0, 100],
			},
		},
		stroke: { lineCap: "round" },
		labels: [label],
	});

	const pieOptions: ApexOptions = {
		chart: { type: "pie" },
		labels: ["Environmental", "Social", "Governance"],
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
		currentData?.environmental * 100 || 0,
		currentData?.social * 100 || 0,
		currentData?.governance * 100 || 0,
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
						<h2 className="overview-title">OVERVIEW</h2>
						<p className="company-name">
							<span className="company-name-bold">
								{data && data.company
									? data.company.name
									: "Loading..."}
							</span>
							<span className="report-text">
								{" "}
								Annual ESG Report
							</span>
						</p>
					</div>

					<div className="select-group">
						<label htmlFor="year">Choose Year</label>
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
							options={generateOptions("ESG Score")}
							series={[currentData?.esg * 100 || 0]}
							type="radialBar"
							height={150}
						/>
						<p className="rank-label">
							Rank: {currentData?.esgRank}
						</p>
					</div>
					<div className="chart-item">
						<ReactApexChart
							options={generateOptions("Environmental")}
							series={[currentData?.environmental * 100 || 0]}
							type="radialBar"
							height={150}
						/>
						<p className="rank-label">
							Rank: {currentData?.environmentRank}
						</p>
					</div>
					<div className="chart-item">
						<ReactApexChart
							options={generateOptions("Social")}
							series={[currentData?.social * 100 || 0]}
							type="radialBar"
							height={150}
						/>
						<p className="rank-label">
							Rank: {currentData?.socialRank}
						</p>
					</div>
					<div className="chart-item">
						<ReactApexChart
							options={generateOptions("Governance")}
							series={[currentData?.governance * 100 || 0]}
							type="radialBar"
							height={150}
						/>
						<p className="rank-label">
							Rank: {currentData?.governanceRank}
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
						height={300}
						width={300}
					/>
				</div>
				<div className="chart-item line-chart">
					<ReactApexChart
						options={lineOptions}
						series={lineSeries}
						height={300}
						width={"100%"}
					/>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
