import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChartBar, FaBuilding, FaBook, FaChevronDown } from "react-icons/fa";
import { GrScorecard } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../public/logo.png";
import "./styles.css";

const SideBar: React.FC = () => {
	const location = useLocation();
	const [showESGMenu, setShowESGMenu] = useState(false);
	const { t } = useTranslation();

	const toggleESGMenu = () => {
		setShowESGMenu(!showESGMenu);
	};

	return (
		<div className="side-bar">
			<div className="logo-container">
				<img src={logo} alt="ESG Tool Logo" className="logo-img" />
			</div>
			<hr className="divider" /> 
			<div className="menu-section">
				<h5>{t("sidebar.main")}</h5>
				<ul className="list-unstyled">
					<li
						className={`nav-item ${
							location.pathname === "/" ? "active" : ""
						}`}
					>
						<Link to="/" className="nav-link">
							<GrScorecard className="me-2" />
							{t("sidebar.esgScore")}
						</Link>
					</li>

					<li className="nav-item">
						<div
							className="nav-link d-flex justify-content-between align-items-center"
							onClick={toggleESGMenu}
							style={{ cursor: "pointer" }}
						>
							<div>
								<FaChartBar className="me-2" />
								{t("sidebar.charts")}
							</div>
							<FaChevronDown
								className={`transition-transform ${
									showESGMenu ? "rotate-180" : ""
								}`}
							/>
						</div>
						{showESGMenu && (
							<ul className="submenu list-unstyled">
								<li
									className={
										location.pathname === "/environment"
											? "active"
											: ""
									}
								>
									<Link
										to="/environment"
										className="dropdown-item"
									>
										{t("sidebar.environment")}
									</Link>
								</li>
								<li
									className={
										location.pathname === "/social"
											? "active"
											: ""
									}
								>
									<Link
										to="/social"
										className="dropdown-item"
									>
										{t("sidebar.social")}
									</Link>
								</li>
								<li
									className={
										location.pathname === "/governance"
											? "active"
											: ""
									}
								>
									<Link
										to="/governance"
										className="dropdown-item"
									>
										{t("sidebar.governance")}
									</Link>
								</li>
							</ul>
						)}
					</li>

					<li
						className={`nav-item ${
							location.pathname === "/metric-management"
								? "active"
								: ""
						}`}
					>
						<Link to="/metric-management" className="nav-link">
							<GrScorecard className="me-2" />
							{t("sidebar.metricManagement")}
						</Link>
					</li>
				</ul>
			</div>
			<div className="menu-section">
				<h5>{t("sidebar.other")}</h5>
				<ul className="">
					<li
						className={`nav-item ${
							location.pathname === "/companyinfo" ? "active" : ""
						}`}
					>
						<Link to="/companyinfo" className="nav-link">
							<FaBuilding className="me-2" />
							{t("sidebar.companyInfo")}
						</Link>
					</li>
					<li
						className={`nav-item ${
							location.pathname === "/guideline" ? "active" : ""
						}`}
					>
						<Link to="/guideline" className="nav-link">
							<FaBook className="me-2" />
							{t("sidebar.guideline")}
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default SideBar;
