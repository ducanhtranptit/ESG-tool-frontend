import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import QuestionAPI from "../../../api/question";

interface Question {
	questionCode: string;
	name: string;
	type: number;
	answer1: string;
	answer2: string;
	answer3: string;
	answer4: string;
	answer5: string;
	answer6: string;
	answer7: string;
	answer8: string;
	answer9: string;
	answer10: string;
	answerGuide?: string; // Added answerGuide property
}

interface QuestionFormModalProps {
	show: boolean;
	handleClose: () => void;
	section: { key: string; name: string } | null;
}

const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
	show,
	handleClose,
	section,
}) => {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [answers, setAnswers] = useState<
		{ questionCode: string; answer: string | number | null }[]
	>([]);
	const [year, setYear] = useState<number | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (show && section) {
				try {
					const response = await QuestionAPI.getAllData(section.key);
					setQuestions(response.data || []);
					console.log(response.data);
					const initialAnswers = (response.data || []).map(
						(question: Question) => ({
							questionCode: question.questionCode,
							answer: null,
						})
					);
					setAnswers(initialAnswers);
				} catch (error) {
					console.error("Error fetching data:", error);
					toast.error("Error fetching data. Please try again.");
				}
			}
		};

		fetchData();
	}, [show, section]);

	const handleInputChange = (
		questionCode: string,
		answer: string | number
	) => {
		setAnswers((prevAnswers) =>
			prevAnswers.map((a) =>
				a.questionCode === questionCode ? { ...a, answer } : a
			)
		);
	};

	const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setYear(Number(e.target.value));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!year) {
			toast.error("Hãy nhập năm hiện tại!");
			return;
		}

		const submissionData = {
			year: year,
			answers: answers,
		};

		try {
			await QuestionAPI.addAnswerOfCompany(submissionData);
			toast.success("Dữ liệu đã được gửi thành công!");
			handleClose();
		} catch (error) {
			console.error("Error submitting data:", error);
			toast.error("Lỗi khi gửi dữ liệu, vui lòng thử lại.");
		}
	};

	return (
		<Modal show={show} onHide={handleClose} size="xl">
			<Modal.Header closeButton>
				<Modal.Title>{section?.name}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form>
					<div className="mb-4">
						<label htmlFor="year" className="form-label fw-bold h5 text-dark">
							Nhập năm:
						</label>
						<input
							type="number"
							id="year"
							className="form-control"
							placeholder="Nhập năm"
							value={year ?? ""}
							onChange={handleYearChange}
						/>
					</div>

					{questions.length > 0 ? (
						<div className="row">
							{questions.map((question, index) => (
								<div
									key={index}
									className="question-container mb-3 col-12"
								>
									<label
										htmlFor={question.questionCode}
										className="form-label fw-bold h6 text-dark"
									>
										{question.name}
									</label>
									{/* Display answerGuide if available */}
									{question.answerGuide && (
										<p>
											<strong>Hướng dẫn trả lời:</strong>{" "}
											{question.answerGuide}
										</p>
									)}

									{/* Display question types */}
									{question.type === 1 && (
										<>
											<div className="form-check">
												<input
													className="form-check-input"
													type="radio"
													name={question.questionCode}
													value="Yes"
													id={`${question.questionCode}-yes`}
													onChange={() =>
														handleInputChange(
															question.questionCode,
															"Yes"
														)
													}
												/>
												<label
													className="form-check-label"
													htmlFor={`${question.questionCode}-yes`}
												>
													Có
												</label>
											</div>
											<div className="form-check">
												<input
													className="form-check-input"
													type="radio"
													name={question.questionCode}
													value="No"
													id={`${question.questionCode}-no`}
													onChange={() =>
														handleInputChange(
															question.questionCode,
															"No"
														)
													}
												/>
												<label
													className="form-check-label"
													htmlFor={`${question.questionCode}-no`}
												>
													Không
												</label>
											</div>
										</>
									)}

									{question.type === 2 && (
										<div>
											{[
												question.answer1,
												question.answer2,
												question.answer3,
												question.answer4,
												question.answer5,
												question.answer6,
												question.answer7,
												question.answer8,
												question.answer9,
												question.answer10,
											]
												.filter(
													(answer) => answer !== "0"
												)
												.map((answer, answerIndex) => (
													<div
														key={answerIndex}
														className="form-check"
													>
														<input
															className="form-check-input"
															type="radio"
															name={
																question.questionCode
															}
															value={answer}
															id={`${question.questionCode}-${answerIndex}`}
															onChange={() =>
																handleInputChange(
																	question.questionCode,
																	answer
																)
															}
														/>
														<label
															className="form-check-label"
															htmlFor={`${question.questionCode}-${answerIndex}`}
														>
															{answer}
														</label>
													</div>
												))}
										</div>
									)}

									{question.type === 3 && (
										<input
											type="number"
											id={question.questionCode}
											className="form-control"
											placeholder="Nhập câu trả lời của bạn"
											step="any"
											onChange={(e) =>
												handleInputChange(
													question.questionCode,
													Number(e.target.value)
												)
											}
										/>
									)}
								</div>
							))}
						</div>
					) : (
						<p>No questions available.</p>
					)}
					<Button onClick={handleSubmit}>Submit</Button>
				</form>
			</Modal.Body>
		</Modal>
	);
};

export default QuestionFormModal;
