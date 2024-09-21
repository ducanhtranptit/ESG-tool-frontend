import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
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
		<nav className="navbar">
			<div className="navbar-content">
				<button onClick={handleLogout} className="logout-button">
					<FaSignOutAlt size={24} />
				</button>
			</div>
		</nav>
	);
};

export default Navbar;
