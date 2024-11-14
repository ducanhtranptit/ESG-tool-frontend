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

interface FormData {
	username: string;
	password: string;
}

const Login: React.FC = () => {
	const initialState: FormData = {
		username: "",
		password: "",
	};

	const navigate = useNavigate();
	const [formData, setFormData] = useState<FormData>(initialState);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formData.username.trim()) {
			toast.error("Vui lòng nhập username");
			return;
		}
		if (!formData.password.trim()) {
			toast.error("Vui lòng nhập mật khẩu");
			return;
		}
		try {
			const response = await AuthAPI.login(formData);
			if (response?.status !== 200) {
				toast.error("Tài khoản hoặc mật khẩu không chính xác");
				return;
			}
			if (response?.data) {
				setCookie(ACCESSTOKEN_KEY, response.data.accessToken, {
					expires: 0.5,
				});
				setCookie(REFRESHTOKEN_KEY, response.data.refreshToken, {
					expires: 1,
				});
				navigate("/");
			}
		} catch (error) {
			toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
		}
	};

	return (
		<div className="login-page">
			<ToastContainer />
			<div className="container">
				<div className="form-login">
					<div className="logo-container">
						<img
							src={logo}
							alt="ESG Tool Logo"
							className="logo-img"
						/>
					</div>
					<p
						className="admin-login-text"
						style={{ fontSize: "16px" }}
					>
						Enter your details to login
					</p>

					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="formBasicEmail" className="mb-3">
							<Form.Label>Username:</Form.Label>
							<Form.Control
								placeholder="Username"
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
							<Form.Label>Password:</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
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
								Đăng nhập
							</button>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default Login;
