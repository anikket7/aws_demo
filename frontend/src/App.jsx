import { Link, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import AddTransaction from "./pages/AddTransaction.jsx";
import EditTransaction from "./pages/EditTransaction.jsx";

export default function App() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <header className="border-b">
                <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
                    <div className="font-semibold">Expense Tracker Assessment</div>
                    <nav className="flex gap-4 text-sm">
                        <Link className="underline" to="/dashboard">
                            Dashboard
                        </Link>
                        <Link className="underline" to="/transactions">
                            Transactions
                        </Link>
                        <Link className="underline" to="/add">
                            Add
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-4xl p-4">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/add" element={<AddTransaction />} />
                    <Route path="/edit/:id" element={<EditTransaction />} />
                </Routes>
            </main>
        </div>
    );
}
