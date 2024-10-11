import React, { useState, useEffect } from "react";
import CompanyInforAPI from "../../api/companyinfor";
import { Spinner, Table, Button } from "react-bootstrap";
import "./styles.css";
import EditCompanyDetailModal from "./EditCompanyDetailModal/index";

interface OverallInfor {
	id: number;
	companyName: string;
	dateFounder: number;
	mainAddress: string;
	mainPhoneNumber: string;
	companyWebsite: string;
	companySector: string;
	companyDescription: string;
	contactInformation: string;
	netIncome: number;
	totalRevenue: number;
	fullTimeEmployee: number;
	partTimeEmployee: number;
}

interface SiteInfor {
	id: number;
	siteName: string;
	numberEmployees: number;
	comment: string;
}

interface ProductInfor {
	id: number;
	productName: string;
	revenue: number;
	comment: string;
}

interface CompanyDetails {
	overallInfor: OverallInfor[];
	siteInfors: SiteInfor[];
	productInfors: ProductInfor[];
}

const CompanyPage: React.FC = () => {
	const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(
		null
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);

	const fetchCompany = async () => {
		try {
			const response = await CompanyInforAPI.getAllCompanyInfor();
			if (response.status === 200) {
				setCompanyDetails(response.data);
			} else {
				console.error("Failed to fetch company");
			}
		} catch (error) {
			console.error("Error fetching company:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCompany();
	}, []);

	if (loading) {
		return <Spinner animation="border" />;
	}

	if (!companyDetails) {
		return <p>No company information available.</p>;
	}

	const overallInfor = companyDetails.overallInfor[0];
	const siteInfors = companyDetails.siteInfors;
	const productInfors = companyDetails.productInfors;

	const handleOpenEditModal = () => {
		setShowEditModal(true);
	};

	const handleCloseEditModal = () => {
		setShowEditModal(false);
	};

	return (
		<div className="container">
			<h2>Company Information</h2>
			<h3>{overallInfor.companyName}</h3>

			<p>
				<strong>Date Founder:</strong> {overallInfor.dateFounder}
			</p>
			<p>
				<strong>Main Address:</strong> {overallInfor.mainAddress}
			</p>
			<p>
				<strong>Main Phone Number:</strong>{" "}
				{overallInfor.mainPhoneNumber}
			</p>
			<p>
				<strong>Company Website:</strong>{" "}
				<a
					href={overallInfor.companyWebsite}
					target="_blank"
					rel="noopener noreferrer"
				>
					{overallInfor.companyWebsite}
				</a>
			</p>
			<p>
				<strong>Company Sector:</strong> {overallInfor.companySector}
			</p>
			<p>
				<strong>Company Description:</strong>{" "}
				{overallInfor.companyDescription}
			</p>
			<p>
				<strong>Contact Information:</strong>
			</p>
			<div
				dangerouslySetInnerHTML={{
					__html: overallInfor.contactInformation,
				}}
			/>

			<hr />
			<p>
				<strong>Total Revenue:</strong> {overallInfor.totalRevenue}
			</p>
			<p>
				<strong>Net Income:</strong> {overallInfor.netIncome}
			</p>

			<hr />
			<p>
				<strong>Full Time Employees:</strong>{" "}
				{overallInfor.fullTimeEmployee}
			</p>
			<p>
				<strong>Part Time Employees:</strong>{" "}
				{overallInfor.partTimeEmployee}
			</p>

			<hr />
			<p>
				<strong>Site Information:</strong>
			</p>
			{companyDetails.siteInfors.length > 0 ? (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Site Name</th>
							<th>Number of Employees</th>
							<th>Comment</th>
						</tr>
					</thead>
					<tbody>
						{companyDetails.siteInfors.map((site) => (
							<tr key={site.id}>
								<td>{site.siteName}</td>
								<td>{site.numberEmployees}</td>
								<td>{site.comment}</td>
							</tr>
						))}
					</tbody>
				</Table>
			) : (
				<p>No site information available.</p>
			)}

			<hr />
			<p>
				<strong>Product Information:</strong>
			</p>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Product Name</th>
						<th>Revenue</th>
						<th>Comment</th>
					</tr>
				</thead>
				<tbody>
					{companyDetails.productInfors.map((product) => (
						<tr key={product.id}>
							<td>{product.productName}</td>
							<td>{product.revenue}</td>
							<td>{product.comment}</td>
						</tr>
					))}
				</tbody>
			</Table>
			<Button variant="primary">
				Edit Company Information (comming soon!)
			</Button>
			{overallInfor && (
				<EditCompanyDetailModal
					show={showEditModal}
					handleClose={handleCloseEditModal}
					companyDetails={overallInfor}
					siteInfors={siteInfors} 
					productInfors={productInfors} 
				/>
			)}
		</div>
	);
};

export default CompanyPage;
