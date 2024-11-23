import React from "react";
import { useNavigate } from "react-router-dom";
import { removeCookie } from "../../utils/cookie";
import AuthAPI from "../../api/auth";
import { ACCESSTOKEN_KEY, REFRESHTOKEN_KEY } from "../../config";
import { useTranslation } from "react-i18next";
import { FlagIcon } from "react-flag-kit";
import "./styles.css";

const Navbar: React.FC = () => {
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();

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

	const changeToVietnamese = () => {
		i18n.changeLanguage("vi");
	};
	const changeToEnglish = () => {
		i18n.changeLanguage("en");
	};

	return (
		<div className="navbar">
			<div className="navbar-content">
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
				<button onClick={handleLogout} className="logout-button">
					{t("navbar.logout")}
				</button>
			</div>
		</div>
	);
};

export default Navbar;
