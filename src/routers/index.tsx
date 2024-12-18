import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Dashboard from "../pages/Dashboard/index";
import CompanyInfo from "../pages/CompanyInfor/index";
import Environment from "../pages/Charts/Environment/index";
import Government from "../pages/Charts/Goverment/index";
import Social from "../pages/Charts/Social/index";
import GuideLinePage from "../pages/GuideLine";
import MetricsManagementPage from "../pages/MetricsManagement";
import TargetPage from "../pages/Target";
import Login from "../pages/Auth/login";
import PrivateRoute from "./PrivateRouter";
import DefaultLayout from "../layouts/DefaultLayout";
import AuthLayout from "../layouts/AuthLayout";
import NotFoundPage from "../components/Error/404";
import { getCookie } from "../utils/cookie";
import { ACCESSTOKEN_KEY } from "../config";

const DefaultRouter: React.FC = () => {
	return (
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
				<Route path="/charts">
					<Route path="environment" element={<Environment />} />
					<Route path="governance" element={<Government />} />
					<Route path="social" element={<Social />} />
				</Route>
				<Route
					path="/metric-management"
					element={<MetricsManagementPage />}
				/>
				<Route path="target" element={<TargetPage />} />
				<Route path="/companyinfo" element={<CompanyInfo />} />
				<Route path="/guideline" element={<GuideLinePage />} />
			</Route>
			<Route path="/login" element={<AuthLayout />}>
				<Route index element={<Login />} />
			</Route>
			<Route
				path="*"
				element={
					getCookie(ACCESSTOKEN_KEY) ? (
						<NotFoundPage />
					) : (
						<Navigate to="/login" replace />
					)
				}
			/>
		</Routes>
	);
};

export default DefaultRouter;
