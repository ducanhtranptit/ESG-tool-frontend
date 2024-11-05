import React, { useState, useEffect } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import QuestionFormModal from "./QuestionFormModal/index";
import sections from "../../constant/section.constant.js";
import QuestionAPI from "../../api/question";

const MetricsManagementPage: React.FC = () => {
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

	const fetchSubmitCounts = async () => {
		setLoading(true);
		try {
			const response = await QuestionAPI.getAllSectionSubmitCount();
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
			console.error("Error fetching submit counts:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSubmitCounts();
	}, []);

	const handleShowModal = (
		sectionKey: string,
		sectionData: { name: string; pillar: number }
	) => {
		setCurrentSection({ key: sectionKey, ...sectionData });
		setShowModal(true);
	};

	const handleModalClose = () => {
		setShowModal(false);
		fetchSubmitCounts();
	};

	const pillarVariants: Record<number, string> = {
		1: "success",
		2: "info",
		3: "danger",
	};

	const pillarNames: Record<number, string> = {
		1: "Môi trường",
		2: "Xã hội",
		3: "Ban Quản trị",
	};

	const sectionsByPillar = Object.entries(sections).reduce(
		(acc, [key, sectionData]) => {
			if (typeof sectionData === "object" && sectionData.pillar) {
				if (!acc[sectionData.pillar]) {
					acc[sectionData.pillar] = [];
				}
				acc[sectionData.pillar].push({ key, ...sectionData });
			}
			return acc;
		},
		{} as Record<number, { key: string; name: string; pillar: number }[]>
	);

	return (
		<Container className="my-4">
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
				Object.entries(sectionsByPillar).map(([pillar, sections]) => (
					<div key={pillar} className="mb-4">
						<h5>
							{pillarNames[parseInt(pillar)] ||
								`Pillar ${pillar}`}
						</h5>
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
										? `Sửa đổi lần cuối: ${new Date(
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
														? "text-dark"
														: "text-white"
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
				/>
			)}
		</Container>
	);
};

export default MetricsManagementPage;
