import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { removeCookie } from "../../utils/cookie";
import AuthAPI from "../../api/auth";
import "./styles.css";
import { ACCESSTOKEN_KEY, REFRESHTOKEN_KEY } from "../../config";

const Navbar: React.FC = () => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await AuthAPI.logout();
			removeCookie(ACCESSTOKEN_KEY);
			removeCookie(REFRESHTOKEN_KEY);
			navigate("/login");
		} catch (error) {
			console.error("Error during logout", error);
		}
	};

	return (
		<div className="navbar">
			<div className="navbar-content">
				<button onClick={handleLogout} className="logout-button">
					<IoIosLogOut size={40} />
				</button>
			</div>
			<hr />
		</div>
	);
};

export default Navbar;
