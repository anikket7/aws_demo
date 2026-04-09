import { useEffect, useState } from "react";
import { getSummary, getTransactions } from "../api.js";

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [recent, setRecent] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;
        Promise.all([getSummary(), getTransactions()])
            .then(([s, tx]) => {
                if (!mounted) return;
                setSummary(s);
                setRecent(tx.slice(0, 5));
            })
            .catch((e) => {
                if (!mounted) return;
                setError(e?.message || "failed to load");
            });
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            {error ? <div className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}
            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded border p-4">
                    <div className="text-sm text-gray-600">Total Income</div>
                    <div className="text-xl font-semibold">{summary ? summary.totalIncome : "-"}</div>
                </div>
                <div className="rounded border p-4">
                    <div className="text-sm text-gray-600">Total Expenses</div>
                    <div className="text-xl font-semibold">{summary ? summary.totalExpense : "-"}</div>
                </div>
                <div className="rounded border p-4">
                    <div className="text-sm text-gray-600">Balance</div>
                    <div className="text-xl font-semibold">
                        {summary ? `${summary.balance >= 0 ? "+" : ""}${summary.balance}` : "-"}
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                <div className="rounded border">
                    {recent.length ? (
                        <ul className="divide-y">
                            {recent.map((t) => (
                                <li key={t._id} className="flex items-center justify-between p-3">
                                    <div>
                                        <div className="font-medium">{t.title}</div>
                                        <div className="text-sm text-gray-600">
                                            {t.type} • {t.category} • {new Date(t.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div
                                        className={`rounded px-2 py-1 text-sm font-semibold ${t.type === "income" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                            }`}
                                    >
                                        {t.amount}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-3 text-sm text-gray-600">No transactions</div>
                    )}
                </div>
            </div>
        </div>
    );
}
