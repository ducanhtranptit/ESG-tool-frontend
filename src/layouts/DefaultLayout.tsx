import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/Sidebar/index";
import Navbar from "../components/Navbar";
const DefaultLayout: React.FC = () => {
	return (
		<div>
			<div className="row">
				<div className="col-2">
					<SideBar />
				</div>
				<div className="col-10">
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
