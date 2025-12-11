import React, { useState } from 'react';
import { MOCK_ACCOUNTS } from '../services/mockData';
import { AccountType, FinancialAccount } from '../types';
import { Download, Filter, Calendar } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
};

const ReportTable = ({ accounts, title }: { accounts: FinancialAccount[], title: string }) => {
  const totalCurrent = accounts.reduce((sum, acc) => sum + acc.currentAmount, 0);
  const totalPrevious = accounts.reduce((sum, acc) => sum + acc.previousAmount, 0);

  return (
    <div className="mb-8">
      <h4 className="text-md font-bold text-slate-700 mb-3 uppercase tracking-wide border-b pb-2">{title}</h4>
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 font-medium">
          <tr>
            <th className="py-3 px-4">Account Code</th>
            <th className="py-3 px-4">Account Name</th>
            <th className="py-3 px-4 text-right">Current Period (IDR)</th>
            <th className="py-3 px-4 text-right">Previous Period (IDR)</th>
            <th className="py-3 px-4 text-right">Variance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {accounts.map((acc) => {
             const variance = acc.currentAmount - acc.previousAmount;
             const variancePct = acc.previousAmount !== 0 ? (variance / acc.previousAmount) * 100 : 0;
             return (
              <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-mono text-slate-500">{acc.code}</td>
                <td className="py-3 px-4 font-medium text-slate-700">{acc.name}</td>
                <td className="py-3 px-4 text-right">{formatCurrency(acc.currentAmount)}</td>
                <td className="py-3 px-4 text-right text-slate-500">{formatCurrency(acc.previousAmount)}</td>
                <td className={`py-3 px-4 text-right ${variance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {variancePct.toFixed(1)}%
                </td>
              </tr>
            );
          })}
          <tr className="bg-slate-50 font-bold">
            <td className="py-3 px-4" colSpan={2}>Total {title}</td>
            <td className="py-3 px-4 text-right text-slate-800">{formatCurrency(totalCurrent)}</td>
            <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(totalPrevious)}</td>
            <td className="py-3 px-4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default function Financials() {
  const [activeTab, setActiveTab] = useState<'activity' | 'balance' | 'cashflow'>('activity');

  const assets = MOCK_ACCOUNTS.filter(a => a.type === AccountType.ASSET);
  const liabilities = MOCK_ACCOUNTS.filter(a => a.type === AccountType.LIABILITY);
  const equity = MOCK_ACCOUNTS.filter(a => a.type === AccountType.EQUITY);
  const revenue = MOCK_ACCOUNTS.filter(a => a.type === AccountType.REVENUE);
  const expenses = MOCK_ACCOUNTS.filter(a => a.type === AccountType.EXPENSE);

  // Simplified Cash Flow Logic for Prototype
  const liquidAssets = assets.filter(a => a.isLiquid);
  const totalLiquid = liquidAssets.reduce((sum, a) => sum + a.currentAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Compliance Reports (BLU)</h1>
          <p className="text-slate-500 text-sm">Standar Akuntansi Pemerintah Berbasis Akrual & PMK No. 217/PMK.05/2015</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
             <Calendar size={16} />
             <span>Period: Dec 2023</span>
           </button>
           <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 shadow-sm">
             <Download size={16} />
             <span>Export PDF</span>
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'activity' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Laporan Operasional (Activity)
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'balance' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Neraca (Balance Sheet)
          </button>
          <button
            onClick={() => setActiveTab('cashflow')}
            className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'cashflow' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Laporan Arus Kas (Cash Flow)
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'activity' && (
            <div className="animate-in fade-in duration-300">
              <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-blue-800 border border-blue-100">
                <strong>BLU Requirement:</strong> Presented in <em>Single Step</em> format comparing Revenue vs Expenses to determine Surplus/Deficit.
              </div>
              <ReportTable accounts={revenue} title="Pendapatan (Revenues)" />
              <ReportTable accounts={expenses} title="Beban (Expenses)" />
              
              <div className="flex justify-end mt-6 pt-4 border-t-2 border-slate-100">
                 <div className="text-right">
                   <div className="text-sm text-slate-500 mb-1">Surplus / (Defisit) Operasional</div>
                   <div className={`text-2xl font-bold ${
                     (revenue.reduce((s, a) => s + a.currentAmount, 0) - expenses.reduce((s, a) => s + a.currentAmount, 0)) >= 0 
                     ? 'text-green-600' : 'text-red-600'
                   }`}>
                      {formatCurrency(revenue.reduce((s, a) => s + a.currentAmount, 0) - expenses.reduce((s, a) => s + a.currentAmount, 0))}
                   </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'balance' && (
            <div className="animate-in fade-in duration-300">
              <ReportTable accounts={assets} title="Aset (Assets)" />
              <div className="my-8 border-t border-slate-200"></div>
              <ReportTable accounts={liabilities} title="Kewajiban (Liabilities)" />
              <ReportTable accounts={equity} title="Ekuitas (Equity)" />
            </div>
          )}

          {activeTab === 'cashflow' && (
             <div className="animate-in fade-in duration-300">
                <div className="bg-amber-50 p-4 rounded-lg mb-6 text-sm text-amber-800 border border-amber-100">
                    <strong>Note:</strong> Simplified Direct Method for prototype demonstration.
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded border border-slate-200">
                    <span className="font-medium text-slate-700">Saldo Awal Kas</span>
                    <span className="font-mono">{formatCurrency(1200000000)}</span>
                  </div>
                   <div className="flex justify-between items-center p-4 bg-green-50 rounded border border-green-100">
                    <span className="font-medium text-green-700">Arus Kas Masuk (Operasional)</span>
                    <span className="font-mono font-bold text-green-700">+{formatCurrency(5200000000)}</span>
                  </div>
                   <div className="flex justify-between items-center p-4 bg-red-50 rounded border border-red-100">
                    <span className="font-medium text-red-700">Arus Kas Keluar (Beban & Investasi)</span>
                    <span className="font-mono font-bold text-red-700">-{formatCurrency(4900000000)}</span>
                  </div>
                   <div className="flex justify-between items-center p-4 bg-blue-50 rounded border border-blue-200">
                    <span className="font-bold text-blue-800">Saldo Akhir Kas & Setara Kas</span>
                    <span className="font-mono font-bold text-blue-800">{formatCurrency(1500000000)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-right">*Matches Account 1001 (Kas BLU)</p>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}