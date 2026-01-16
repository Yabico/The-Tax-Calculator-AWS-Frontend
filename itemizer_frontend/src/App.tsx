import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import FullTransactionsPage from "./pages/FullTransactionsPage.tsx";
import React from "react";
import ManageAccountsPage from "./pages/ManageAccountsPage.tsx";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 font-sans">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transactions" element={<FullTransactionsPage />} />
                    <Route path="/accounts" element={<ManageAccountsPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;