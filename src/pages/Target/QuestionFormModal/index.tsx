import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button, Spinner } from "react-bootstrap";
import TargetAPI from "../../../api/target";
import { SHORT_TARGET } from "../../../constant/target-type.constant";
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

interface Answer {
	questionCode: string;
	answer: string | number | null;
	questionType: number;
}

interface QuestionFormModalProps {
	show: boolean;
	handleClose: () => void;
	section: { key: string; name: string } | null;
	year: string; // Nhận year từ prop
}

const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
	show,
	handleClose,
	section,
	year,
}) => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const [questions, setQuestions] = useState<Question[]>([]);
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			if (show && section) {
				try {
					setLoading(true);
					const response = await TargetAPI.getAllData(
						section.key,
						lang
					);
					setQuestions(response.data || []);
					const initialAnswers = (response.data || []).map(
						(question: Question) => ({
							questionCode: question.questionCode,
							answer: null,
							questionType: question.type,
						})
					);
					setAnswers(initialAnswers);

					if (year) {
						await fetchAnswersForYear(parseInt(year));
					}

					setLoading(false);
				} catch (error) {
					console.error("Error fetching data:", error);
					setLoading(false);
				}
			}
		};

		fetchData();
	}, [show, section, year, lang]);

	const fetchAnswersForYear = async (enteredYear: number) => {
		if (enteredYear && section) {
			try {
				setLoading(true);
				const response = await TargetAPI.getAnswersOfYear(
					enteredYear,
					section.key,
					lang,
					SHORT_TARGET
				);
				if (response.data) {
					const updatedAnswers = response.data.map(
						(answerData: {
							questionCode: string;
							questionType: number;
							answer: number | null;
						}) => ({
							questionCode: answerData.questionCode,
							answer: answerData.answer?.toString(),
							questionType: answerData.questionType,
						})
					);
					setAnswers(updatedAnswers);
				}
				setLoading(false);
			} catch (error) {
				console.error("Error fetching answers for the year:", error);
				setLoading(false);
			}
		}
	};

	const handleInputChange = (
		questionCode: string,
		answer: string,
		questionType: number
	) => {
		setAnswers((prevAnswers) =>
			prevAnswers.map((a) =>
				a.questionCode === questionCode
					? {
							...a,
							answer:
								questionType === 3 ? answer : answer.toString(),
					  }
					: a
			)
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!year) {
			return;
		}

		const submissionData = {
			section: section?.key,
			year: parseInt(year),
			answers: answers.map((a) => ({
				questionCode: a.questionCode,
				answer:
					a.questionType === 3
						? Number(a.answer)
						: a.answer
						? a.answer.toString()
						: null,
			})),
		};

		try {
			await TargetAPI.addAnswerOfCompany(submissionData, SHORT_TARGET);
			handleClose();
			clearState();
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	};

	const clearState = () => {
		setQuestions([]);
		setAnswers([]);
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
					<form onSubmit={handleSubmit}>
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
														{t(
															"questionForm.answerGuide"
														)}
													</strong>{" "}
													{question.answerGuide}
												</p>
											)}

											{/* Các kiểu câu trả lời */}
											{question.type === 1 && (
												<>
													<div className="form-check">
														<input
															className="form-check-input"
															type="radio"
															name={
																question.questionCode
															}
															value="1"
															id={`${question.questionCode}-1`}
															checked={
																getAnswerForQuestion(
																	question.questionCode
																) === "1"
															}
															onChange={() =>
																handleInputChange(
																	question.questionCode,
																	"1",
																	question.type
																)
															}
															disabled={!year}
														/>
														<label
															className="form-check-label"
															htmlFor={`${question.questionCode}-1`}
														>
															{t(
																"questionForm.yesAnswer"
															)}
														</label>
													</div>
													<div className="form-check">
														<input
															className="form-check-input"
															type="radio"
															name={
																question.questionCode
															}
															value="2"
															id={`${question.questionCode}-2`}
															checked={
																getAnswerForQuestion(
																	question.questionCode
																) === "2"
															}
															onChange={() =>
																handleInputChange(
																	question.questionCode,
																	"2",
																	question.type
																)
															}
															disabled={!year}
														/>
														<label
															className="form-check-label"
															htmlFor={`${question.questionCode}-2`}
														>
															{t(
																"questionForm.noAnswer"
															)}
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
																		value={(
																			answerIndex +
																			1
																		).toString()}
																		id={`${
																			question.questionCode
																		}-${
																			answerIndex +
																			1
																		}`}
																		checked={
																			getAnswerForQuestion(
																				question.questionCode
																			) ===
																			(
																				answerIndex +
																				1
																			).toString()
																		}
																		onChange={() =>
																			handleInputChange(
																				question.questionCode,
																				(
																					answerIndex +
																					1
																				).toString(),
																				question.type
																			)
																		}
																		disabled={
																			!year
																		}
																	/>
																	<label
																		className="form-check-label"
																		htmlFor={`${
																			question.questionCode
																		}-${
																			answerIndex +
																			1
																		}`}
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
													placeholder={t(
														"questionForm.enterYourAnswerPlaceHolder"
													)}
													step="any"
													value={
														getAnswerForQuestion(
															question.questionCode
														) || ""
													}
													onChange={(e) =>
														handleInputChange(
															question.questionCode,
															e.target.value,
															question.type
														)
													}
													disabled={!year}
												/>
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<p>{t("questionForm.noQuestionsAsked")}</p>
						)}
						<Button type="submit" disabled={!year}>
							{t("questionForm.submit")}
						</Button>
					</form>
				)}
			</Modal.Body>
		</Modal>
	);
};

export default QuestionFormModal;
