import React, { useState, useEffect, useCallback } from "react";
import { Table, Spinner, Form } from "react-bootstrap";
import QuestionFormModal from "./QuestionFormModal/index";
import MetricFormModal from "./MetricFormModal";
import sectionConstant from "../../constant/section.constant";
import TargetAPI from "../../api/target";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import "./styles.css";

const TargetPage: React.FC = () => {
	const { t } = useTranslation();
	const [showQuestionModal, setShowQuestionModal] = useState(false);
	const [showMetricModal, setShowMetricModal] = useState(false);
	const [currentSection, setCurrentSection] = useState<{
		key: string;
		name: string;
		pillar: number;
	} | null>(null);
	const [sectionData, setSectionData] = useState<
		Record<string, { percentileCompleted: number; updatedAt?: string }>
	>({});
	const [loading, setLoading] = useState(true);
	const [year, setYear] = useState<string>("");
	const [yearError, setYearError] = useState<string>("");

	const fetchSectionData = useCallback(
		async (year: number) => {
			setLoading(true);
			try {
				const response = await TargetAPI.getAllSectionData(year);
				const data = response.data.reduce(
					(
						acc: Record<
							string,
							{ percentileCompleted: number; updatedAt?: string }
						>,
						item: {
							sectionName: string;
							percentileCompleted: number;
							updatedAt: string;
						}
					) => {
						acc[item.sectionName] = {
							percentileCompleted: item.percentileCompleted,
							updatedAt: item.updatedAt,
						};
						return acc;
					},
					{}
				);
				setSectionData(data);
			} catch (error) {
				console.error(t("metricManagement.fetchError"), error);
			} finally {
				setLoading(false);
			}
		},
		[t]
	);

	const handleShowQuestionModal = (
		sectionKey: string,
		sectionData: { name: string; pillar: number }
	) => {
		setCurrentSection({ key: sectionKey, ...sectionData });
		setShowQuestionModal(true);
	};

	const handleShowMetricModal = (
		sectionKey: string,
		sectionData: { name: string; pillar: number }
	) => {
		setCurrentSection({ key: sectionKey, ...sectionData });
		setShowMetricModal(true);
	};

	const handleCloseModals = () => {
		setShowQuestionModal(false);
		setShowMetricModal(false);
		if (year) {
			fetchSectionData(parseInt(year, 10));
		}
	};

	const validateAndFetchData = useCallback(
		debounce(async (year: number) => {
			await fetchSectionData(year);
		}, 500),
		[fetchSectionData]
	);

	const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setYear(value);
		const parsedYear = parseInt(value, 10);
		if (isNaN(parsedYear) || parsedYear < 2000 || parsedYear > 2100) {
			setYearError(t("metricManagement.invalidYear"));
		} else {
			setYearError("");
			validateAndFetchData(parsedYear);
		}
	};

	useEffect(() => {
		const currentYear = new Date().getFullYear().toString();
		setYear(currentYear);
		fetchSectionData(parseInt(currentYear, 10));
	}, [fetchSectionData]);

	return (
		<div className="content">
			{/* <h2>{t("metricManagement.namePage")}</h2> */}
			<Form.Group controlId="yearInput" className="mb-4">
				<Form.Label>{t("metricManagement.enterYear")}</Form.Label>
				<Form.Control
					type="number"
					value={year}
					onChange={handleYearChange}
					placeholder={t("metricManagement.yearPlaceholder")}
					isInvalid={!!yearError}
				/>
				<Form.Control.Feedback type="invalid">
					{yearError}
				</Form.Control.Feedback>
			</Form.Group>

			{loading ? (
				<div
					className="d-flex justify-content-center align-items-center"
					style={{ height: "80vh" }}
				>
					<Spinner animation="border" role="status">
						<span className="visually-hidden">
							{t("metricManagement.loading")}
						</span>
					</Spinner>
				</div>
			) : (
				<Table striped bordered>
					<thead>
						<tr>
							<th style={{ width: "45%" }}>
								{t("metricManagement.name")}
							</th>
							<th style={{ width: "15%" }}>
								{t("metricManagement.target")}
							</th>
							<th style={{ width: "15%" }}>
								{t("metricManagement.metric")}
							</th>
							<th style={{ width: "25%" }}>
								{t("metricManagement.percentileCompleted")}
							</th>
						</tr>
					</thead>
					<tbody>
						{Object.entries(sectionConstant).map(
							([key, sectionDataItem]) => {
								const sectionInfo = sectionData[key] || {};
								const percentileCompleted = parseFloat(
									(
										sectionInfo.percentileCompleted || 0
									).toFixed(2)
								);

								return (
									<tr key={key}>
										<td>{t(sectionDataItem.name)}</td>
										<td>
											<a
												className="view-modal"
												onClick={() =>
													handleShowQuestionModal(
														key,
														{
															name: t(
																sectionDataItem.name
															),
															pillar: sectionDataItem.pillar,
														}
													)
												}
											>
												{t("metricManagement.view")}
											</a>
										</td>
										<td>
											<a
												className="view-modal"
												onClick={() =>
													handleShowMetricModal(key, {
														name: t(
															sectionDataItem.name
														),
														pillar: sectionDataItem.pillar,
													})
												}
											>
												{t("metricManagement.view")}
											</a>
										</td>
										<td>{percentileCompleted}%</td>
									</tr>
								);
							}
						)}
					</tbody>
				</Table>
			)}

			{currentSection && (
				<QuestionFormModal
					show={showQuestionModal}
					handleClose={handleCloseModals}
					section={currentSection}
					year={year}
				/>
			)}

			{currentSection && (
				<MetricFormModal
					show={showMetricModal}
					handleClose={handleCloseModals}
					section={currentSection}
					year={year}
				/>
			)}
		</div>
	);
};

export default TargetPage;
