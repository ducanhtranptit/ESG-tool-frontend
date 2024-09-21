import React, { useEffect, useState } from "react";
import EnvironmentAPI from "../../api/environment";
import "./styles.css";

const App: React.FC = () => {
	const [data, setData] = useState<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await EnvironmentAPI.testApi();
				setData(response.data); // Đảm bảo rằng dữ liệu hợp lệ được set vào state
			} catch (error) {
				console.error("Error fetching data:", error);
				setData("Failed to fetch data.");
			}
		};

		fetchData();
	}, []);

	return (
		<div>
			<h1>This is environment page</h1>
			<div>
				{typeof data === "string" ? (
					data
				) : (
					<pre>{JSON.stringify(data, null, 2)}</pre>
				)}
			</div>
		</div>
	);
};

export default App;
