// GuideLinePage.tsx

import React, { useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import "./style.css";

const GuideLinePage: React.FC = () => {
	const [language, setLanguage] = useState("vietnamese");

	// Configuring MathJax to ensure formulas are displayed correctly
	const mathJaxConfig = {
		loader: { load: ["input/tex", "output/chtml"] },
		tex: {
			inlineMath: [["\\(", "\\)"]],
			displayMath: [["\\[", "\\]"]],
		},
	};

	const toggleLanguage = () => {
		setLanguage(language === "vietnamese" ? "english" : "vietnamese");
	};

	const vietnameseFormulas = {
		indexScore: `\\text{Điểm chỉ số} = \\dfrac{\\text{Số công ty có giá trị thấp hơn} + \\dfrac{\\text{Số công ty có cùng giá trị}}{2}}{\\text{Tổng số công ty}}`,
		newWeight: `\\text{Trọng số mới của chỉ số rác thải} = \\dfrac{\\text{Trọng số ban đầu của chỉ số rác thải}}{\\text{Trọng số của trụ cột môi trường}}`,
		pillarScore: `\\text{Điểm trụ cột Môi trường} = \\sum{(\\text{Điểm của chỉ số trong trụ cột môi trường} \\times \\text{Trọng số mới tương ứng})}`,
		esgScore1: `\\text{Điểm ESG} = \\sum{(\\text{Điểm của chỉ số} \\times \\text{Trọng số tương ứng})}`,
		esgScore2: `\\text{Điểm ESG} = \\sum{(\\text{Điểm của trụ cột} \\times \\text{Trọng số trụ cột tương ứng})}`,
	};

	const englishFormulas = {
		indexScore: `\\text{Index score} = \\dfrac{\\text{no. of companies with a worse value} + \\dfrac{\\text{no. of companies with the same value}}{2}}{\\text{no. of companies with a value}}`,
		newWeight: `\\text{New weight of Waste emission index} = \\dfrac{\\text{Initial weight of the waste index}}{\\text{weight of the environment pillar}}`,
		pillarScore: `\\text{Environment pillar score} = \\sum{(\\text{Score of the index in the environment pillar} \\times \\text{Corresponding new weight})}`,
		esgScore1: `\\text{ESG Score} = \\sum{(\\text{Index Score} \\times \\text{Corresponding weight})}`,
		esgScore2: `\\text{ESG Score} = \\sum{(\\text{Pillar Score} \\times \\text{Corresponding pillar weight})}`,
	};

	return (
		<MathJaxContext config={mathJaxConfig} key={language}>
			<div className="content">
				<button
					className="btn btn-outline-secondary"
					onClick={toggleLanguage}
				>
					{language === "vietnamese"
						? "Switch to English"
						: "Chuyển sang Tiếng Việt"}
				</button>
				<hr />
				<div>
					{language === "vietnamese" ? (
						<div>
							<h1 style={{ textAlign: "center" }}>
								<b>GUIDELINE: PHƯƠNG PHÁP TÍNH ĐIỂM ESG</b>
							</h1>
							<ol type="I">
								<li>
									<b>Phương pháp xếp hạng phần trăm:</b>
								</li>
							</ol>
							<p>
								<MathJax>{`\\(${vietnameseFormulas.indexScore}\\)`}</MathJax>
							</p>
							<ul>
								<li>
									Có bao nhiêu công ty có giá trị thấp hơn tại
									cùng 1 thời điểm?
								</li>
								<li>Có bao nhiêu công ty có cùng giá trị?</li>
								<li>Có bao nhiêu công ty cung cấp giá trị?</li>
							</ul>
							<ol type="I" start={2}>
								<li>
									<b>
										Xử lí các điểm dữ liệu cơ bản – Chuẩn
										hoá dữ liệu và số
									</b>
								</li>
							</ol>
							<ol>
								<li>
									<b>Chuẩn hoá dữ liệu</b>
								</li>
							</ol>
							<p className="western">
								Đối với các câu hỏi dạng Có/ Không và câu hỏi
								lựa chọn đáp án, mỗi câu trả lời sẽ được chuẩn
								hoá theo thang điểm từ 0 đến 10.{" "}
								<b>
									Phương pháp chuẩn hoá sẽ được giống nhau đối
									với cả câu hỏi có tính tích cực và tính tiêu
									cực
								</b>
								, khi đến bước tính điểm sẽ dựa vào tính chất
								câu hỏi để xếp hạng.
							</p>
							<ol start={2}>
								<li>
									<b>Dữ liệu số</b>
								</li>
							</ol>
							<p>
								Xếp hạng phần trăm tương đối chỉ được áp dụng
								nếu một công ty báo cáo một điểm dữ liệu bằng
								số, trong khi tất cả các công ty trong một nhóm
								ngành đều báo cáo điểm dữ liệu tương ứng đó.{" "}
								<b>
									Mỗi thước đo có một cực tính cho biết giá
									trị cao hơn là tích cực hay tiêu cực.
								</b>
							</p>
							<ol type="I" start={3}>
								<li>
									<b>Các bước tính điểm theo từng trụ cột</b>
								</li>
							</ol>
							<p>
								<b>Bước 1:</b> Dựa vào phương pháp xếp hạng phần
								trăm để tính điểm cho từng chỉ số
							</p>
							<p>
								<MathJax>{`\\(${vietnameseFormulas.indexScore}\\)`}</MathJax>
							</p>
							<p>
								<b>Bước 2:</b> Tính trọng số của từng trụ cột
							</p>
							<p>
								Trọng số của từng trụ cột bằng tổng trọng số các
								chỉ số trong trụ cột đó
							</p>
							<p>
								<b>Bước 3:</b> Tính trọng số mới của từng chỉ số
							</p>
							<p>
								<MathJax>{`\\(${vietnameseFormulas.newWeight}\\)`}</MathJax>
							</p>
							<p>
								<b>Bước 4:</b> Tính điểm cho từng trụ cột
							</p>
							<p>
								<MathJax>{`\\(${vietnameseFormulas.pillarScore}\\)`}</MathJax>
							</p>
							<ol type="I" start={4}>
								<li>
									<b>Tính điểm ESG</b>
								</li>
							</ol>
							<p>
								<b>Cách 1:</b> Tổng tất cả chỉ số nhân trọng số
								tương ứng
							</p>
							<p>
								<MathJax>{`\\(${vietnameseFormulas.esgScore1}\\)`}</MathJax>
							</p>
							<p>
								<b>Cách 2:</b> Tổng điểm của 3 trụ cột nhân
								trọng số tương ứng
							</p>
							<p>
								<MathJax>{`\\(${vietnameseFormulas.esgScore2}\\)`}</MathJax>
							</p>
						</div>
					) : (
						<div>
							<h1 style={{ textAlign: "center" }}>
								<b>
									GUIDELINE: ESG SCORE CALCULATION METHODOLOGY
								</b>
							</h1>
							<ol type="I">
								<li>
									<b>Percentile rank scoring methodology:</b>
								</li>
							</ol>
							<p>
								<MathJax>{`\\(${englishFormulas.indexScore}\\)`}</MathJax>
							</p>
							<ul>
								<li>
									How many companies are worse than the
									current one?
								</li>
								<li>How many companies have the same value?</li>
								<li>How many companies have a value at all?</li>
							</ul>
							<ol type="I" start={2}>
								<li>
									<b>
										Treatment of underlying data points –
										Data Standardization and numeric
									</b>
								</li>
							</ol>
							<ol>
								<li>
									<b>Data Standardization</b>
								</li>
							</ol>
							<p>
								For Yes/No questions and select questions, each
								answer will be standardized on a scale from 0 to
								10.{" "}
								<b>
									The standardization method will be the same
									for both positive and negative questions
								</b>
								, with the scoring based on the nature of the
								question to determine the ranking.
							</p>
							<ol start={2}>
								<li>
									<b>Numeric Data</b>
								</li>
							</ol>
							<p>
								A relative percentile ranking is only applied if
								a numeric data point is reported by a company,
								while all companies in an industry group report
								that respective data point.{" "}
								<b>
									Each measure has a polarity indicating
									whether a higher value is positive or
									negative.
								</b>
							</p>
							<ol type="I" start={3}>
								<li>
									<b>
										Steps to calculate points for each
										pillar:
									</b>
								</li>
							</ol>
							<p>
								<b>Step 1:</b> Based on the percentile ranking
								method to calculate points for each indicator
							</p>
							<p>
								<MathJax>{`\\(${englishFormulas.indexScore}\\)`}</MathJax>
							</p>
							<p>
								<b>Step 2:</b> Calculate the weight of each
								pillar
							</p>
							<p>
								<b>Step 3:</b> Calculate the new weight of each
								index
							</p>
							<p>
								<MathJax>{`\\(${englishFormulas.newWeight}\\)`}</MathJax>
							</p>
							<p>
								<b>Step 4:</b> Calculate scores for each pillar
							</p>
							<p>
								<MathJax>{`\\(${englishFormulas.pillarScore}\\)`}</MathJax>
							</p>
							<ol type="I" start={4}>
								<li>
									<b>Calculate ESG Score</b>
								</li>
							</ol>
							<p>
								<b>Method 1:</b> Sum all the indices and
								multiply the corresponding weights
							</p>
							<p>
								<MathJax>{`\\(${englishFormulas.esgScore1}\\)`}</MathJax>
							</p>
							<p>
								<b>Method 2:</b> Sum the scores of the 3 pillars
								and multiply the corresponding weights
							</p>
							<p>
								<MathJax>{`\\(${englishFormulas.esgScore2}\\)`}</MathJax>
							</p>
						</div>
					)}
				</div>
			</div>
		</MathJaxContext>
	);
};

export default GuideLinePage;
