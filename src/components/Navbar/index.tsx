import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { removeCookie } from "../../utils/cookie";
import AuthAPI from "../../api/auth";
import "./styles.css";
import { ACCESSTOKEN_KEY, REFRESHTOKEN_KEY } from "../../config";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
	const navigate = useNavigate();
	const { i18n } = useTranslation();

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

	const toggleLanguage = () => {
		const newLanguage = i18n.language === "en" ? "vi" : "en";
		i18n.changeLanguage(newLanguage);
	};

	return (
		<div className="navbar">
			<div className="navbar-content">
				<button onClick={toggleLanguage} className="btn btn-outline-dark">
					<span>
						{i18n.language === "en" ? "vi" : "en"}
					</span>
				</button>
				<button onClick={handleLogout} className="logout-button">
					<IoIosLogOut size={40} />
				</button>
			</div>
			<hr />
		</div>
	);
};

export default Navbar;
