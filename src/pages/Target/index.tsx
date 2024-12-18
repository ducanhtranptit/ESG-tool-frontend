import React, { useState, useEffect, useCallback } from "react";
import { Table, Spinner, Form } from "react-bootstrap";
import QuestionFormModal from "./QuestionFormModal/index";
import sectionConstant from "../../constant/section.constant";
import TargetAPI from "../../api/target";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import "./styles.css";

const TargetPage: React.FC = () => {
	const { t } = useTranslation();
	const [showModal, setShowModal] = useState(false);
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

	const formatDateToGMT7 = (isoDate: string) => {
		const date = new Date(isoDate);
		date.setHours(date.getHours() + 7); // Adjust for GMT+7
		return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
	};

	// Fetch section data
	const fetchSectionData = useCallback(
		async (year: number) => {
			setLoading(true);
			try {
				const response = await TargetAPI.getAllSectionData(year);
				console.log(response.data);
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

	// Open modal
	const handleShowModal = (
		sectionKey: string,
		sectionData: { name: string; pillar: number }
	) => {
		setCurrentSection({ key: sectionKey, ...sectionData });
		setShowModal(true);
	};

	// Close modal and refetch data
	const handleCloseModal = () => {
		setShowModal(false);
		if (year) {
			fetchSectionData(parseInt(year, 10));
		}
	};

	// Validate and fetch data when year changes
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
							<th style={{ width: "50%" }}>
								{t("metricManagement.target")}
							</th>
							<th style={{ width: "20%" }}>
								{t("metricManagement.lastModified")}
							</th>
							<th style={{ width: "30%" }}>
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
								const lastModified = sectionInfo.updatedAt
									? formatDateToGMT7(sectionInfo.updatedAt)
									: t("metricManagement.notAvailable");

								return (
									<tr key={key}>
										<td
											className="section-content"
											onClick={() =>
												handleShowModal(key, {
													name: t(
														sectionDataItem.name
													),
													pillar: sectionDataItem.pillar,
												})
											}
										>
											{t(sectionDataItem.name)}
										</td>
										<td>{lastModified}</td>
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
					show={showModal}
					handleClose={handleCloseModal}
					section={currentSection}
					year={year}
				/>
			)}
		</div>
	);
};

export default TargetPage;
