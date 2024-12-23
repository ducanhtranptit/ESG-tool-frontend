import { Form } from "react-bootstrap";
import "./styles.css";
import { useState, FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/logo.png";
import { useTranslation } from "react-i18next";
import { FlagIcon } from "react-flag-kit";
import AuthAPI from "../../../api/auth";

interface FormData {
	username: string;
	password: string;
	confirmPassword: string;
	companyName: string;
	foundingYear: string;
	mainPhoneNumber: string;
	sector: string;
	companyCode: string;
}

const Register: React.FC = () => {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();

	const initialState: FormData = {
		username: "",
		password: "",
		confirmPassword: "",
		companyName: "",
		foundingYear: "",
		mainPhoneNumber: "",
		sector: "",
		companyCode: "",
	};

	const [formData, setFormData] = useState<FormData>(initialState);
	const [passwordError, setPasswordError] = useState<string | null>(null);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (
			!formData.username.trim() ||
			!formData.password.trim() ||
			!formData.confirmPassword.trim()
		) {
			toast.error(t("register.errorRequiredFields"));
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			toast.error(t("register.errorPasswordMismatch"));
			return;
		}

		try {
			await AuthAPI.register(formData);
			toast.success(t("register.success"));
			navigate("/login");
		} catch (error) {
			console.error("Registration error:", error);
			toast.error(t("register.errorGeneral"));
		}
	};

	const changeToVietnamese = () => {
		i18n.changeLanguage("vi");
	};

	const changeToEnglish = () => {
		i18n.changeLanguage("en");
	};

	return (
		<div className="register-page">
			<ToastContainer />
			<div className="container">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "20px",
					}}
				>
					<div>
						<img
							src={logo}
							alt="ESG Tool Logo"
							className="logo-img"
							style={{ height: "50px" }}
						/>
					</div>
					<div className="language-switcher">
						<div
							className={`flag-container ${
								i18n.language === "vi" ? "active" : ""
							}`}
							onClick={changeToVietnamese}
						>
							<span role="img" aria-label="Vietnam Flag">
								<FlagIcon code="VN" size={20} />
							</span>
						</div>
						<div className="separator" />
						<div
							className={`flag-container ${
								i18n.language === "en" ? "active" : ""
							}`}
							onClick={changeToEnglish}
						>
							<span role="img" aria-label="UK Flag">
								<FlagIcon code="GB" size={20} />
							</span>
						</div>
					</div>
				</div>

				<div className="form-register">
					<h2>{t("register.title")}</h2>
					<Form onSubmit={handleSubmit}>
						<div className="row">
							<div className="col">
								<Form.Group
									controlId="formBasicUsername"
									className="form-group"
								>
									<Form.Label>
										{t("register.username")}
									</Form.Label>
									<Form.Control
										placeholder={t("register.username")}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												username: e.target.value,
											}))
										}
									/>
								</Form.Group>

								<Form.Group
									controlId="formBasicPassword"
									className="form-group"
								>
									<Form.Label>
										{t("register.password")}
									</Form.Label>
									<Form.Control
										type="password"
										placeholder={t("register.password")}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												password: e.target.value,
											}))
										}
									/>
								</Form.Group>

								<Form.Group
									controlId="formBasicConfirmPassword"
									className="form-group"
								>
									<Form.Label>
										{t("register.confirmPassword")}
									</Form.Label>
									<Form.Control
										type="password"
										placeholder={t(
											"register.confirmPassword"
										)}
										onChange={(e) => {
											const value = e.target.value;
											setFormData((prev) => ({
												...prev,
												confirmPassword: value,
											}));

											if (value !== formData.password) {
												setPasswordError(
													t(
														"register.errorPasswordMismatch"
													)
												);
											} else {
												setPasswordError(null);
											}
										}}
									/>
									{passwordError && (
										<div>{passwordError}</div>
									)}
								</Form.Group>

								<Form.Group
									controlId="formBasicCompanyName"
									className="form-group"
								>
									<Form.Label>
										{t("register.companyName")}
									</Form.Label>
									<Form.Control
										placeholder={t("register.companyName")}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												companyName: e.target.value,
											}))
										}
									/>
								</Form.Group>
							</div>
							<div className="col">
								<Form.Group
									controlId="formBasicFoundingYear"
									className="form-group"
								>
									<Form.Label>
										{t("register.foundingYear")}
									</Form.Label>
									<Form.Control
										placeholder={t("register.foundingYear")}
										type="number"
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												foundingYear: e.target.value,
											}))
										}
									/>
								</Form.Group>

								<Form.Group
									controlId="formBasicMainPhoneNumber"
									className="form-group"
								>
									<Form.Label>
										{t("register.mainPhoneNumber")}
									</Form.Label>
									<Form.Control
										placeholder={t(
											"register.mainPhoneNumber"
										)}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												mainPhoneNumber: e.target.value,
											}))
										}
									/>
								</Form.Group>

								<Form.Group
									controlId="formBasicSector"
									className="form-group"
								>
									<Form.Label>
										{t("register.sector")}
									</Form.Label>
									<Form.Control
										placeholder={t("register.sector")}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												sector: e.target.value,
											}))
										}
									/>
								</Form.Group>

								<Form.Group
									controlId="formBasicCompanyCode"
									className="form-group"
								>
									<Form.Label>
										{t("register.companyCode")}
									</Form.Label>
									<Form.Control
										placeholder={t("register.companyCode")}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												companyCode: e.target.value,
											}))
										}
									/>
								</Form.Group>
							</div>
						</div>
						<div
							className="mt-3"
							style={{
								marginBottom: "20px", // Thêm khoảng cách giữa div và button
							}}
						>
							<span
								style={{
									color: "red",
									marginBottom: "5px",
								}}
							>
								* {t("register.companyCodeNote")}
							</span>
							<span>{t("register.companyCodeTooltip")}</span>
						</div>

						<button type="submit" className="btn btn-success">
							{t("register.submit")}
						</button>
					</Form>

					<p className="mt-3">
						{t("register.backToLogin")}{" "}
						<button
							className="btn btn-link"
							onClick={() => navigate("/login")}
						>
							{t("register.loginHere")}
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
