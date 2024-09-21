import { useNavigate } from "react-router-dom";
import { useEffect, useState, ReactNode } from "react";
import { getCookie } from "../utils/cookie";
import { ACCESSTOKEN_KEY } from "../config";
import UserAPI from "../api/user";

interface PrivateRouteProps {
	children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
	const navigate = useNavigate();
	const [show, setShow] = useState(false);

	useEffect(() => {
		const handleGetProfile = async () => {
			await UserAPI.getProfile();
			setShow(true);
			if (!getCookie(ACCESSTOKEN_KEY)) {
				navigate("/login");
			}
		};
		handleGetProfile();
	}, [navigate]);

	return show ? <div>{children}</div> : null;
};

export default PrivateRoute;
