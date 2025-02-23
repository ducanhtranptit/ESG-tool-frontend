import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCookie } from "../utils/cookie";
import { ACCESSTOKEN_KEY } from "../config";

const AuthLayout: React.FC = () => {
	const navigate = useNavigate();

	useEffect(() => {
		if (getCookie(ACCESSTOKEN_KEY)) {
			navigate("/app/dashboard");
		}
	}, [navigate]);

	return (
		<div>
			<Outlet />
		</div>
	);
};

export default AuthLayout;
