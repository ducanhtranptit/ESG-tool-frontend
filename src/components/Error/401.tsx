import React from "react";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";

const UnauthorizedPage: React.FC = () => {
	const { t } = useTranslation();
	const handleRegisterTool = () => {
		toast.info(t("dashboard.registerSubscriptionInfo"));
	};
	return (
		<div
			className="flex-column align-items-center justify-content-center vh-100 bg-light text-dark text-center"
			style={{ paddingTop: "20vh" }}
		>
			<ToastContainer />
			<div className="container-fluid">
				<div className="row justify-content-center">
					<div
						className="col-md-8 col-lg-6 p-5 bg-white shadow"
						style={{
							maxHeight: "90vh",
							width: "50vw",
							textAlign: "center",
						}}
					>
						<h1 className="display-1 text-danger mb-4">OOPS!</h1>
						<h2 className="h3 mb-4">
							{t("dashboard.accessDenied")}
						</h2>
						<p className="h5 text-muted mb-4">
							{t("dashboard.noPermission")}
						</p>
						{/* <button
							className="btn btn-outline-primary"
							onClick={handleRegisterTool}
						>
							{t("dashboard.registerSubscription")}
						</button> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default UnauthorizedPage;
