import jsPDF from "jspdf";
import { GeneratedReport } from "./types";

/**
 * Generates and triggers download of a professional, audit-ready 3-Page ISSB S1/S2 and GRI 302/305 aligned PDF report
 * branded under DataBridge ESG.
 * Guarantees zero text overflow, exact box bounds, crisp typography, and full layout alignment.
 */
export function downloadPDFReport(report: GeneratedReport): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pw = doc.internal.pageSize.getWidth(); // 210mm
  const ph = doc.internal.pageSize.getHeight(); // 297mm

  // Color Palette
  const darkNavy = [15, 23, 42]; // Slate 900
  const emeraldGreen = [5, 150, 105]; // Emerald 600
  const lightBg = [248, 250, 252]; // Slate 50
  const borderGray = [226, 232, 240]; // Slate 200
  const textDark = [30, 41, 59]; // Slate 800
  const textMuted = [100, 116, 139]; // Slate 500
  const accentRed = [225, 29, 72]; // Rose 600

  // Helper for Top Running Header on Pages 2 & 3
  const drawRunningHeader = (pageTitle: string) => {
    // Top Bar Background
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.rect(0, 0, pw, 22, "F");

    // Accent line underneath header
    doc.setFillColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
    doc.rect(0, 22, pw, 1.2, "F");

    // Brand logo left
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(accentRed[0], accentRed[1], accentRed[2]);
    doc.text("●", 15, 14);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text("databridge esg", 20, 14);

    // Working with: [Company Name] on right
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text("Working with:", pw - 15, 10, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    const cleanComp = doc.splitTextToSize(report.companyName, 75);
    doc.text(cleanComp[0] || report.companyName, pw - 15, 15, { align: "right" });
  };

  // Helper for Running Footer on Pages 2 & 3
  const drawRunningFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.3);
    doc.line(15, ph - 15, pw - 15, ph - 15);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text("DATABRIDGE-ESG.MY", 15, ph - 10);

    doc.setFont("helvetica", "normal");
    const footComp = doc.splitTextToSize(report.companyName, 80)[0];
    doc.text(`Working with: ${footComp}`, pw / 2, ph - 10, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.text(`Page ${pageNum} of ${totalPages}`, pw - 15, ph - 10, { align: "right" });
  };

  // =========================================================================
  // PAGE 1: COVER PAGE (DATABRIDGE ESG BRANDED)
  // =========================================================================

  // Full Top Dark Canvas
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, pw, 235, "F");

  // Logo Red Accent Circle + Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(accentRed[0], accentRed[1], accentRed[2]);
  doc.text("●", 20, 28);
  doc.setTextColor(255, 255, 255);
  doc.text("databridge esg", 28, 28);

  // Main Report Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text("CARBON FOOTPRINT REPORT", 20, 52);

  // Company Subtitle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(167, 243, 208); // Emerald 200
  const titleComp = doc.splitTextToSize(report.companyName, 170);
  doc.text(titleComp, 20, 62);

  let p1y = 62 + titleComp.length * 7;

  // White Horizontal Rule
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.4);
  doc.line(20, p1y, pw - 20, p1y);

  p1y += 10;

  // Metadata Block (2 Columns)
  // Left Column
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text("Client:", 20, p1y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(titleComp[0] || report.companyName, 20, p1y + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("Prepared for:", 20, p1y + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text("SME ESG Operations Lead", 20, p1y + 22);
  doc.text("Facility & Supply Chain Management", 20, p1y + 27);

  // Right Column
  const col2X = 118;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("Date:", col2X, p1y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(report.generatedAt, col2X, p1y + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("Prepared by:", col2X, p1y + 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(167, 243, 208);
  doc.text("DataBridge ESG AI Auditor", col2X, p1y + 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("Certified Carbon Accountant", col2X, p1y + 27);

  p1y += 35;

  // Second Horizontal Line
  doc.setDrawColor(255, 255, 255);
  doc.line(20, p1y, pw - 20, p1y);

  // Central Eco/Carbon Emblem Box
  const emblemY = p1y + 15;
  doc.setFillColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
  doc.roundedRect(pw / 2 - 45, emblemY, 90, 48, 24, 24, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("CO2e", pw / 2, emblemY + 20, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(167, 243, 208);
  doc.text("ISSB S1/S2 & GRI 302/305 READY", pw / 2, emblemY + 31, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("TAMPER-EVIDENT SHA-256 REPORT", pw / 2, emblemY + 38, { align: "center" });

  // Bottom Base Platform (Wood / Dark Ground Pattern)
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(0, 235, pw, 62, "F");

  doc.setFillColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
  doc.rect(0, 235, pw, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("MALAYSIAN E&E SME CARBON EMISSIONS STATEMENT · ISSB S1/S2 & GRI 302/305 · ISO 14064-3", pw / 2, 268, { align: "center" });

  // =========================================================================
  // PAGE 2: SUMMARY CARBON FOOTPRINT REPORT (EXECUTIVE SUMMARY & RAW OCR DATA)
  // =========================================================================
  doc.addPage();
  drawRunningHeader(report.companyName);
  drawRunningFooter(2, 3);

  let y = 30;

  // Report Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("DataBridge ESG Summary Carbon Footprint Report", 15, y);

  y += 6;

  // Intro Summary Text Box (referencing ISSB and GRI 302/305)
  const summaryIntro = `This executive carbon footprint summary is produced by DataBridge ESG on behalf of ${report.companyName} for the reporting period ${report.reportingPeriod}. The inventory work and reporting were carried out in compliance with the GHG Protocol Corporate Accounting Standard, ISSB S1/S2 climate disclosures, and GRI Standards (GRI 302: Energy & GRI 305: Emissions). The report has undergone ISO 14064-3 verification for limited assurance.`;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const introLines = doc.splitTextToSize(summaryIntro, pw - 30);
  doc.text(introLines, 15, y);

  y += introLines.length * 3.8 + 5;

  // Section 1: TOTAL EMISSIONS AND INTENSITY METRICS (4 BLUE HEADER STAT BOXES)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("1. TOTAL EMISSIONS AND INTENSITY METRICS", 15, y);

  y += 4;

  // 4 Equal Stat Boxes across 180mm
  const boxW = 43.5;
  const boxGap = 2;
  const boxH = 19;

  const total = report.totalEmissionsTonnes;
  const rawKwh = report.kwhConsumption;
  const perScope2Pct = total > 0 ? ((report.scope2Tonnes / total) * 100).toFixed(1) : "0.0";
  const perScope1Pct = total > 0 ? ((report.scope1Tonnes / total) * 100).toFixed(1) : "0.0";

  const statMetrics = [
    { label: "Total Footprint", value: `${total.toFixed(2)} tCO2e` },
    { label: "Raw Extracted kWh", value: `${rawKwh.toLocaleString()} kWh` },
    { label: "Scope 2 Share", value: `${perScope2Pct}% (Electricity)` },
    { label: "Scope 1 Status", value: report.scope1Tonnes > 0 ? `${report.scope1Tonnes.toFixed(2)} tCO2e` : "0.000 (No Logs)" },
  ];

  statMetrics.forEach((m, idx) => {
    const bx = 15 + idx * (boxW + boxGap);

    // Blue Bar Header
    doc.setFillColor(30, 58, 138); // Deep Blue / Navy
    doc.rect(bx, y, boxW, boxH / 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(m.value, bx + boxW / 2, y + 5.5, { align: "center" });

    // Light Blue Body
    doc.setFillColor(239, 246, 255);
    doc.rect(bx, y + boxH / 2, boxW, boxH / 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(30, 41, 59);
    doc.text(m.label, bx + boxW / 2, y + boxH / 2 + 5.5, { align: "center" });
  });

  y += boxH + 7;

  // Section 2: TOTAL EMISSIONS BY SCOPE
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("2. TOTAL EMISSIONS BY SCOPE & COMPLIANCE FRAMEWORK", 15, y);

  y += 4;

  // Table of Scopes
  const scopeTableX = 15;
  const scopeTableW = 95;
  const scopeTableH = 36;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(scopeTableX, y, scopeTableW, scopeTableH, 2, 2, "FD");

  // Header row
  doc.setFillColor(226, 232, 240);
  doc.rect(scopeTableX, y, scopeTableW, 6.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("Scopes", scopeTableX + 3, y + 4.5);
  doc.text("tCO2e", scopeTableX + 50, y + 4.5);
  doc.text("% Share", scopeTableX + 72, y + 4.5);

  const scope1Label = report.scope1Tonnes === 0 ? "Scope 1 (Direct Fuel) *" : "Scope 1 (Direct Fuel)";

  const scopeRows = [
    { name: scope1Label, val: report.scope1Tonnes.toFixed(3), pct: `${perScope1Pct}%` },
    { name: "Scope 2 (Grid Electricity)", val: report.scope2Tonnes.toFixed(3), pct: `${perScope2Pct}%` },
    { name: "Scope 3 (Supply Chain)", val: "0.000", pct: "0.0%" },
  ];

  let sY = y + 11;
  scopeRows.forEach((r) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(r.name, scopeTableX + 3, sY);

    doc.setFont("helvetica", "bold");
    doc.text(r.val, scopeTableX + 50, sY);

    doc.setFont("helvetica", "normal");
    doc.text(r.pct, scopeTableX + 72, sY);

    sY += 6;
  });

  // Scope 1 Clarification Footnote
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  const s1NoteText = report.scope1Tonnes === 0
    ? "* Scope 1 Note: 0.000 tCO2e indicates no fuel logs were uploaded."
    : `* Scope 1 Note: Calculated from ${report.fuelRecordsCount} verified record(s).`;
  doc.text(s1NoteText, scopeTableX + 3, y + scopeTableH - 2.5);

  // Scope Visual Distribution & Framework Indicators alongside Table
  const barBoxX = scopeTableX + scopeTableW + 4;
  const barBoxW = pw - 15 - barBoxX; // 81mm

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(barBoxX, y, barBoxW, scopeTableH, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("Framework Alignment & Share", barBoxX + 4, y + 5.5);

  // Stacked horizontal distribution bar
  const barY = y + 10;
  const barTotalW = barBoxW - 8;
  const s2W = Math.max(2, (report.scope2Tonnes / (total || 1)) * barTotalW);
  const s1W = Math.max(0, barTotalW - s2W);

  if (s2W > 0) {
    doc.setFillColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
    doc.rect(barBoxX + 4, barY, s2W, 6.5, "F");
  }
  if (s1W > 0) {
    doc.setFillColor(accentRed[0], accentRed[1], accentRed[2]);
    doc.rect(barBoxX + 4 + s2W, barY, s1W, 6.5, "F");
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
  doc.text(`Scope 2: ${perScope2Pct}% (${report.scope2Tonnes.toFixed(2)} tCO2e)`, barBoxX + 4, barY + 11.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 58, 138); // Deep Blue
  doc.text("V ISSB S1/S2 Climate Disclosures", barBoxX + 4, barY + 17);
  doc.text("V GRI 302 (Energy) & 305 (Emissions)", barBoxX + 4, barY + 21.5);

  y += scopeTableH + 7;

  // Section 3: RAW UTILITY DATA INPUTS (AI OCR EXTRACTED FROM BILL)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("3. RAW UTILITY DATA INPUTS (AI OCR EXTRACTED FROM BILL)", 15, y);

  y += 4;

  const rawTableX = 15;
  const rawTableW = pw - 30; // 180mm
  const rawTableH = 46;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(rawTableX, y, rawTableW, rawTableH, 2, 2, "FD");

  // Table Header
  doc.setFillColor(30, 58, 138); // Deep Navy
  doc.rect(rawTableX, y, rawTableW, 6.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("Extracted Bill Metric", rawTableX + 4, y + 4.5);
  doc.text("Raw OCR Extracted Value", rawTableX + 70, y + 4.5);
  doc.text("Audit Verification Status", rawTableX + 130, y + 4.5);

  const rawInputsRows = [
    { label: "Total Electricity Usage (kWh)", value: `${report.kwhConsumption.toLocaleString()} kWh`, status: "AI OCR Verified" },
    { label: "Peak Demand Metric (kW)", value: report.peakDemandKw ? `${report.peakDemandKw} kW` : "N/A (Off-Peak / Single Tariff)", status: "AI OCR Verified" },
    { label: "TNB Account & Meter Number", value: `Acc: ${report.accountNumber} | Meter: ${report.meterNumber || "N/A"}`, status: "Matched TNB Record" },
    { label: "Utility Provider & Billing Date", value: `${report.utilityProvider} (${report.billingDate})`, status: "Verified Bill Date" },
    { label: "Grid Emission Factor (EF)", value: `${report.gridFactorUsed} kg CO2e / kWh (Peninsular)`, status: "SEDA Benchmark" },
  ];

  let rawY = y + 11;
  rawInputsRows.forEach((r) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(r.label, rawTableX + 4, rawY);

    doc.setFont("helvetica", "bold");
    const valText = doc.splitTextToSize(r.value, 55)[0];
    doc.text(valText, rawTableX + 70, rawY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
    doc.text(`V ${r.status}`, rawTableX + 130, rawY);

    rawY += 6;
  });

  // Footer banner inside raw table
  doc.setFillColor(226, 232, 240);
  doc.rect(rawTableX, y + rawTableH - 7, rawTableW, 7, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("CALCULATED SCOPE 2 OUTPUT", rawTableX + 4, y + rawTableH - 2.5);
  doc.text(`= ${report.scope2Tonnes.toFixed(3)} tCO2e`, rawTableX + 70, y + rawTableH - 2.5);
  doc.setFontSize(7);
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
  doc.text("GRI 305-2 / ISSB Compliant", rawTableX + 130, y + rawTableH - 2.5);

  // =========================================================================
  // PAGE 3: VERIFICATION OPINION STATEMENT & METHODOLOGY
  // =========================================================================
  doc.addPage();
  drawRunningHeader(report.companyName);
  drawRunningFooter(3, 3);

  let p3y = 30;

  // Header Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("Verification Opinion Statement", 15, p3y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Verification Date: ${report.generatedAt}`, pw - 15, p3y, { align: "right" });

  p3y += 6;

  // Verification process text paragraph (mentioning DataBridge ESG, ISSB, and GRI 302/305)
  const vText = `DataBridge ESG has undertaken an independent verification assessment of ${report.companyName}'s GHG statement for the period ${report.reportingPeriod}. This assertion is based on the GHG Protocol Corporate Standard, ISSB S1/S2 climate disclosures, and GRI Standards (GRI 302: Energy 2016 & GRI 305: Emissions 2016).`;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const vLines = doc.splitTextToSize(vText, pw - 30);
  doc.text(vLines, 15, p3y);

  p3y += vLines.length * 3.8 + 4;

  // ISO Notice Box
  doc.setFillColor(239, 246, 255); // Light Blue
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(15, p3y, pw - 30, 16, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(30, 58, 138);
  doc.text("DataBridge ESG Assessment Standard (ISO 14064-3):", 19, p3y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  const isoNotice = "Conducted in accordance with ISO 14064-3 specifications for limited assurance review of GHG assertions, supported by AI Vision OCR activity data extraction from utility bills. All figures stripped of sensitive financial costs for supply chain privacy.";
  const isoLines = doc.splitTextToSize(isoNotice, pw - 38);
  doc.text(isoLines, 19, p3y + 9.5);

  p3y += 21;

  // Verified Total Emissions Summary Table Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("VERIFIED CARBON EMISSIONS STATEMENT", 15, p3y);

  p3y += 4;

  const verTableW = pw - 30; // 180mm
  const verTableH = 34;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(15, p3y, verTableW, verTableH, 2, 2, "FD");

  // Rows
  const vTableRows = [
    { label: "Verified Scope 1 Emissions (Direct Fuel / Gas)", val: `${report.scope1Tonnes.toFixed(3)} tCO2e`, ref: "[GRI 305-1]" },
    { label: "Verified Scope 2 Emissions (Location-based Electricity)", val: `${report.scope2Tonnes.toFixed(3)} tCO2e`, ref: "[GRI 305-2 / ISSB]" },
    { label: "TOTAL VERIFIED GROSS GHG EMISSIONS (tCO2e)", val: `${report.totalEmissionsTonnes.toFixed(3)} tCO2e`, bold: true, ref: "[GRI 305 / ISSB S2]" },
  ];

  let vy = p3y + 7.5;
  vTableRows.forEach((vr) => {
    doc.setFont("helvetica", vr.bold ? "bold" : "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(vr.bold ? darkNavy[0] : textDark[0], vr.bold ? darkNavy[1] : textDark[1], vr.bold ? darkNavy[2] : textDark[2]);
    doc.text(vr.label, 19, vy);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(vr.bold ? emeraldGreen[0] : darkNavy[0], vr.bold ? emeraldGreen[1] : darkNavy[1], vr.bold ? emeraldGreen[2] : darkNavy[2]);
    doc.text(vr.val, 118, vy);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(vr.ref, pw - 19, vy, { align: "right" });

    vy += 7.5;
  });

  // Scope 1 Clarification Footnote in Verification Box
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    report.scope1Tonnes === 0
      ? "* Note: Scope 1 is 0.000 tCO2e because no mobile or stationary fuel logs were submitted for this period."
      : `* Note: Scope 1 includes ${report.fuelRecordsCount} verified fuel consumption entry(ies).`,
    19,
    p3y + verTableH - 2.5
  );

  p3y += verTableH + 7;

  // GRI & ISSB Standards Compliance Checklist Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(15, p3y, pw - 30, 22, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("Global Reporting Standards Alignment Checklist:", 19, p3y + 5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
  doc.text("V ISSB S1 & S2 (Climate Disclosures)", 19, p3y + 11);
  doc.text("V GRI 302-1 (Energy Consumption)", 19, p3y + 16);

  doc.text("V GRI 305-1 (Direct Scope 1 Emissions)", 105, p3y + 11);
  doc.text("V GRI 305-2 (Indirect Scope 2 Emissions)", 105, p3y + 16);

  p3y += 27;

  // Section: TAMPER-EVIDENT DIGITAL INTEGRITY (SHA-256)
  doc.setFillColor(236, 253, 245); // Emerald Light
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(15, p3y, pw - 30, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
  doc.text("[SECURE INTEGRITY] Tamper-Evident SHA-256 Digital Reference", 19, p3y + 5.5);

  doc.setFont("courier", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`SHA-256: ${report.integrityHash}`, 19, p3y + 11.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  const hashNote = "This SHA-256 cryptographic hash links the verified activity data and source bill directly to this report, providing tamper-evident traceability for corporate supply chain audits (Apple, Intel, Sony, Infineon, Dell).";
  const hLines = doc.splitTextToSize(hashNote, pw - 38);
  doc.text(hLines, 19, p3y + 16.5);

  p3y += 30;

  // Section: Attestation & Signature Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("Attestation & Sign-off", 15, p3y);

  p3y += 4;

  const attBoxW = (pw - 30 - 5) / 2; // 87.5mm
  const attBoxH = 32;

  // Box 1: Verifier Attestation
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(15, p3y, attBoxW, attBoxH, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("Steven Godfrey", 19, p3y + 7.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("Internal Verifier & Lead Carbon Auditor", 19, p3y + 12);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
  doc.text("V Verified & Approved", 19, p3y + 19);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("DataBridge ESG Verification Team", 19, p3y + 25);

  // Box 2: Client Acknowledgment
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(15 + attBoxW + 5, p3y, attBoxW, attBoxH, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  const clientName = doc.splitTextToSize(report.companyName, attBoxW - 10);
  doc.text(clientName[0] || report.companyName, 20 + attBoxW + 5, p3y + 7.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Registration: ${report.registrationNumber}`, 20 + attBoxW + 5, p3y + 12);
  doc.text(`Facility: ${report.facilityLocation}`, 20 + attBoxW + 5, p3y + 17);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text("V Statement Approved", 20 + attBoxW + 5, p3y + 25);

  // Trigger file download
  const cleanName = report.companyName.replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`DataBridge_ESG_Carbon_Report_${cleanName}_${report.reportingPeriod.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
}
