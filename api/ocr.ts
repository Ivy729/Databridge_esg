import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Type, Schema } from "@google/genai";

export const config = {
  maxDuration: 30, // Max duration for Vercel functions
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Support CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: "GEMINI_API_KEY environment variable is not configured in Vercel settings.",
        missingKey: true,
      });
    }

    const { imageBase64, mimeType = "image/jpeg" } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 data in request body." });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Clean base64 string
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const jsonSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        provider: { type: Type.STRING },
        providerConfidence: { type: Type.STRING, enum: ["High confidence", "Medium confidence", "Needs verification", "Not detected"] },
        providerSnippet: { type: Type.STRING },

        accountNumber: { type: Type.STRING },
        accountNumberConfidence: { type: Type.STRING, enum: ["High confidence", "Medium confidence", "Needs verification", "Not detected"] },
        accountNumberSnippet: { type: Type.STRING },

        meterNumber: { type: Type.STRING },
        meterNumberConfidence: { type: Type.STRING, enum: ["High confidence", "Medium confidence", "Needs verification", "Not detected"] },
        meterNumberSnippet: { type: Type.STRING },

        rawBillingDate: { type: Type.STRING },
        normalizedBillingDate: { type: Type.STRING },
        billingDateConfidence: { type: Type.STRING, enum: ["High confidence", "Medium confidence", "Needs verification", "Not detected"] },
        billingDateSnippet: { type: Type.STRING },

        billingPeriod: { type: Type.STRING },
        billingPeriodConfidence: { type: Type.STRING, enum: ["High confidence", "Medium confidence", "Needs verification", "Not detected"] },
        billingPeriodSnippet: { type: Type.STRING },

        previousMeterReading: { type: Type.STRING },
        previousMeterReadingConfidence: { type: Type.STRING, enum: ["High confidence", "Medium confidence", "Needs verification", "Not detected"] },
        previousMeterReadingSnippet: { type: Type.STRING },

        currentMeterReading: { type: Type.STRING },
        currentMeterReadingConfidence: { type: Type.STRING, enum: ["High confidence", "Medium confidence", "Needs verification", "Not detected"] },
        currentMeterReadingSnippet: { type: Type.STRING },

        kwhConsumptionText: { type: Type.STRING },
        numericKwh: { type: Type.NUMBER },
        kwhConsumptionConfidence: { type: Type.STRING, enum: ["High confidence", "Medium confidence", "Needs verification", "Not detected"] },
        kwhConsumptionSnippet: { type: Type.STRING },
        consumptionDerived: { type: Type.BOOLEAN },

        peakDemandKwText: { type: Type.STRING },
        numericPeakDemandKw: { type: Type.NUMBER },
        peakDemandKwConfidence: { type: Type.STRING, enum: ["High confidence", "Medium confidence", "Needs verification", "Not detected"] },
        peakDemandKwSnippet: { type: Type.STRING },

        totalAmountMyrText: { type: Type.STRING },
        numericTotalAmountMyr: { type: Type.NUMBER },
        totalAmountMyrConfidence: { type: Type.STRING, enum: ["High confidence", "Medium confidence", "Needs verification", "Not detected"] },
        totalAmountMyrSnippet: { type: Type.STRING },

        otherUsageInfo: { type: Type.STRING },
        otherUsageInfoSnippet: { type: Type.STRING },

        uncertainFields: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: [
        "provider", "accountNumber", "rawBillingDate", "kwhConsumptionText", "numericKwh", "uncertainFields"
      ],
    };

    const promptText = `Analyze this Malaysian electricity bill image carefully and extract all information directly from what is visible.

Strict rules:
1. Identify the utility provider first (Tenaga Nasional Berhad / TNB, Sarawak Energy, Air Selangor, etc.).
2. Extract values EXACTLY as visible. Do not estimate, infer, assume, or invent values.
3. Preserve all digits, decimal places, and units.
4. Distinguish between account number, meter number, invoice number, and bill amounts.
5. Do NOT confuse total bill amount (RM) with kWh consumption.
6. Set confidence status for each field: 'High confidence', 'Medium confidence', 'Needs verification', or 'Not detected'.
7. Provide supporting text snippet or label from the bill for each extracted field (e.g., 'No. Akaun: 2204 8839 1022').
8. If a value is unclear or partially visible, set confidence to 'Needs verification' and add field name to uncertainFields list.
9. Return normalized date in YYYY-MM-DD format if date is parseable.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
        temperature: 0.1,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini AI vision model.");
    }

    const parsedJson = JSON.parse(resultText);
    return res.status(200).json({ success: true, data: parsedJson });
  } catch (err: any) {
    console.error("Vercel Gemini OCR Error:", err);
    return res.status(500).json({ error: err.message || "Failed to process bill image via Gemini Vision." });
  }
}
