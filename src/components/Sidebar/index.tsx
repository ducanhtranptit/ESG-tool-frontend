import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChartBar, FaBuilding, FaBook, FaChevronDown } from "react-icons/fa";
import { AiFillCaretRight } from "react-icons/ai";
import { GrScorecard } from "react-icons/gr";
import { TbTargetArrow } from "react-icons/tb";
import { RiDashboard2Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../public/logo.png";
import "./styles.css";

const SideBar: React.FC = () => {
	const location = useLocation();
	const [showESGMenu, setShowESGMenu] = useState(false);
	const [username, setUsername] = useState<string>("");
	const navigate = useNavigate();
	const { t } = useTranslation();

	// Toggle dropdown menu
	const toggleESGMenu = () => {
		setShowESGMenu((prev) => !prev); // Luôn thay đổi trạng thái đóng/mở
	};

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user) {
			const parsedUser = JSON.parse(user);
			setUsername(parsedUser.username || "Guest");
		} else {
			setUsername("Guest");
		}
	}, []);

	useEffect(() => {
		// Close dropdown if navigating outside of the Charts section
		if (!location.pathname.startsWith("/charts")) {
			setShowESGMenu(false);
		}
	}, [location.pathname]);

	const getInitial = (name: string) => name.charAt(0).toUpperCase();

	const handleClickUserCard = () => {
		navigate("/companyinfo");
	};

	// Check if current path is a chart item
	const isChartItemSelected =
		location.pathname.startsWith("/charts/environment") ||
		location.pathname.startsWith("/charts/social") ||
		location.pathname.startsWith("/charts/governance");

	return (
		<div className="side-bar">
			<div className="logo-container">
				<img src={logo} alt="ESG Tool Logo" className="logo-img" />
			</div>
			<hr className="divider" />
			<div className="user-card" onClick={handleClickUserCard}>
				<div className="user-avatar">{getInitial(username)}</div>
				<div className="user-name">{username}</div>
				<div>
					<AiFillCaretRight />
				</div>
			</div>
			<div className="menu-section" style={{ paddingTop: "5vh" }}>
				<h5>{t("sidebar.main")}</h5>
				<ul className="list-unstyled">
					<li
						className={`nav-item ${
							location.pathname === "/" ? "active" : ""
						}`}
					>
						<Link
							to="/"
							className={`nav-link ${
								location.pathname === "/" ? "hover" : ""
							}`}
						>
							<RiDashboard2Line
								style={{ fontSize: "1.5rem" }}
								className="me-2"
							/>
							{t("sidebar.esgScore")}
						</Link>
					</li>

					<li className="nav-item">
						<div
							className={`nav-link d-flex justify-content-between align-items-center ${
								isChartItemSelected ? "hover" : ""
							}`}
							onClick={toggleESGMenu}
							style={{ cursor: "pointer" }}
						>
							<div>
								<FaChartBar
									style={{ fontSize: "1.4rem" }}
									className="me-2"
								/>
								{t("sidebar.charts")}
							</div>
							<FaChevronDown
								className={`transition-transform ${
									showESGMenu ? "rotate-180" : ""
								}`}
							/>
						</div>
						{showESGMenu && (
							<ul className="submenu list-unstyled show">
								<li
									className={`nav-item ${
										location.pathname ===
										"/charts/environment"
											? "active"
											: ""
									}`}
								>
									<Link
										to="/charts/environment"
										className={`dropdown-item ${
											location.pathname ===
											"/charts/environment"
												? "hover"
												: ""
										}`}
									>
										{t("sidebar.environment")}
									</Link>
								</li>
								<li
									className={`nav-item ${
										location.pathname === "/charts/social"
											? "active"
											: ""
									}`}
								>
									<Link
										to="/charts/social"
										className={`dropdown-item ${
											location.pathname ===
											"/charts/social"
												? "hover"
												: ""
										}`}
									>
										{t("sidebar.social")}
									</Link>
								</li>
								<li
									className={`nav-item ${
										location.pathname ===
										"/charts/governance"
											? "active"
											: ""
									}`}
								>
									<Link
										to="/charts/governance"
										className={`dropdown-item ${
											location.pathname ===
											"/charts/governance"
												? "hover"
												: ""
										}`}
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
						<Link
							to="/metric-management"
							className={`nav-link ${
								location.pathname === "/metric-management"
									? "hover"
									: ""
							}`}
						>
							<GrScorecard
								style={{ fontSize: "1.4rem" }}
								className="me-2"
							/>
							{t("sidebar.metricManagement")}
						</Link>
					</li>
					<li
						className={`nav-item ${
							location.pathname === "/target" ? "active" : ""
						}`}
					>
						<Link
							to="/target"
							className={`nav-link ${
								location.pathname === "/target" ? "hover" : ""
							}`}
						>
							<TbTargetArrow
								style={{ fontSize: "1.4rem" }}
								className="me-2"
							/>
							{t("sidebar.target")}
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
							<FaBuilding
								style={{ fontSize: "1.29rem" }}
								className="me-2"
							/>
							{t("sidebar.companyInfo")}
						</Link>
					</li>
					<li
						className={`nav-item ${
							location.pathname === "/guideline" ? "active" : ""
						}`}
					>
						<Link to="/guideline" className="nav-link">
							<FaBook
								style={{ fontSize: "1.35rem" }}
								className="me-2"
							/>
							{t("sidebar.guideline")}
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default SideBar;
