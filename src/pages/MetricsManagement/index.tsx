import React, { useState, useEffect, useCallback } from "react";
import { Button, Spinner, Form } from "react-bootstrap";
import QuestionFormModal from "./QuestionFormModal/index";
import sectionConstant from "../../constant/section.constant";
import QuestionAPI from "../../api/question";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";

const MetricsManagementPage: React.FC = () => {
	const { t } = useTranslation();
	const [showModal, setShowModal] = useState(false);
	const [currentSection, setCurrentSection] = useState<{
		key: string;
		name: string;
		pillar: number;
	} | null>(null);
	const [submitCounts, setSubmitCounts] = useState<
		Record<string, { submitCount: number; updatedAt?: string }>
	>({});
	const [loading, setLoading] = useState(true);
	const [year, setYear] = useState<string>(""); // Năm hiện tại sẽ được set ở đây
	const [yearError, setYearError] = useState<string>("");

	// Hàm để lấy số liệu về submit counts cho năm đã chọn
	const fetchSubmitCounts = useCallback(
		async (year: number) => {
			setLoading(true);
			try {
				const response = await QuestionAPI.getAllSectionSubmitCount(
					year
				);				
				const counts = response.data.reduce(
					(
						acc: Record<
							string,
							{ submitCount: number; updatedAt?: string }
						>,
						item: {
							sectionName: string;
							submitCount: number;
							updatedAt: string;
						}
					) => {
						acc[item.sectionName] = {
							submitCount: item.submitCount,
							updatedAt: item.updatedAt,
						};
						return acc;
					},
					{}
				);
				setSubmitCounts(counts);
			} catch (error) {
				console.error(t("metricManagement.fetchError"), error);
			} finally {
				setLoading(false);
			}
		},
		[t]
	);

	// Mở modal
	const handleShowModal = (
		sectionKey: string,
		sectionData: { name: string; pillar: number }
	) => {
		setCurrentSection({ key: sectionKey, ...sectionData });
		setShowModal(true);
	};

	// Đóng modal và gọi lại API với năm hiện tại
	const handleModalClose = () => {
		setShowModal(false);
		if (year) {
			fetchSubmitCounts(parseInt(year, 10)); // Gọi API với năm đã chọn
		}
	};

	// Các biến phụ trợ cho pillar
	const pillarVariants: Record<number, string> = {
		0: "primary",
		1: "success",
		2: "info",
		3: "danger",
	};

	const pillarNames: Record<number, string> = {
		0: t("metricManagement.generalInformation"),
		1: t("metricManagement.environment"),
		2: t("metricManagement.social"),
		3: t("metricManagement.governance"),
	};

	const sectionsByPillar = Object.entries(sectionConstant).reduce(
		(acc, [key, sectionData]) => {
			if (
				typeof sectionData === "object" &&
				sectionData.pillar !== undefined
			) {
				if (!acc[sectionData.pillar]) {
					acc[sectionData.pillar] = [];
				}
				acc[sectionData.pillar].push({
					key,
					name: t(sectionData.name),
					pillar: sectionData.pillar,
				});
			}
			return acc;
		},
		{} as Record<number, { key: string; name: string; pillar: number }[]>
	);

	// Hàm gọi API khi người dùng thay đổi năm (debounced)
	const validateAndFetchData = useCallback(
		debounce(async (year: number) => {
			try {
				await fetchSubmitCounts(year);
			} catch (error) {
				console.error(error);
			}
		}, 500),
		[fetchSubmitCounts]
	);

	// Xử lý khi người dùng thay đổi năm
	const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setYear(value);

		const parsedYear = parseInt(value, 10);
		if (
			!/^\d+$/.test(value) || // Kiểm tra nếu giá trị không phải là một chuỗi số
			isNaN(parsedYear) || // Kiểm tra nếu giá trị không phải là một số hợp lệ
			parsedYear < 2000 || // Kiểm tra nếu năm nhỏ hơn 2000
			parsedYear > 2100 // Kiểm tra nếu năm lớn hơn 2100
		) {
			setYearError(t("metricManagement.invalidYear")); // Nếu có lỗi, hiển thị thông báo lỗi
		} else {
			setYearError(""); // Nếu không có lỗi, xóa thông báo lỗi
			validateAndFetchData(parsedYear); // Gọi API với năm đã nhập
		}
	};

	// useEffect để set mặc định năm hiện tại
	useEffect(() => {
		const currentYear = new Date().getFullYear().toString();
		setYear(currentYear); // Set năm hiện tại
		fetchSubmitCounts(parseInt(currentYear, 10)); // Gọi API với năm hiện tại
	}, []); // Chạy 1 lần khi component render lần đầu tiên

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
				Object.entries(sectionsByPillar).map(([pillar, sections]) => (
					<div key={pillar} className="mb-4">
						<h3>
							{pillarNames[parseInt(pillar)] ||
								`${t("metricManagement.pillar")} ${pillar}`}
						</h3>
						<div
							className="d-grid gap-3"
							style={{
								gridTemplateColumns:
									"repeat(auto-fill, minmax(200px, 1fr))",
							}}
						>
							{sections.map((section) => {
								const submitInfo =
									submitCounts[section.key] || {};
								const lastUpdatedText =
									submitInfo.submitCount > 0 &&
									submitInfo.updatedAt
										? `${t(
												"metricManagement.lastModified"
										  )}: ${new Date(
												submitInfo.updatedAt
										  ).toLocaleDateString()}`
										: "";

								return (
									<Button
										key={section.key}
										variant={
											submitInfo.submitCount === 0
												? "secondary"
												: pillarVariants[
														section.pillar
												  ] || "secondary"
										}
										onClick={() =>
											handleShowModal(
												section.key,
												section
											)
										}
										className="btn"
										style={{ minHeight: "100px" }}
									>
										<div>{section.name}</div>
										{lastUpdatedText && (
											<small
												className={
													section.pillar === 2
														? "text-dark section-content"
														: "text-white section-content"
												}
											>
												{lastUpdatedText}
											</small>
										)}
									</Button>
								);
							})}
						</div>
					</div>
				))
			)}

			{currentSection && (
				<QuestionFormModal
					show={showModal}
					handleClose={handleModalClose}
					section={currentSection}
					year={year} // Truyền year vào modal
				/>
			)}
		</div>
	);
};

export default MetricsManagementPage;
