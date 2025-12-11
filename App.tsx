import React, { useState } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Stethoscope, BadgeDollarSign, ShieldAlert, LogOut, Menu, X, Activity, BrainCircuit } from 'lucide-react';
import { Role } from './types';
import Dashboard from './pages/Dashboard';
import Financials from './pages/Financials';
import ClinicalAI from './pages/ClinicalAI';
import Receivables from './pages/Receivables';

// --- Components ---

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg ${
          isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
};

const Header = ({ role, setRole }: { role: Role, setRole: (r: Role) => void }) => {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="md:hidden">
          {/* Mobile menu trigger placeholder */}
          <Menu className="text-slate-500" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent hidden md:block">
          REGU-AI Platform
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
           <ShieldAlert size={16} className="text-amber-600" />
           <span className="text-xs font-semibold text-slate-600">PHI Environment: Secure</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 hidden sm:inline">Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="text-sm border border-slate-300 rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value={Role.ADMIN}>Administrator</option>
            <option value={Role.CLINICIAN}>Clinician (Dr)</option>
            <option value={Role.ACCOUNTANT}>Accountant</option>
          </select>
        </div>
        
        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

interface ProtectedRouteProps {
  allowedRoles: Role[];
  currentRole: Role;
}

const ProtectedRoute = ({ children, allowedRoles, currentRole }: React.PropsWithChildren<ProtectedRouteProps>) => {
  if (!allowedRoles.includes(currentRole)) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Access Denied</h2>
        <p className="text-slate-600 mt-2">Your current role ({currentRole}) does not have permission to view this module.</p>
      </div>
    );
  }
  return <>{children}</>;
};

// --- Main App ---

export default function App() {
  const [role, setRole] = useState<Role>(Role.ADMIN);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-16 flex items-center justify-center border-b border-slate-200">
             <div className="flex items-center gap-2 font-bold text-xl text-blue-900">
                <Activity size={24} className="text-blue-600" />
                <span>REGU-AI</span>
             </div>
          </div>

          <nav className="p-4 space-y-2 flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 mt-2">Overview</div>
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
            
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 mt-4">BLU Compliance</div>
            <SidebarItem to="/financials" icon={BadgeDollarSign} label="Financial Reports" />
            <SidebarItem to="/receivables" icon={FileText} label="AR Aging & Provision" />

            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 mt-4">Clinical Intelligence</div>
            <SidebarItem to="/clinical-ai" icon={BrainCircuit} label="AI Documentation" />
            <SidebarItem to="/records" icon={Stethoscope} label="Patient Records (FHIR)" />
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header role={role} setRole={setRole} />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard role={role} />} />
              
              <Route path="/financials" element={
                <ProtectedRoute allowedRoles={[Role.ADMIN, Role.ACCOUNTANT]} currentRole={role}>
                  <Financials />
                </ProtectedRoute>
              } />
              
              <Route path="/receivables" element={
                <ProtectedRoute allowedRoles={[Role.ADMIN, Role.ACCOUNTANT]} currentRole={role}>
                  <Receivables />
                </ProtectedRoute>
              } />

              <Route path="/clinical-ai" element={
                <ProtectedRoute allowedRoles={[Role.ADMIN, Role.CLINICIAN]} currentRole={role}>
                  <ClinicalAI />
                </ProtectedRoute>
              } />
              
               <Route path="/records" element={
                <ProtectedRoute allowedRoles={[Role.ADMIN, Role.CLINICIAN]} currentRole={role}>
                  <div className="p-4 bg-white rounded shadow text-center">
                    <h2 className="text-lg font-bold">FHIR Data Store</h2>
                    <p className="text-slate-600">Direct record browsing is restricted in this demo. Please use the AI Documentation module.</p>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
}