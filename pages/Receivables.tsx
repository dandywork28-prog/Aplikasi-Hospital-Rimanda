import React from 'react';
import { MOCK_RECEIVABLES } from '../services/mockData';
import { Receivable } from '../types';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const calculateAgeInMonths = (dateString: string) => {
  const today = new Date(); // In a real app, this might be the reporting date
  const invoiceDate = new Date(dateString);
  const diffTime = Math.abs(today.getTime() - invoiceDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return Math.floor(diffDays / 30);
};

const getProvisionRate = (months: number) => {
  if (months < 6) return 0;
  if (months >= 6 && months <= 12) return 0.50; // 50%
  return 1.00; // 100%
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
};

export default function Receivables() {
  const processedData = MOCK_RECEIVABLES.map(r => {
    const ageMonths = calculateAgeInMonths(r.invoiceDate);
    const provisionRate = getProvisionRate(ageMonths);
    const provisionAmount = r.amount * provisionRate;
    return { ...r, ageMonths, provisionRate, provisionAmount };
  });

  const totalReceivables = processedData.reduce((sum, r) => sum + r.amount, 0);
  const totalProvision = processedData.reduce((sum, r) => sum + r.provisionAmount, 0);
  const coverageRatio = (totalProvision / totalReceivables) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Accounts Receivable Aging & Provisioning</h1>
        <p className="text-slate-500 text-sm">Automated calculation based on PMK No. 217/PMK.05/2015 for BLU</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Clock size={20} />
            <h3 className="font-medium">Total Receivables</h3>
          </div>
          <div className="text-2xl font-bold text-slate-800">{formatCurrency(totalReceivables)}</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-amber-600 mb-2">
            <AlertCircle size={20} />
            <h3 className="font-medium">Required Provision (CKPN)</h3>
          </div>
          <div className="text-2xl font-bold text-amber-600">{formatCurrency(totalProvision)}</div>
          <p className="text-xs text-slate-400 mt-1">Bad Debt Reserve</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <CheckCircle size={20} />
            <h3 className="font-medium">Coverage Ratio</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600">{coverageRatio.toFixed(1)}%</div>
          <p className="text-xs text-slate-400 mt-1">of Total AR Value</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-700">Aged Receivable Detail</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-white text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="py-3 px-6">Debtor Name</th>
              <th className="py-3 px-6">Invoice Date</th>
              <th className="py-3 px-6">Age (Months)</th>
              <th className="py-3 px-6 text-right">Amount (IDR)</th>
              <th className="py-3 px-6 text-center">Provision Rate</th>
              <th className="py-3 px-6 text-right">Provision Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {processedData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-6 font-medium text-slate-700">{row.debtorName}</td>
                <td className="py-3 px-6 text-slate-500">{row.invoiceDate}</td>
                <td className="py-3 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.ageMonths > 12 ? 'bg-red-100 text-red-700' :
                    row.ageMonths >= 6 ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {row.ageMonths} mo
                  </span>
                </td>
                <td className="py-3 px-6 text-right font-medium">{formatCurrency(row.amount)}</td>
                <td className="py-3 px-6 text-center text-slate-500">{(row.provisionRate * 100)}%</td>
                <td className="py-3 px-6 text-right text-amber-600 font-medium">{formatCurrency(row.provisionAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}