import React from "react";
import { useTranslation } from "react-i18next";

const UnauthorizedPage: React.FC = () => {
	const { t } = useTranslation();
	return (
		<div
			className="flex-column align-items-center justify-content-center vh-100 bg-light text-dark text-center"
			style={{ paddingTop: "20vh" }}
		>
			<div className="container-fluid">
				<div className="row justify-content-center">
					<div
						className="col-md-8 col-lg-6 border border-danger  p-5 bg-white shadow"
						style={{
							maxHeight: "90vh",
							textAlign: "center",
						}}
					>
						<h1 className="display-1 text-danger mb-4">401</h1>
						<h2 className="h3 mb-4">
							{t("dashboard.accessDenied")}
						</h2>
						<p className="h5 text-muted mb-4">
							{t("dashboard.noPermission")}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UnauthorizedPage;
