import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import CompanyInforAPI from "../../../api/companyinfor";
import ReactQuill from "react-quill";
import { useTranslation } from "react-i18next";
import "react-quill/dist/quill.snow.css";

interface OverallInfor {
	id?: number;
	companyName?: string;
	dateFounder?: number;
	mainAddress?: string;
	mainPhoneNumber?: string;
	companyWebsite?: string;
	companySector?: string;
	companyDescription?: string;
	contactInformation?: string;
}

interface SiteInfor {
	id?: number;
	siteName?: string;
	numberEmployees?: number;
	comment?: string;
}

interface ProductInfor {
	id?: number;
	productName?: string;
	revenue?: number;
	comment?: string;
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
	const { t } = useTranslation();
	const [companyName, setCompanyName] = useState(companyDetails.companyName);
	const [dateFounder, setDateFounder] = useState(
		companyDetails.dateFounder?.toString()
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
	const [contactInformation, setContactInformation] = useState(
		companyDetails.contactInformation
	);

	const [siteInformation, setSiteInformation] = useState([...siteInfors]);
	const [productInformation, setProductInformation] = useState([
		...productInfors,
	]);

	useEffect(() => {
		setCompanyName(companyDetails.companyName);
		setDateFounder(companyDetails.dateFounder?.toString());
		setMainAddress(companyDetails.mainAddress);
		setMainPhoneNumber(companyDetails.mainPhoneNumber);
		setCompanyWebsite(companyDetails.companyWebsite);
		setCompanySector(companyDetails.companySector);
		setCompanyDescription(companyDetails.companyDescription);
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
			contactInformation,
			siteInformation,
			productInformation,
		};

		try {
			const response = await CompanyInforAPI.updateCompanyInfor(
				updatedCompanyDetails
			);
			console.log("Response from server:", response);
			handleClose();
		} catch (error) {
			console.error(t("editCompanyInfo.updateError"), error);
		}
	};

	return (
		<Modal show={show} onHide={handleClose} centered size="xl">
			<Modal.Header closeButton>
				<Modal.Title>{t("editCompanyInfo.editCompanyInfo")}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit}>
					<h4>{t("editCompanyInfo.generalInformation")}</h4>
					<Row className="mb-3">
						<Col md={6}>
							<Form.Group controlId="formCompanyName">
								<Form.Label>{t("editCompanyInfo.companyName")}</Form.Label>
								<Form.Control
									type="text"
									value={companyName}
									onChange={(e) =>
										setCompanyName(e.target.value)
									}
									required
								/>
							</Form.Group>
						</Col>
						<Col md={3}>
							<Form.Group controlId="formDateFounder">
								<Form.Label>{t("editCompanyInfo.foundingDate")}</Form.Label>
								<Form.Control
									type="text"
									value={dateFounder}
									onChange={(e) =>
										setDateFounder(e.target.value)
									}
									required
								/>
							</Form.Group>
						</Col>
						<Col md={3}>
							<Form.Group controlId="formPhoneNumber">
								<Form.Label>{t("editCompanyInfo.mainPhoneNumber")}</Form.Label>
								<Form.Control
									type="text"
									value={mainPhoneNumber}
									onChange={(e) =>
										setMainPhoneNumber(e.target.value)
									}
									required
								/>
							</Form.Group>
						</Col>
					</Row>

					<Row className="mb-3">
						<Col md={6}>
							<Form.Group controlId="formAddress">
								<Form.Label>{t("editCompanyInfo.mainAddress")}</Form.Label>
								<Form.Control
									type="text"
									value={mainAddress}
									onChange={(e) =>
										setMainAddress(e.target.value)
									}
									required
								/>
							</Form.Group>
						</Col>
						<Col md={6}>
							<Form.Group controlId="formWebsite">
								<Form.Label>{t("editCompanyInfo.companyWebsite")}</Form.Label>
								<Form.Control
									type="text"
									value={companyWebsite}
									onChange={(e) =>
										setCompanyWebsite(e.target.value)
									}
									required
								/>
							</Form.Group>
						</Col>
					</Row>

					<Form.Group className="mb-3" controlId="formSector">
						<Form.Label>{t("editCompanyInfo.sector")}</Form.Label>
						<Form.Control
							type="text"
							value={companySector}
							onChange={(e) => setCompanySector(e.target.value)}
							required
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formDescription">
						<Form.Label>{t("editCompanyInfo.companyDescription")}</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							value={companyDescription}
							onChange={(e) =>
								setCompanyDescription(e.target.value)
							}
							required
						/>
					</Form.Group>

					<Form.Group
						className="mb-3"
						controlId="formContactInformation"
					>
						<Form.Label>{t("editCompanyInfo.contactInformation")}</Form.Label>
						<ReactQuill
							value={contactInformation}
							onChange={setContactInformation}
							className="custom-quill-editor"
						/>
					</Form.Group>

					<h4>{t("editCompanyInfo.siteInformation")}</h4>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>{t("editCompanyInfo.siteName")}</th>
								<th>{t("editCompanyInfo.numberEmployees")}</th>
								<th>{t("editCompanyInfo.comment")}</th>
								<th>{t("editCompanyInfo.action")}</th>
							</tr>
						</thead>
						<tbody>
							{siteInformation.map((site, index) => (
								<tr key={index}>
									<td>
										<Form.Control
											type="text"
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
										<Form.Control
											type="number"
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
										<Form.Control
											type="text"
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
											{t("editCompanyInfo.delete")}
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Button variant="primary" onClick={handleAddSite}>
						{t("editCompanyInfo.addSite")}
					</Button>

					<h4 className="mt-4">{t("editCompanyInfo.productInformation")}</h4>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>{t("editCompanyInfo.productName")}</th>
								<th>{t("editCompanyInfo.revenue")}</th>
								<th>{t("editCompanyInfo.comment")}</th>
								<th>{t("editCompanyInfo.action")}</th>
							</tr>
						</thead>
						<tbody>
							{productInformation.map((product, index) => (
								<tr key={index}>
									<td>
										<Form.Control
											type="text"
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
										<Form.Control
											type="number"
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
										<Form.Control
											type="text"
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
											{t("editCompanyInfo.delete")}
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Button variant="primary" onClick={handleAddProduct}>
						{t("editCompanyInfo.addProduct")}
					</Button>

					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							{t("editCompanyInfo.close")}
						</Button>
						<Button variant="primary" type="submit">
							{t("editCompanyInfo.saveChanges")}
						</Button>
					</Modal.Footer>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default EditCompanyDetailModal;
