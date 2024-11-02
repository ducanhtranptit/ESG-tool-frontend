import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import QuestionFormModal from "./QuestionFormModal/index";
import sections from "../../constant/section.constant.js";

const MetricsManagementPage: React.FC = () => {
	const [showModal, setShowModal] = useState(false);
	const [currentSection, setCurrentSection] = useState<{
		key: string;
		name: string;
	} | null>(null);

	const handleShowModal = (sectionKey: string, sectionName: string) => {
		setCurrentSection({ key: sectionKey, name: sectionName }); // Truyền cả key và name vào modal
		setShowModal(true);
	};

	return (
		<Container className="my-4">
			<div
				className="d-grid gap-3"
				style={{
					gridTemplateColumns:
						"repeat(auto-fill, minmax(200px, 1fr))",
				}}
			>
				{Object.entries(sections).map(([key, sectionName]) => (
					<Button
						key={key}
						variant="primary"
						onClick={() => handleShowModal(key, sectionName)}
						className="text-center"
						style={{ minHeight: "60px" }}
					>
						{sectionName} {/* Hiển thị tên section chữ thường */}
					</Button>
				))}
			</div>

			{currentSection && (
				<QuestionFormModal
					show={showModal}
					handleClose={() => setShowModal(false)}
					section={currentSection} // Truyền đối tượng { key, name } vào modal
				/>
			)}
		</Container>
	);
};

export default MetricsManagementPage;
