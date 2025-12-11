import { GoogleGenAI } from "@google/genai";
import { ClinicalRecord } from "../types";

// NOTE: In a real production app, this key should be proxied through a backend to avoid exposure.
// For this prototype, we use process.env.API_KEY as per instructions.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are a Clinical Documentation Assistant for the REGU-AI platform.
Your Role: Assist medical professionals by summarizing clinical notes and organizing FHIR data into readable formats.
CRITICAL RESTRICTIONS:
1. DO NOT provide medical diagnoses.
2. DO NOT recommend treatments.
3. ALWAYS label output as "DRAFT - FOR CLINICIAN REVIEW".
4. Ensure all summaries are objective and fact-based.
5. If the input data is insufficient, state this clearly.
6. Maintain a professional, neutral tone.
`;

export const generateClinicalSummary = async (record: ClinicalRecord, context: string = "general"): Promise<string> => {
  if (!apiKey) {
    return "Error: API Key is missing. Please configure the environment.";
  }

  try {
    const prompt = `
    Context: ${context === 'discharge' ? 'Create a Hospital Discharge Summary draft.' : 'Create a SOAP note summary.'}
    
    Patient Data (FHIR Format):
    Name: ${record.patient.name[0].given.join(' ')} ${record.patient.name[0].family}
    BirthDate: ${record.patient.birthDate}
    Gender: ${record.patient.gender}
    
    Observations:
    ${record.observations.map(o => `- ${o.code.text}: ${o.valueQuantity?.value} ${o.valueQuantity?.unit}`).join('\n')}
    
    Clinical Notes (Raw):
    "${record.clinicalNotes}"
    
    Task:
    Generate a structured, professional clinical summary based strictly on the above data.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for factual consistency
        maxOutputTokens: 1024,
      }
    });

    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating summary. Please check console for details.";
  }
};