import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import CompanyInforAPI from "../../../api/companyinfor";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

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

interface EditCompanyDetailModalProps {
	show: boolean;
	handleClose: () => void;
	companyDetails: OverallInfor;
	siteInfors: SiteInfor[];
	productInfors: ProductInfor[];
}

const EditCompanyDetailModal: React.FC<EditCompanyDetailModalProps> = ({
	show,
	handleClose,
	companyDetails,
	siteInfors,
	productInfors,
}) => {
	const [companyName, setCompanyName] = useState(companyDetails.companyName);
	const [dateFounder, setDateFounder] = useState(
		companyDetails.dateFounder.toString()
	);
	const [mainAddress, setMainAddress] = useState(companyDetails.mainAddress);
	const [mainPhoneNumber, setMainPhoneNumber] = useState(
		companyDetails.mainPhoneNumber
	);
	const [companyWebsite, setCompanyWebsite] = useState(
		companyDetails.companyWebsite
	);
	const [companySector, setCompanySector] = useState(
		companyDetails.companySector
	);
	const [companyDescription, setCompanyDescription] = useState(
		companyDetails.companyDescription
	);
	const [totalRevenue, setTotalRevenue] = useState(
		companyDetails.totalRevenue.toString()
	);
	const [netIncome, setNetIncome] = useState(
		companyDetails.netIncome.toString()
	);
	const [fullTimeEmployees, setFullTimeEmployees] = useState(
		companyDetails.fullTimeEmployee.toString()
	);
	const [partTimeEmployees, setPartTimeEmployees] = useState(
		companyDetails.partTimeEmployee.toString()
	);
	const [contactInformation, setContactInformation] = useState(
		companyDetails.contactInformation
	);

	const [siteInformation, setSiteInformation] = useState([...siteInfors]);
	const [productInformation, setProductInformation] = useState([
		...productInfors,
	]);

	useEffect(() => {
		setCompanyName(companyDetails.companyName);
		setDateFounder(companyDetails.dateFounder.toString());
		setMainAddress(companyDetails.mainAddress);
		setMainPhoneNumber(companyDetails.mainPhoneNumber);
		setCompanyWebsite(companyDetails.companyWebsite);
		setCompanySector(companyDetails.companySector);
		setCompanyDescription(companyDetails.companyDescription);
		setTotalRevenue(companyDetails.totalRevenue.toString());
		setNetIncome(companyDetails.netIncome.toString());
		setFullTimeEmployees(companyDetails.fullTimeEmployee.toString());
		setPartTimeEmployees(companyDetails.partTimeEmployee.toString());
		setContactInformation(companyDetails.contactInformation);
		setSiteInformation([...siteInfors]);
		setProductInformation([...productInfors]);
	}, [companyDetails, siteInfors, productInfors]);

	const handleSiteChange = (
		index: number,
		field: string,
		value: string | number
	) => {
		const updatedSites = [...siteInformation];
		updatedSites[index] = { ...updatedSites[index], [field]: value };
		setSiteInformation(updatedSites);
	};

	const handleAddSite = () => {
		setSiteInformation([
			...siteInformation,
			{ id: Date.now(), siteName: "", numberEmployees: 0, comment: "" },
		]);
	};

	const handleRemoveSite = (index: number) => {
		const updatedSites = siteInformation.filter((_, i) => i !== index);
		setSiteInformation(updatedSites);
	};

	// Handle product information changes
	const handleProductChange = (
		index: number,
		field: string,
		value: string | number
	) => {
		const updatedProducts = [...productInformation];
		updatedProducts[index] = { ...updatedProducts[index], [field]: value };
		setProductInformation(updatedProducts);
	};

	const handleAddProduct = () => {
		setProductInformation([
			...productInformation,
			{ id: Date.now(), productName: "", revenue: 0, comment: "" },
		]);
	};

	const handleRemoveProduct = (index: number) => {
		const updatedProducts = productInformation.filter(
			(_, i) => i !== index
		);
		setProductInformation(updatedProducts);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const updatedCompanyDetails = {
			companyName,
			dateFounder,
			mainAddress,
			mainPhoneNumber,
			companyWebsite,
			companySector,
			companyDescription,
			totalRevenue: parseInt(totalRevenue),
			netIncome: parseInt(netIncome),
			fullTimeEmployees: parseInt(fullTimeEmployees),
			partTimeEmployees: parseInt(partTimeEmployees),
			contactInformation,
			siteInformation,
			productInformation,
		};

		try {
			const response = await CompanyInforAPI.updateCompanyInfor(
				updatedCompanyDetails
			);
			console.log("Response from server:", response);
			toast.success("Chỉnh sửa thông tin thành công!");
			handleClose();
		} catch (error) {
			console.error("Error updating company info:", error);
			toast.error("Có lỗi xảy ra khi cập nhật thông tin!");
		}
	};

	return (
		<Modal show={show} onHide={handleClose} centered size="xl">
			<Modal.Header closeButton>
				<Modal.Title>Edit Company Information</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form onSubmit={handleSubmit}>
					<h4>Overall information</h4>
					<div className="form-group">
						<label>Company Name</label>
						<input
							type="text"
							className="form-control"
							value={companyName}
							onChange={(e) => setCompanyName(e.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<label>Date Founded</label>
						<input
							type="text"
							className="form-control"
							value={dateFounder}
							onChange={(e) => setDateFounder(e.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<label>Main Address</label>
						<input
							type="text"
							className="form-control"
							value={mainAddress}
							onChange={(e) => setMainAddress(e.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<label>Main Phone Number</label>
						<input
							type="text"
							className="form-control"
							value={mainPhoneNumber}
							onChange={(e) => setMainPhoneNumber(e.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<label>Company Website</label>
						<input
							type="text"
							className="form-control"
							value={companyWebsite}
							onChange={(e) => setCompanyWebsite(e.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<label>Company Sector</label>
						<input
							type="text"
							className="form-control"
							value={companySector}
							onChange={(e) => setCompanySector(e.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<label>Company Description</label>
						<input
							type="text"
							className="form-control"
							value={companyDescription}
							onChange={(e) =>
								setCompanyDescription(e.target.value)
							}
							required
						/>
					</div>
					<div className="form-group">
						<label>Total Revenue</label>
						<input
							type="number"
							className="form-control"
							value={totalRevenue}
							onChange={(e) => setTotalRevenue(e.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<label>Net Income</label>
						<input
							type="number"
							className="form-control"
							value={netIncome}
							onChange={(e) => setNetIncome(e.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<label>Full Time Employees</label>
						<input
							type="number"
							className="form-control"
							value={fullTimeEmployees}
							onChange={(e) =>
								setFullTimeEmployees(e.target.value)
							}
							required
						/>
					</div>
					<div className="form-group">
						<label>Part Time Employees</label>
						<input
							type="number"
							className="form-control"
							value={partTimeEmployees}
							onChange={(e) =>
								setPartTimeEmployees(e.target.value)
							}
							required
						/>
					</div>
					<div className="form-group">
						<label>Contact Information</label>
						<ReactQuill
							value={contactInformation}
							onChange={setContactInformation}
							className="custom-quill-editor"
						/>
					</div>

					<br />
					<h4>Site Information</h4>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Site Name</th>
								<th>Number of Employees</th>
								<th>Comment</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{siteInformation.map((site, index) => (
								<tr key={index}>
									<td>
										<input
											type="text"
											className="form-control"
											value={site.siteName}
											onChange={(e) =>
												handleSiteChange(
													index,
													"siteName",
													e.target.value
												)
											}
											required
										/>
									</td>
									<td>
										<input
											type="number"
											className="form-control"
											value={site.numberEmployees}
											onChange={(e) =>
												handleSiteChange(
													index,
													"numberEmployees",
													parseInt(e.target.value)
												)
											}
											required
										/>
									</td>
									<td>
										<input
											type="text"
											className="form-control"
											value={site.comment}
											onChange={(e) =>
												handleSiteChange(
													index,
													"comment",
													e.target.value
												)
											}
										/>
									</td>
									<td>
										<Button
											variant="danger"
											onClick={() =>
												handleRemoveSite(index)
											}
										>
											Remove
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Button variant="primary" onClick={handleAddSite}>
						Add Site
					</Button>

					<br />
					<h4 className="mt-4">Product Information</h4>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Product Name</th>
								<th>Revenue</th>
								<th>Comment</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{productInformation.map((product, index) => (
								<tr key={index}>
									<td>
										<input
											type="text"
											className="form-control"
											value={product.productName}
											onChange={(e) =>
												handleProductChange(
													index,
													"productName",
													e.target.value
												)
											}
											required
										/>
									</td>
									<td>
										<input
											type="number"
											className="form-control"
											value={product.revenue}
											onChange={(e) =>
												handleProductChange(
													index,
													"revenue",
													parseInt(e.target.value)
												)
											}
											required
										/>
									</td>
									<td>
										<input
											type="text"
											className="form-control"
											value={product.comment}
											onChange={(e) =>
												handleProductChange(
													index,
													"comment",
													e.target.value
												)
											}
										/>
									</td>
									<td>
										<Button
											variant="danger"
											onClick={() =>
												handleRemoveProduct(index)
											}
										>
											Remove
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Button variant="primary" onClick={handleAddProduct}>
						Add Product
					</Button>

					<br />
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button variant="primary" type="submit">
							Save Changes
						</Button>
					</Modal.Footer>
				</form>
			</Modal.Body>
		</Modal>
	);
};

export default EditCompanyDetailModal;
