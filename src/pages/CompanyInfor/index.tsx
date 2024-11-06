import React, { useState, useEffect } from "react";
import CompanyInforAPI from "../../api/companyinfor";
import {
	Spinner,
	Table,
	Button,
	Card,
	Row,
	Col,
	Container,
} from "react-bootstrap";
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
	overallInfor?: OverallInfor;
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
				console.error("Không thể lấy thông tin công ty");
			}
		} catch (error) {
			console.error("Lỗi khi lấy thông tin công ty:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCompany();
	}, []);

	if (loading) {
		return (
			<div
				className="d-flex justify-content-center align-items-center"
				style={{ height: "80vh" }}
			>
				<Spinner animation="border" role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</div>
		);
	}

	const handleOpenEditModal = () => {
		setShowEditModal(true);
	};

	const handleCloseEditModal = () => {
		fetchCompany();
		setShowEditModal(false);
	};

	// Nếu không có dữ liệu, tạo đối tượng mặc định với kiểu dữ liệu chính xác
	const overallInfor: OverallInfor = companyDetails?.overallInfor || {
		id: 0,
		companyName: "",
		dateFounder: 0, // Đặt thành số 0 thay vì chuỗi
		mainAddress: "",
		mainPhoneNumber: "",
		companyWebsite: "",
		companySector: "",
		companyDescription: "",
		contactInformation: "",
	};

	const siteInfors = companyDetails?.siteInfors || [];
	const productInfors = companyDetails?.productInfors || [];

	return (
		<Container fluid="md" className="py-4">
			<Row className="align-items-center mb-4">
				<Col>
					<h2 className="text-primary">Thông Tin Công Ty</h2>
				</Col>
				<Col className="text-end">
					<Button variant="primary" onClick={handleOpenEditModal}>
						Chỉnh Sửa Thông Tin Công Ty
					</Button>
				</Col>
			</Row>

			<Card className="mb-4 shadow-sm">
				<Card.Header>
					<h3>{overallInfor.companyName}</h3>
				</Card.Header>
				<Card.Body>
					<Row>
						<Col md={6}>
							<p>
								<strong>Ngày Thành Lập:</strong>{" "}
								{overallInfor.dateFounder !== 0
									? overallInfor.dateFounder
									: ""}
							</p>
							<p>
								<strong>Địa Chỉ Chính:</strong>{" "}
								{overallInfor.mainAddress}
							</p>
							<p>
								<strong>Số Điện Thoại Chính:</strong>{" "}
								{overallInfor.mainPhoneNumber}
							</p>
							<p>
								<strong>Trang Web Công Ty:</strong>{" "}
								<a
									href={overallInfor.companyWebsite}
									target="_blank"
									rel="noopener noreferrer"
								>
									{overallInfor.companyWebsite}
								</a>
							</p>
						</Col>
						<Col md={6}>
							<p>
								<strong>Ngành:</strong>{" "}
								{overallInfor.companySector}
							</p>
							<p>
								<strong>Mô Tả:</strong>{" "}
								{overallInfor.companyDescription}
							</p>
							<p>
								<strong>Thông Tin Liên Hệ:</strong>
							</p>
							<div
								dangerouslySetInnerHTML={{
									__html: overallInfor.contactInformation,
								}}
							/>
						</Col>
					</Row>
				</Card.Body>
			</Card>

			<Card className="mb-4 shadow-sm">
				<Card.Header>
					<h4>Thông Tin Địa Điểm</h4>
				</Card.Header>
				<Card.Body>
					{siteInfors.length > 0 ? (
						<Table responsive striped bordered hover>
							<thead>
								<tr>
									<th>Tên Địa Điểm</th>
									<th>Số Nhân Viên</th>
									<th>Ghi Chú</th>
								</tr>
							</thead>
							<tbody>
								{siteInfors.map((site) => (
									<tr key={site.id}>
										<td>{site.siteName}</td>
										<td>{site.numberEmployees}</td>
										<td>{site.comment}</td>
									</tr>
								))}
							</tbody>
						</Table>
					) : (
						<p>Không có thông tin địa điểm.</p>
					)}
				</Card.Body>
			</Card>

			<Card className="mb-4 shadow-sm">
				<Card.Header>
					<h4>Thông Tin Sản Phẩm</h4>
				</Card.Header>
				<Card.Body>
					{productInfors.length > 0 ? (
						<Table responsive striped bordered hover>
							<thead>
								<tr>
									<th>Tên Sản Phẩm</th>
									<th>Doanh Thu</th>
									<th>Ghi Chú</th>
								</tr>
							</thead>
							<tbody>
								{productInfors.map((product) => (
									<tr key={product.id}>
										<td>{product.productName}</td>
										<td>{product.revenue}</td>
										<td>{product.comment}</td>
									</tr>
								))}
							</tbody>
						</Table>
					) : (
						<p>Không có thông tin sản phẩm.</p>
					)}
				</Card.Body>
			</Card>

			<EditCompanyDetailModal
				show={showEditModal}
				handleClose={handleCloseEditModal}
				companyDetails={overallInfor}
				siteInfors={siteInfors}
				productInfors={productInfors}
			/>
		</Container>
	);
};

export default CompanyPage;
