import React, { useState } from "react";
import { Button } from "react-bootstrap";
import QuestionFormModal from "./QuestionFormModal/index"; // Import file modal

const MetricsManagementPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false); // State để điều khiển hiển thị Modal

  return (
    <div className="container">
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Hiển thị form câu hỏi
      </Button>

      <QuestionFormModal show={showModal} handleClose={() => setShowModal(false)} />
    </div>
  );
};

export default MetricsManagementPage;
