import React, { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
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
	const [submitCounts, setSubmitCounts] = useState<Record<string, number>>(
		{}
	);

	const fetchSubmitCounts = async () => {
		try {
			const response = await QuestionAPI.getAllSectionSubmitCount();
			console.log(response.data);
			const counts = response.data.reduce(
				(
					acc: Record<string, number>,
					item: { sectionName: string; submitCount: number }
				) => {
					acc[item.sectionName] = item.submitCount;
					return acc;
				},
				{}
			);
			console.log("counts: ", counts);
			setSubmitCounts(counts);
		} catch (error) {
			console.error("Error fetching submit counts:", error);
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
		1: "outline-success",
		2: "outline-primary",
		3: "outline-danger",
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
			{Object.entries(sectionsByPillar).map(([pillar, sections]) => (
				<div key={pillar} className="mb-4">
					<h5>
						{pillarNames[parseInt(pillar)] || `Pillar ${pillar}`}
					</h5>
					<div
						className="d-grid gap-3"
						style={{
							gridTemplateColumns:
								"repeat(auto-fill, minmax(200px, 1fr))",
						}}
					>
						{sections.map((section) => (
							<Button
								key={section.key}
								variant={
									submitCounts[section.key] === 0
										? "outline-dark"
										: pillarVariants[section.pillar] ||
										  "outline-dark"
								}
								onClick={() =>
									handleShowModal(section.key, section)
								}
								className="btn"
								style={{ minHeight: "100px" }}
							>
								{section.name}
							</Button>
						))}
					</div>
				</div>
			))}

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
