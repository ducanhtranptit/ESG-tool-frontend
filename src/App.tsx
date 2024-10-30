import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Dashboard from "./pages/Dashboard/index";
import CompanyInfo from "./pages/CompanyInfor/index";
import Environment from "./pages/Environment/index";
import Government from "./pages/Goverment/index";
import Social from "./pages/Social/index";
import GuideLinePage from "./pages/GuideLine";
import MetricsManagementPage from "./pages/MetricsManagement";
import Login from "./pages/Auth/login";
import PrivateRoute from "./routers/PrivateRouter";
import DefaultLayout from "./layouts/DefaultLayout";
import AuthLayout from "./layouts/AuthLayout";

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<PrivateRoute>
							<DefaultLayout />
						</PrivateRoute>
					}
				>
					<Route index element={<Dashboard />} />
					<Route path="/companyinfo" element={<CompanyInfo />} />
					<Route path="/environment" element={<Environment />} />
					<Route path="/governance" element={<Government />} />
					<Route path="/social" element={<Social />} />
					<Route path="/guideline" element={<GuideLinePage />} />
					<Route
						path="/metric-management"
						element={<MetricsManagementPage />}
					/>
				</Route>
				<Route path="/login" element={<AuthLayout />}>
					<Route index element={<Login />} />
				</Route>
			</Routes>
		</Router>
	);
};

export default App;
