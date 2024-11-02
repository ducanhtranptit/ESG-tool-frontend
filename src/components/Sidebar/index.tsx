import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChartBar, FaBuilding, FaBook, FaChevronDown } from "react-icons/fa";
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
				<h3>Chính</h3>
				<ul className="list-unstyled">
					<li
						className={`nav-item ${
							location.pathname === "/" ? "active" : ""
						}`}
					>
						<Link to="/" className="nav-link">
							<GrScorecard className="me-2" />
							Điểm ESG
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
								Đồ thị
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
										Môi trường
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
										Xã hội
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
										Ban quản trị
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
							Quản lý thông số
						</Link>
					</li>
				</ul>
			</div>
			<div className="menu-section">
				<h3>Khác</h3>
				<ul className="">
					<li
						className={`nav-item ${
							location.pathname === "/companyinfo" ? "active" : ""
						}`}
					>
						<Link to="/companyinfo" className="nav-link">
							<FaBuilding className="me-2" />
							Thông tin công ty
						</Link>
					</li>
					<li
						className={`nav-item ${
							location.pathname === "/guideline" ? "active" : ""
						}`}
					>
						<Link to="/guideline" className="nav-link">
							<FaBook className="me-2" />
							Hướng dẫn
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default SideBar;
