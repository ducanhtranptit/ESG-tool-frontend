import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button, Spinner } from "react-bootstrap";
import QuestionAPI from "../../../api/question";
import debounce from "lodash/debounce";
import "./styles.css";

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
	answerGuide?: string;
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
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const [questions, setQuestions] = useState<Question[]>([]);
	const [answers, setAnswers] = useState<
		{ questionCode: string; answer: string | number | null }[]
	>([]);
	const [year, setYear] = useState<number | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			if (show && section) {
				try {
					setLoading(true);
					const response = await QuestionAPI.getAllData(
						section.key,
						lang
					);
					setQuestions(response.data || []);
					const initialAnswers = (response.data || []).map(
						(question: Question) => ({
							questionCode: question.questionCode,
							answer: null,
						})
					);
					setAnswers(initialAnswers);
					setLoading(false);
				} catch (error) {
					console.error("Error fetching data:", error);
					setLoading(false);
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

	const fetchAnswersForYear = async (enteredYear: number) => {
		if (enteredYear && section) {
			try {
				setLoading(true);
				const response = await QuestionAPI.getAnswersOfYear(
					enteredYear,
					section.key,
					lang
				);
				if (response.data) {
					const updatedAnswers = response.data.map(
						(answerData: {
							questionCode: string;
							answer: string | number | null;
						}) => ({
							questionCode: answerData.questionCode,
							answer: answerData.answer,
						})
					);
					setAnswers(updatedAnswers);
				} else {
				}
				setLoading(false);
			} catch (error) {
				console.error("Error fetching answers for the year:", error);
				setLoading(false);
			}
		}
	};

	const debouncedFetchAnswers = useCallback(
		debounce((enteredYear) => fetchAnswersForYear(enteredYear), 800),
		[section]
	);

	const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const enteredYear = Number(e.target.value);
		setYear(enteredYear);
		debouncedFetchAnswers(enteredYear);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!year) {
			return;
		}

		const submissionData = {
			section: section?.key,
			year: year,
			answers: answers,
		};

		try {
			await QuestionAPI.addAnswerOfCompany(submissionData, lang);
			handleClose();
			clearState();
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	};

	const clearState = () => {
		setQuestions([]);
		setAnswers([]);
		setYear(null);
	};

	const handleModalClose = () => {
		clearState();
		handleClose();
	};

	const getAnswerForQuestion = (questionCode: string) => {
		const answerObj = answers.find((a) => a.questionCode === questionCode);
		return answerObj ? answerObj.answer : "";
	};

	return (
		<Modal show={show} onHide={handleModalClose} size="xl">
			<Modal.Header closeButton>
				<Modal.Title>{section?.name}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{loading ? (
					<div
						className="d-flex justify-content-center align-items-center"
						style={{ height: "200px" }}
					>
						<Spinner animation="border" variant="primary" />
					</div>
				) : (
					<form>
						<div className="mb-4">
							<label
								htmlFor="year"
								className="form-label fw-bold h5 text-dark"
							>
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
										className="custom-question-container mb-3 col-12"
									>
										<div className="question-content">
											<label
												htmlFor={question.questionCode}
												className="form-label fw-bold h6 text-dark"
											>
												{question.name}
											</label>
											{question.answerGuide && (
												<p>
													<strong>
														Hướng dẫn trả lời:
													</strong>{" "}
													{question.answerGuide}
												</p>
											)}

											{/* Loại câu trả lời */}
											{question.type === 1 && (
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
															checked={
																getAnswerForQuestion(
																	question.questionCode
																) === "Yes"
															}
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
															name={
																question.questionCode
															}
															value="No"
															id={`${question.questionCode}-no`}
															checked={
																getAnswerForQuestion(
																	question.questionCode
																) === "No"
															}
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
															(answer) =>
																answer !== "0"
														)
														.map(
															(
																answer,
																answerIndex
															) => (
																<div
																	key={
																		answerIndex
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
																		id={`${question.questionCode}-${answerIndex}`}
																		checked={
																			getAnswerForQuestion(
																				question.questionCode
																			) ===
																			answer
																		}
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
															)
														)}
												</div>
											)}

											{question.type === 3 && (
												<input
													type="number"
													id={question.questionCode}
													className="form-control"
													placeholder="Nhập câu trả lời của bạn"
													step="any"
													value={
														getAnswerForQuestion(
															question.questionCode
														) as string
													}
													onChange={(e) =>
														handleInputChange(
															question.questionCode,
															Number(
																e.target.value
															)
														)
													}
												/>
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<p>Không có câu hỏi nào.</p>
						)}
						<Button onClick={handleSubmit}>Gửi</Button>
					</form>
				)}
			</Modal.Body>
		</Modal>
	);
};

export default QuestionFormModal;
