import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/Sidebar/index";
import Navbar from "../components/Navbar";
import { wrap } from "module";
const DefaultLayout: React.FC = () => {
	return (
		<div>
			<div className="row" style={{ flexWrap: "nowrap" }}>
				<div style={{ display: "flex", width: "250px" }}>
					<SideBar />
				</div>
				<div
					style={{
						flex: 1,
						maxWidth: "calc(100vw)",
						backgroundColor: "white",
						height: "100vw",
					}}
				>
					<Navbar />
					<div>
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
};

export default DefaultLayout;
