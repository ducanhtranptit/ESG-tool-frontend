import { Form } from "react-bootstrap";
import "./styles.css";
import { useState, FormEvent } from "react";
import AuthAPI from "../../../api/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCookie } from "../../../utils/cookie";
import { ACCESSTOKEN_KEY, REFRESHTOKEN_KEY } from "../../../config";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/logo.png";
import { useTranslation } from "react-i18next";

interface FormData {
	username: string;
	password: string;
}

const Login: React.FC = () => {
	const { t } = useTranslation();
	const initialState: FormData = {
		username: "",
		password: "",
	};

	const navigate = useNavigate();
	const [formData, setFormData] = useState<FormData>(initialState);

	// Handle logo click to navigate to "/"
	const handleLogoClick = () => {
		navigate("/"); // Navigate to root path
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formData.username.trim()) {
			toast.error(t("login.errorUsername"));
			return;
		}
		if (!formData.password.trim()) {
			toast.error(t("login.errorPassword"));
			return;
		}
		try {
			const response = await AuthAPI.login(formData);
			if (response?.status !== 200) {
				toast.error(t("login.errorLogin"));
				return;
			}
			if (response?.data) {
				setCookie(ACCESSTOKEN_KEY, response.data.accessToken, {
					expires: 0.5,
				});
				setCookie(REFRESHTOKEN_KEY, response.data.refreshToken, {
					expires: 1,
				});
				localStorage.setItem(
					"user",
					JSON.stringify(response.data.user)
				);
				if (response.data.user.userType === 3) {
					navigate("/app/companyinfo");
				} else {
					navigate("/app/dashboard");
				}
			}
		} catch (error) {
			toast.error(t("login.errorGeneral"));
		}
	};

	return (
		<div className="login-page">
			<ToastContainer />
			<div className="container">
				<div className="form-login">
					<div className="logo-container">
						{/* Logo Image with onClick to navigate to "/" */}
						<img
							src={logo}
							alt="ESG Tool Logo"
							className="logo-img"
							style={{ cursor: "pointer" }}
							onClick={handleLogoClick} // Handle logo click
						/>
					</div>
					<p
						className="admin-login-text"
						style={{ fontSize: "16px" }}
					>
						{t("login.title")}
					</p>

					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="formBasicEmail" className="mb-3">
							<Form.Label>{t("login.username")}</Form.Label>
							<Form.Control
								placeholder={t("login.username")}
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
							className="mb-4"
						>
							<Form.Label>{t("login.password")}</Form.Label>
							<Form.Control
								type="password"
								placeholder={t("login.password")}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										password: e.target.value,
									}))
								}
							/>
						</Form.Group>

						<div className="button-group">
							<button type="submit" className="btn btn-success">
								{t("login.submit")}
							</button>
						</div>
					</Form>

					<p className="mt-3m register-text">
						{t("login.noAccount")}{" "}
						<a
							className="login-link"
							onClick={() => navigate("/register")}
						>
							{t("login.registerHere")}
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
