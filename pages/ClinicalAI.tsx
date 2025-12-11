import React, { useState } from 'react';
import { MOCK_CLINICAL_RECORDS } from '../services/mockData';
import { generateClinicalSummary } from '../services/geminiService';
import { ClinicalRecord } from '../types';
import { Bot, FileText, User, Calendar, Stethoscope, AlertTriangle, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Assuming standard markdown support, or we render raw text beautifully

export default function ClinicalAI() {
  const [selectedRecordId, setSelectedRecordId] = useState<string>(MOCK_CLINICAL_RECORDS[0].patient.id);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('general');

  const selectedRecord = MOCK_CLINICAL_RECORDS.find(r => r.patient.id === selectedRecordId);

  const handleGenerate = async () => {
    if (!selectedRecord) return;
    setLoading(true);
    setSummary('');
    const result = await generateClinicalSummary(selectedRecord, context);
    setSummary(result);
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Bot className="text-purple-600" />
             Clinical AI Assistant
           </h1>
           <p className="text-slate-500 text-sm">Secure Documentation Support (Powered by Gemini)</p>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3 mb-6">
        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
        <div className="text-sm text-amber-800">
          <span className="font-bold">NON-DIAGNOSTIC USE ONLY.</span> AI generated content is a draft for administrative assistance. 
          It must be reviewed and verified by a licensed clinician before entry into the permanent medical record.
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 overflow-hidden">
        {/* Left Panel: Patient Data (Input) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <User size={18} /> Patient Record
            </h3>
            <select 
              className="text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={selectedRecordId}
              onChange={(e) => {
                setSelectedRecordId(e.target.value);
                setSummary('');
              }}
            >
              {MOCK_CLINICAL_RECORDS.map(r => (
                <option key={r.patient.id} value={r.patient.id}>
                  {r.patient.name[0].given.join(' ')} {r.patient.name[0].family}
                </option>
              ))}
            </select>
          </div>
          
          <div className="p-6 overflow-y-auto space-y-6">
            {selectedRecord && (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Patient ID</label>
                    <div className="font-mono">{selectedRecord.patient.identifier[0].value}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Birth Date</label>
                    <div>{selectedRecord.patient.birthDate}</div>
                  </div>
                </div>

                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2">
                     <Stethoscope size={14} /> Clinical Observations (FHIR)
                   </label>
                   <div className="grid gap-2">
                     {selectedRecord.observations.map(obs => (
                       <div key={obs.id} className="flex justify-between p-2 bg-slate-50 rounded border border-slate-100">
                         <span className="text-slate-600 text-sm">{obs.code.text}</span>
                         <span className="font-bold text-slate-800 text-sm">
                           {obs.valueQuantity?.value} {obs.valueQuantity?.unit}
                         </span>
                       </div>
                     ))}
                   </div>
                </div>

                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2">
                     <FileText size={14} /> Unstructured Notes
                   </label>
                   <div className="p-3 bg-slate-50 rounded border border-slate-200 text-sm text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
                     {selectedRecord.clinicalNotes}
                   </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel: AI Output */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
           {/* Draft Watermark */}
           <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] z-0">
              <span className="text-9xl font-black transform -rotate-12">DRAFT</span>
           </div>

           <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center z-10">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <Sparkles size={18} className="text-purple-500" /> AI Generated Summary
             </h3>
             <div className="flex items-center gap-2">
               <select 
                 className="text-xs border-slate-300 rounded px-2 py-1"
                 value={context}
                 onChange={(e) => setContext(e.target.value)}
               >
                 <option value="general">SOAP Note</option>
                 <option value="discharge">Discharge Summary</option>
               </select>
               <button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Bot size={16} />}
                  <span>Generate</span>
               </button>
             </div>
           </div>

           <div className="flex-1 p-6 overflow-y-auto z-10 bg-white/50">
             {loading ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                 <Loader2 size={48} className="animate-spin text-purple-200" />
                 <p className="text-sm">Analyzing FHIR data and clinical notes...</p>
               </div>
             ) : summary ? (
               <div className="prose prose-sm max-w-none prose-slate">
                 <div className="whitespace-pre-wrap">{summary}</div>
                 <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400 italic">
                   Generated by Gemini 2.5 Flash | Timestamp: {new Date().toISOString()}
                 </div>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                 <Bot size={48} className="text-slate-200" />
                 <p>Select a patient and click Generate to start.</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}