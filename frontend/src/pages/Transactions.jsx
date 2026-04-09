import { useEffect, useState } from "react";
import { deleteTransaction, getTransactions } from "../api.js";
import { Link } from "react-router-dom";

export default function Transactions() {
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");

    async function load() {
        setError("");
        try {
            const tx = await getTransactions();
            setItems(tx);
        } catch (e) {
            setError(e?.message || "failed to load");
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function onDelete(id) {
        setError("");
        try {
            await deleteTransaction(id);
            await load();
        } catch (e) {
            setError(e?.message || "delete failed");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Transactions</h1>
                <Link className="rounded bg-black px-4 py-2 text-white" to="/add">
                    Add
                </Link>
            </div>
            {error ? <div className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}
            <div className="rounded border">
                {items.length ? (
                    <ul className="divide-y">
                        {items.map((t) => (
                            <li key={t._id} className="flex items-center justify-between gap-4 p-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <div className="truncate font-medium">{t.title}</div>
                                        <div className="text-sm text-gray-600">{t.type}</div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {t.category} • {new Date(t.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`rounded px-2 py-1 text-sm font-semibold ${t.type === "income" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                            }`}
                                    >
                                        {t.amount}
                                    </div>
                                    <Link className="rounded border px-3 py-1 text-sm" to={`/edit/${t._id}`}>
                                        Edit
                                    </Link>
                                    <button className="rounded border px-3 py-1 text-sm" onClick={() => onDelete(t._id)}>
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-3 text-sm text-gray-600">No transactions</div>
                )}
            </div>
        </div>
    );
}
