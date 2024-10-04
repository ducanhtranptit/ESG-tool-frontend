import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChartBar, FaBuilding, FaBook } from "react-icons/fa";
import { GrScorecard } from "react-icons/gr";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const SideBar: React.FC = () => {
	const location = useLocation();
	const [showESGMenu, setShowESGMenu] = useState(false);

	const toggleESGMenu = () => {
		setShowESGMenu(!showESGMenu);
	};

	return (
		<div className="side-bar">
			<h1>ESG Tool</h1>
			<div className="menu-section">
				<h3>Main</h3>
				<ul className="list-unstyled">
					<li
						className={`nav-item ${
							location.pathname === "/" ? "active" : ""
						}`}
					>
						<Link to="/" className="nav-link">
							<GrScorecard className="me-2" />
							ESG Score
						</Link>
					</li>

					<li className="nav-item">
						<div
							className={`nav-link ${
								showESGMenu ? "active" : ""
							}`}
							onClick={toggleESGMenu}
							style={{ cursor: "pointer" }}
						>
							<FaChartBar className="me-2" />
							E-S-G Charts
						</div>
						{showESGMenu && (
							<ul className="submenu list-unstyled ms-4">
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
										Environment
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
										Social
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
										Governance
									</Link>
								</li>
							</ul>
						)}
					</li>
				</ul>
			</div>
			<div className="menu-section">
				<h3>Other</h3>
				<ul className="">
					<li
						className={`nav-item ${
							location.pathname === "/companyinfo" ? "active" : ""
						}`}
					>
						<Link to="/companyinfo" className="nav-link">
							<FaBuilding className="me-2" />
							Company Info
						</Link>
					</li>
					<li
						className={`nav-item ${
							location.pathname === "/guideline" ? "active" : ""
						}`}
					>
						<Link to="/guideline" className="nav-link">
							<FaBook className="me-2" />
							Guideline
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default SideBar;
