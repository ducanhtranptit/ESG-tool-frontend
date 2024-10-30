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
}

interface Topic {
	topicCode?: string;
	name: string;
	answerGuide?: string;
	questions: Question[];
}

interface QuestionFormModalProps {
	show: boolean;
	handleClose: () => void;
}

const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
	show,
	handleClose,
}) => {
	const [data, setData] = useState<Topic[]>([]);
	const [answers, setAnswers] = useState<
		{ questionCode: string; answer: string | number | null }[]
	>([]);
	const [year, setYear] = useState<number | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await QuestionAPI.getAllData();
				setData(response.data);
				const initialAnswers = response.data.flatMap((topic: Topic) =>
					topic.questions.map((question: Question) => ({
						questionCode: question.questionCode,
						answer: null,
					}))
				);
				setAnswers(initialAnswers);
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Error fetching data. Please try again.");
			}
		};

		fetchData();
	}, []);

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
			toast.error("Please enter the year.");
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
				<Modal.Title>Form câu hỏi</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form>
					<div className="mb-4">
						<label htmlFor="year" className="form-label">
							Enter Year:
						</label>
						<input
							type="number"
							id="year"
							className="form-control"
							placeholder="Enter the year"
							value={year ?? ""}
							onChange={handleYearChange}
						/>
					</div>

					{data.length > 0 ? (
						<div className="row">
							{data.map((topic, index) => (
								<div
									key={index}
									className="topic-container card p-3 mb-3 col-12 shadow-sm"
								>
									<h4>{topic.name}</h4>
									{topic.answerGuide && (
										<p>
											<strong>Answer Guide:</strong>{" "}
											{topic.answerGuide}
										</p>
									)}
									{topic.questions.length > 0 ? (
										<div>
											<strong>Question:</strong>{" "}
											{topic.questions.map(
												(
													question: Question,
													qIndex: number
												) => (
													<div
														key={qIndex}
														className="mb-3"
													>
														<label
															htmlFor={
																question.questionCode
															}
															className="form-label"
														>
															{question.name}
														</label>
														{/* Radio buttons */}
														{question.type ===
															1 && (
															<>
																<div className="form-check">
																	<input
																		className="form-check-input"
																		type="radio"
																		name={
																			question.questionCode
																		}
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
																		Yes
																	</label>
																</div>
																<div className="form-check">
																	<input
																		className="form-check-input"
																		type="radio"
																		name={
																			question.questionCode
																		}
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
																		No
																	</label>
																</div>
															</>
														)}

														{/* Multiple choice */}
														{question.type ===
															2 && (
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
																		(
																			answer
																		) =>
																			answer !==
																			"0"
																	)
																	.map(
																		(
																			answer,
																			index
																		) => (
																			<div
																				key={
																					index
																				}
																				className="form-check"
																			>
																				<input
																					className="form-check-input"
																					type="radio"
																					name={
																						question.questionCode
																					}
																					value={
																						answer
																					}
																					id={`${question.questionCode}-${index}`}
																					onChange={() =>
																						handleInputChange(
																							question.questionCode,
																							answer
																						)
																					}
																				/>
																				<label
																					className="form-check-label"
																					htmlFor={`${question.questionCode}-${index}`}
																				>
																					{
																						answer
																					}
																				</label>
																			</div>
																		)
																	)}
															</div>
														)}

														{/* Number input */}
														{question.type ===
															3 && (
															<input
																type="number"
																id={
																	question.questionCode
																}
																className="form-control"
																placeholder="Enter your answer"
																step="any"
																onChange={(e) =>
																	handleInputChange(
																		question.questionCode,
																		Number(
																			e
																				.target
																				.value
																		)
																	)
																}
															/>
														)}
													</div>
												)
											)}
										</div>
									) : (
										<p>
											No questions available for this
											topic.
										</p>
									)}
								</div>
							))}
						</div>
					) : (
						<p>No data available.</p>
					)}
					<Button onClick={handleSubmit}>Submit</Button>
				</form>
			</Modal.Body>
		</Modal>
	);
};

export default QuestionFormModal;
