import React from "react";
import { useTranslation } from "react-i18next";
import logo from "../../public/logo.png";
import { Navbar, Container, Button, Row, Col } from "react-bootstrap";
import { getCookie, removeCookie } from "../../utils/cookie";
import { ACCESSTOKEN_KEY, REFRESHTOKEN_KEY } from "../../config";
import { useNavigate } from "react-router-dom";
import AuthAPI from "../../api/auth";
import "./styles.css";

const LandingPage: React.FC = () => {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await AuthAPI.logout();
			removeCookie(ACCESSTOKEN_KEY);
			removeCookie(REFRESHTOKEN_KEY);
			localStorage.removeItem("user");
			navigate("/");
		} catch (error) {
			console.error("Error during logout", error);
		}
	};

	const handleLoginClick = () => {
		if (getCookie(ACCESSTOKEN_KEY)) {
			const user = JSON.parse(localStorage.getItem("user") || "{}");
			if (user?.userType === 3) {
				navigate("/app/companyinfo");
			} else {
				navigate("/app/dashboard");
			}
		} else {
			navigate("/login");
		}
	};

	const handleRegisterClick = async () => {
		if (getCookie(ACCESSTOKEN_KEY)) {
			await handleLogout();
		}
		navigate("/register");
	};

	// Hàm xử lý khi người dùng thay đổi ngôn ngữ từ dropdown
	const handleChangeLanguage = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		i18n.changeLanguage(event.target.value);
	};

	return (
		<>
			{/* Header */}
			<Navbar
				expand="lg"
				className="py-3 landingpage-heading"
				style={{ height: "50px" }}
			>
				<Container>
					{/* Logo */}
					<Navbar.Brand href="/">
						<img
							src={logo}
							width="120"
							height="auto"
							className="d-inline-block align-top"
							alt="Logo ESG Tool"
						/>
					</Navbar.Brand>

					{/* Login & Register button */}
					<div className="d-flex">
						<Button
							className="me-2 custom-login-btn"
							onClick={handleLoginClick}
						>
							Login
						</Button>
						<Button
							className="custom-register-btn"
							onClick={handleRegisterClick}
						>
							Register
						</Button>
					</div>
				</Container>
				<div className="language-switcher">
					<select
						className="language-dropdown"
						onChange={handleChangeLanguage}
						value={i18n.language}
					>
						<option value="vi">Tiếng Việt</option>
						<option value="en">English</option>
					</select>
				</div>
			</Navbar>

			{/* Hero Section */}
			<div className="text-center py-5">
				<Container>
					<h1 className="display-4 fw-bold">
						{t("landingPage.welcome")}
					</h1>
					<p className="lead my-4">{t("landingPage.description")}</p>
					<Button
						variant="primary"
						size="lg"
						onClick={handleLoginClick}
					>
						{t("landingPage.startNow")}
					</Button>
				</Container>
			</div>

			{/* Features Section */}
			<Container className="py-5">
				<h2 className="text-center">
					{t("landingPage.featuresTitle")}
				</h2>
				<div className="grid-container">
					<div className="landing-page-card">
						<h3 className="landing-page-card-title">
							{t("landingPage.esgScore")}
						</h3>
						<p className="landing-page-card-text">
							{t("landingPage.esgScoreDescription")}
						</p>
					</div>
					<div className="landing-page-card">
						<h3 className="landing-page-card-title">
							{t("landingPage.analytics")}
						</h3>
						<p className="landing-page-card-text">
							{t("landingPage.analyticsDescription")}
						</p>
					</div>
					<div className="landing-page-card">
						<h3 className="landing-page-card-title">
							{t("landingPage.goalManagement")}
						</h3>
						<p className="landing-page-card-text">
							{t("landingPage.companyInfoDescription")}
						</p>
					</div>
				</div>
			</Container>

			{/* Additional Info Section */}
			<div className="py-5">
				<Container>
					<Row>
						<Col md={6}>
							<h3>{t("landingPage.companyInfo")}</h3>
							<p>{t("landingPage.companyInfoDescription")}</p>
						</Col>
						<Col md={6}>
							<h3>{t("landingPage.guide")}</h3>
							<p>{t("landingPage.guideDescription")}</p>
						</Col>
					</Row>
				</Container>
			</div>

			{/* Footer */}
			<footer className="text-black py-4 landingpage-footer">
				<Container>
					<Row className="align-items-center">
						{/* Logo Section */}
						<Col md={10} className="logo-footer">
							<img
								src={logo}
								width="300"
								height="90"
								alt="Logo ESG Tool"
								className="d-inline-block"
							/>
						</Col>

						{/* Contact Us Section */}
						<Col md={2} className="contact-us">
							<h5>
								{t("landingPage.contactUsTitle", "Contact Us")}
							</h5>
							<p>
								<a
									href="mailto:support@example.com"
									className="text-black text-decoration-none"
								>
									support@example.com
								</a>
							</p>
							<p>
								<a
									href="tel:+1234567890"
									className="text-black text-decoration-none"
								>
									+1 234 567 890
								</a>
							</p>
						</Col>
					</Row>

					{/* Footer Bottom Text */}
					<Row className="mt-3">
						<Col>
							<p className="text-center mb-0">
								{t(
									"landingPage.footerBottomText",
									"Copyright © 2025 Tradeanalytics"
								)}
							</p>
						</Col>
					</Row>
				</Container>
			</footer>
		</>
	);
};

export default LandingPage;
