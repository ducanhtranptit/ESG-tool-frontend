import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Navbar, Container, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FlagIcon } from "react-flag-kit";

import logo from "../../public/logo.png";
import esgScore from "../../public/esg-score.png";
import target from "../../public/goal.png";
import analytics from "../../public/chart.png";
import AuthAPI from "../../api/auth";
import { getCookie, removeCookie } from "../../utils/cookie";
import { ACCESSTOKEN_KEY, REFRESHTOKEN_KEY } from "../../config";

import "./styles.css"; // Import updated CSS

const LandingPage: React.FC = () => {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();

	// Refs for feature sections
	const feature1Ref = useRef<HTMLDivElement>(null);
	const feature2Ref = useRef<HTMLDivElement>(null);
	const feature3Ref = useRef<HTMLDivElement>(null);

	// Handle scrolling to feature sections
	const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
		ref.current?.scrollIntoView({ behavior: "smooth" });
	};

	// Handle logout
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

	// Handle Login button click
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

	// Handle Register button click
	const handleRegisterClick = async () => {
		if (getCookie(ACCESSTOKEN_KEY)) {
			await handleLogout();
		}
		navigate("/register");
	};

	// Handle language change
	const changeToVietnamese = () => {
		i18n.changeLanguage("vi");
	};

	const changeToEnglish = () => {
		i18n.changeLanguage("en");
	};

	return (
		<>
			{/* Header */}
			<Navbar  className="landingpage-navbar shadow-sm">
				<Container className="d-flex justify-content-between align-items-center">
					{/* Logo */}
					<Navbar.Brand
						href="/"
						className="d-flex align-items-center"
					>
						<img
							src={logo}
							width="140"
							className="d-inline-block align-top me-2 logo-header"
							alt="ESG Tool"
						/>
					</Navbar.Brand>

					{/* Language Selector & Buttons */}
					<div className="landingpage-flag-container d-flex align-items-center">
						<div
							className={`flag-container ${
								i18n.language === "vi" ? "active" : ""
							}`}
							onClick={changeToVietnamese}
							style={{ marginRight: "10px" }} 
						>
							<FlagIcon code="VN" size={20} />
						</div>
						<div className="separator" />
						<div
							className={`flag-container ${
								i18n.language === "en" ? "active" : ""
							}`}
							onClick={changeToEnglish}
							style={{ marginLeft: "10px" }} 
						>
							<FlagIcon code="GB" size={20} />
						</div>

						{/* Login & Register buttons */}
						<Button
							className="me-2 btn-login"
							onClick={handleLoginClick}
						>
							{t("landingPage.login")}
						</Button>
						<Button
							className="btn-register"
							onClick={handleRegisterClick}
						>
							{t("landingPage.register")}
						</Button>
					</div>
				</Container>
			</Navbar>

			{/* Hero Section */}
			<div className="hero-section text-center">
				<Container>
					<h1 className="hero-title">
						{t("landingPage.welcome", "Welcome to ESG Tool")}
					</h1>
					<p className="hero-subtitle">
						{t(
							"landingPage.description",
							"Your all-in-one solution for ESG management, scoring, and analytics."
						)}
					</p>
					<Button
						variant="primary"
						size="lg"
						className="hero-button"
						onClick={handleLoginClick}
					>
						{t("landingPage.startNow", "Start Now")}
					</Button>
				</Container>
			</div>

			{/* Features Section */}
			<Container className="py-5">
				<h2 className="section-title text-center mb-5">
					{t("landingPage.featuresTitle", "Key Features")}
				</h2>
				<div className="features-grid">
					{/* Feature 1 Card */}
					<Card
						className="feature-card"
						onClick={() => scrollToSection(feature1Ref)}
					>
						<Card.Body>
							<Card.Title>
								{t("landingPage.esgScore", "ESG Score")}
							</Card.Title>
							<Card.Text>
								{t(
									"landingPage.esgScoreDescription",
									"Get comprehensive ESG scoring for your organization to measure sustainability."
								)}
							</Card.Text>
						</Card.Body>
					</Card>

					{/* Feature 2 Card */}
					<Card
						className="feature-card"
						onClick={() => scrollToSection(feature2Ref)}
					>
						<Card.Body>
							<Card.Title>
								{t("landingPage.analytics", "Analytics")}
							</Card.Title>
							<Card.Text>
								{t(
									"landingPage.analyticsDescription",
									"Analyze your ESG data with powerful visualization and insights."
								)}
							</Card.Text>
						</Card.Body>
					</Card>

					{/* Feature 3 Card */}
					<Card
						className="feature-card"
						onClick={() => scrollToSection(feature3Ref)}
					>
						<Card.Body>
							<Card.Title>
								{t(
									"landingPage.goalManagement",
									"Goal Management"
								)}
							</Card.Title>
							<Card.Text>
								{t(
									"landingPage.goalManagementDescription",
									"Manage and track your sustainability goals effectively."
								)}
							</Card.Text>
						</Card.Body>
					</Card>
				</div>
			</Container>

			{/* Detailed Feature Sections */}
			<Container className="py-5">
				{/* Feature 1 Detail */}
				<div ref={feature1Ref} className="feature-detail mb-5">
					<Row className="align-items-center">
						<Col md={6}>
							<h3>{t("landingPage.esgScore", "ESG Score")}</h3>
							<p
								style={{
									textAlign: "justify",
									marginRight: "20px",
									marginBottom: "10px",
								}}
							>
								{t(
									"landingPage.esgScoreDetail",
									"Our ESG Score feature provides a comprehensive evaluation of your organization's environmental, social, and governance practices. Measure your sustainability efforts accurately and identify areas for improvement."
								)}
							</p>
						</Col>
						<Col md={6}>
							<img
								src={esgScore}
								alt="ESG Score"
								className="img-fluid"
							/>
						</Col>
					</Row>
				</div>

				{/* Feature 2 Detail */}
				<div ref={feature2Ref} className="feature-detail mb-5">
					<Row className="align-items-center">
						<Col md={6} order={{ md: 1 }}>
							<img
								src={analytics}
								alt="Analytics"
								className="img-fluid"
							/>
						</Col>
						<Col md={6} order={{ md: 2 }}>
							<h3>{t("landingPage.analytics", "Analytics")}</h3>
							<p
								style={{
									textAlign: "justify",
									marginRight: "20px",
									marginBottom: "10px",
								}}
							>
								{t(
									"landingPage.analyticsDetail",
									"Dive deep into your ESG data with our Analytics feature. Utilize powerful visualization tools and gain actionable insights to drive informed decision-making and enhance your sustainability strategies."
								)}
							</p>
						</Col>
					</Row>
				</div>

				{/* Feature 3 Detail */}
				<div ref={feature3Ref} className="feature-detail mb-5">
					<Row className="align-items-center">
						<Col md={6}>
							<h3>
								{t(
									"landingPage.goalManagement",
									"Goal Management"
								)}
							</h3>
							<p
								style={{
									textAlign: "justify",
									marginRight: "20px",
									marginBottom: "10px",
								}}
							>
								{t(
									"landingPage.goalManagementDetail",
									"Set, manage, and track your sustainability goals with ease. Our Goal Management feature ensures you stay on top of your targets, monitor progress, and achieve your ESG objectives effectively."
								)}
							</p>
						</Col>
						<Col md={6}>
							<img
								src={target}
								alt="Goal Management"
								className="img-fluid"
							/>
						</Col>
					</Row>
				</div>
			</Container>

			{/* Footer */}
			<footer className="landingpage-footer text-white">
				<Container>
					<Row className="align-items-center py-4">
						{/* Logo Section */}
						<Col md={8} className="footer-logo mb-3 mb-md-0">
							<img
								src={logo}
								width="200"
								height="auto"
								alt="ESG Tool"
								className="d-inline-block"
							/>
						</Col>

						{/* Contact Us Section */}
						<Col md={4} className="text-md-end">
							<h5 className="mb-2">
								{t("landingPage.contactUsTitle", "Contact Us")}
							</h5>
							<p className="mb-1">
								<a
									href="mailto:support@example.com"
									className="footer-link"
								>
									support@example.com
								</a>
							</p>
							<p>
								<a
									href="tel:+1234567890"
									className="footer-link"
								>
									+1 234 567 890
								</a>
							</p>
						</Col>
					</Row>

					{/* Footer Bottom Text */}
					<Row>
						<Col>
							<p className="text-center mb-0 footer-bottom-text">
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
