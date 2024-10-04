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
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/register";
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
				</Route>
				<Route path="/login" element={<AuthLayout />}>
					<Route index element={<Login />} />
				</Route>
				<Route path="/register" element={<AuthLayout />}>
					<Route index element={<Register />} />
				</Route>
			</Routes>
		</Router>
	);
};

export default App;
