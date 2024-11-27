import React from "react";
import DefaultRouter from "../routers";

import { BrowserRouter as Router } from "react-router-dom";
const App: React.FC = () => {
	return (
		<Router>
			<DefaultRouter />
		</Router>
	);
};
export default App;
