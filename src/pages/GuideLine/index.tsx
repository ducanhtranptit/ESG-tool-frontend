import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useTranslation } from "react-i18next";
import "./style.css";

const GuideLinePage: React.FC = () => {
	const { t, i18n } = useTranslation();

	// Configuring MathJax to ensure formulas are displayed correctly
	const mathJaxConfig = {
		loader: { load: ["input/tex", "output/chtml"] },
		tex: {
			inlineMath: [["\\(", "\\)"]],
			displayMath: [["\\[", "\\]"]],
		},
	};

	// Formulas loaded based on the language
	const formulas = {
		indexScore: t("formulas.indexScore"),
		newWeight: t("formulas.newWeight"),
		pillarScore: t("formulas.pillarScore"),
		esgScore1: t("formulas.esgScore1"),
		esgScore2: t("formulas.esgScore2"),
	};

	return (
		<MathJaxContext config={mathJaxConfig}>
			<div className="content">
				<div>
					<h1 style={{ textAlign: "center" }}>
						<b>{t("guideline.title")}</b>
					</h1>
					<ol type="I">
						<li>
							<b>{t("guideline.percentileRank")}</b>
						</li>
					</ol>
					<p>
						<MathJax>{`\\(${formulas.indexScore}\\)`}</MathJax>
					</p>
					<ul>
						<li>{t("guideline.worseCompanies")}</li>
						<li>{t("guideline.sameValueCompanies")}</li>
						<li>{t("guideline.totalCompanies")}</li>
					</ul>
					<ol type="I" start={2}>
						<li>
							<b>{t("guideline.dataStandardization")}</b>
						</li>
					</ol>
					<ol>
						<li>
							<b>{t("guideline.standardizeData")}</b>
						</li>
					</ol>
					<p>{t("guideline.standardizeExplanation")}</p>
					<ol start={2}>
						<li>
							<b>{t("guideline.numericData")}</b>
						</li>
					</ol>
					<p>{t("guideline.numericDataExplanation")}</p>
					<ol type="I" start={3}>
						<li>
							<b>{t("guideline.stepsForPillar")}</b>
						</li>
					</ol>
					<p>
						<b>{t("guideline.step1")}</b> {t("guideline.step1Desc")}
					</p>
					<p>
						<MathJax>{`\\(${formulas.indexScore}\\)`}</MathJax>
					</p>
					<p>
						<b>{t("guideline.step2")}</b> {t("guideline.step2Desc")}
					</p>
					<p>
						<b>{t("guideline.step3")}</b>
					</p>
					<p>
						<MathJax>{`\\(${formulas.newWeight}\\)`}</MathJax>
					</p>
					<p>
						<b>{t("guideline.step4")}</b>
					</p>
					<p>
						<MathJax>{`\\(${formulas.pillarScore}\\)`}</MathJax>
					</p>
					<ol type="I" start={4}>
						<li>
							<b>{t("guideline.calculateESG")}</b>
						</li>
					</ol>
					<p>
						<b>{t("guideline.method1")}</b>
					</p>
					<p>
						<MathJax>{`\\(${formulas.esgScore1}\\)`}</MathJax>
					</p>
					<p>
						<b>{t("guideline.method2")}</b>
					</p>
					<p>
						<MathJax>{`\\(${formulas.esgScore2}\\)`}</MathJax>
					</p>
				</div>
			</div>
		</MathJaxContext>
	);
};

export default GuideLinePage;
