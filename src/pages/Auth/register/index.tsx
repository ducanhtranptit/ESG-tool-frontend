import { Form } from "react-bootstrap";
import "./styles.css";
import { useState, FormEvent } from "react";
import AuthAPI from "../../../api/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

interface FormData {
	username: string;
	password: string;
	confirmPassword: string;
}
 
const Register: React.FC = () => {
	const initialState: FormData = {
		username: "",
		password: "",
		confirmPassword: "",
	};

	const navigate = useNavigate();
	const [formData, setFormData] = useState<FormData>(initialState);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!formData.username.trim()) {
			toast.error("Vui lòng nhập tên người dùng");
			return;
		}
		if (!formData.password.trim()) {
			toast.error("Vui lòng nhập mật khẩu");
			return;
		}
		if (formData.password !== formData.confirmPassword) {
			toast.error("Mật khẩu không khớp");
			return;
		}

		try {
			const response = await AuthAPI.register({
				username: formData.username,
				password: formData.password,
			});

			if (response?.status !== 200) {
				toast.error("Đăng ký không thành công");
				return;
			}

			toast.success("Đăng ký thành công!");
			navigate("/login");
		} catch (error) {
			toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
		}
	};

	return (
		<div className="login-page">
			<ToastContainer />
			<div className="container">
				<div className="form-login">
					<span className="title-login">
						Gia phả gia đình cụ Trần Văn Thông
					</span>
					<span className="admin-login-text">Đăng ký tài khoản</span>
					<Form onSubmit={handleSubmit}>
						<Form.Group
							controlId="formBasicUsername"
							className="mt-3"
						>
							<Form.Label>Tên người dùng</Form.Label>
							<Form.Control
								placeholder="Vui lòng nhập tên người dùng"
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
							className="mt-3"
						>
							<Form.Label>Mật khẩu</Form.Label>
							<Form.Control
								type="password"
								placeholder="Vui lòng nhập mật khẩu"
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										password: e.target.value,
									}))
								}
							/>
						</Form.Group>

						<Form.Group
							controlId="formConfirmPassword"
							className="mt-3"
						>
							<Form.Label>Xác nhận mật khẩu</Form.Label>
							<Form.Control
								type="password"
								placeholder="Vui lòng nhập lại mật khẩu"
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										confirmPassword: e.target.value,
									}))
								}
							/>
						</Form.Group>

						<button type="submit" className="btn btn-primary mt-4">
							Đăng ký
						</button>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default Register;
