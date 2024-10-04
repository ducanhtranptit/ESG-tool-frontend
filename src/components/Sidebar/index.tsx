import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles.css";

const SideBar: React.FC = () => {
	const location = useLocation(); // Lấy đường dẫn hiện tại

	return (
		<div className="side-bar">
			<h1>
				<Link to="/" className="home-link">
					ESG Tool
				</Link>
			</h1>
			<ul>
				<li className={location.pathname === "/" ? "active" : ""}>
					<Link to="/">
						<p>Dashboard</p>
					</Link>
				</li>
				<li
					className={
						location.pathname === "/environment" ? "active" : ""
					}
				>
					<Link to="/environment">
						<p>Environment</p>
					</Link>
				</li>
				<li className={location.pathname === "/social" ? "active" : ""}>
					<Link to="/social">
						<p>Social</p>
					</Link>
				</li>
				<li
					className={
						location.pathname === "/government" ? "active" : ""
					}
				>
					<Link to="/government">
						<p>Governance</p>
					</Link>
				</li>
				<li
					className={
						location.pathname === "/companyinfo" ? "active" : ""
					}
				>
					<Link to="/companyinfo">
						<p>Company Info</p>
					</Link>
				</li>
				<li
					className={
						location.pathname === "/guideline" ? "active" : ""
					}
				>
					<Link to="/guideline">
						<p>Guideline</p>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default SideBar;
