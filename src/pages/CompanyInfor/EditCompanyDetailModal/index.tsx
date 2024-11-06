import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import CompanyInforAPI from "../../../api/companyinfor";
import ReactQuill from "react-quill";
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
			console.error("Error updating company info:", error);
		}
	};

	return (
		<Modal show={show} onHide={handleClose} centered size="xl">
			<Modal.Header closeButton>
				<Modal.Title>Chỉnh Sửa Thông Tin Công Ty</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit}>
					<h4>Thông Tin Chung</h4>
					<Row className="mb-3">
						<Col md={6}>
							<Form.Group controlId="formCompanyName">
								<Form.Label>Tên Công Ty</Form.Label>
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
								<Form.Label>Ngày Thành Lập</Form.Label>
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
								<Form.Label>Số Điện Thoại Chính</Form.Label>
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
								<Form.Label>Địa Chỉ Chính</Form.Label>
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
								<Form.Label>Trang Web Công Ty</Form.Label>
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
						<Form.Label>Ngành</Form.Label>
						<Form.Control
							type="text"
							value={companySector}
							onChange={(e) => setCompanySector(e.target.value)}
							required
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formDescription">
						<Form.Label>Mô Tả Công Ty</Form.Label>
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
						<Form.Label>Thông Tin Liên Hệ</Form.Label>
						<ReactQuill
							value={contactInformation}
							onChange={setContactInformation}
							className="custom-quill-editor"
						/>
					</Form.Group>

					<h4>Thông Tin Địa Điểm</h4>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Tên Địa Điểm</th>
								<th>Số Nhân Viên</th>
								<th>Ghi Chú</th>
								<th>Hành Động</th>
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
											Xóa
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Button variant="primary" onClick={handleAddSite}>
						Thêm Địa Điểm
					</Button>

					<h4 className="mt-4">Thông Tin Sản Phẩm</h4>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Tên Sản Phẩm</th>
								<th>Doanh Thu</th>
								<th>Ghi Chú</th>
								<th>Hành Động</th>
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
											Xóa
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Button variant="primary" onClick={handleAddProduct}>
						Thêm Sản Phẩm
					</Button>

					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Đóng
						</Button>
						<Button variant="primary" type="submit">
							Lưu Thay Đổi
						</Button>
					</Modal.Footer>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default EditCompanyDetailModal;
