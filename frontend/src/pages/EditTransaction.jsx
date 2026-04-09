import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TransactionForm from "../components/TransactionForm.jsx";
import { getTransaction, updateTransaction } from "../api.js";

export default function EditTransaction() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [initial, setInitial] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;
        setError("");
        getTransaction(id)
            .then((t) => {
                if (!mounted) return;
                setInitial(t);
            })
            .catch((e) => {
                if (!mounted) return;
                setError(e?.message || "failed to load");
            });
        return () => {
            mounted = false;
        };
    }, [id]);

    async function onSubmit(payload) {
        await updateTransaction(id, payload);
        navigate("/transactions");
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Edit Transaction</h1>
            {error ? <div className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}
            {initial ? <TransactionForm initial={initial} submittingLabel="Update" onSubmit={onSubmit} /> : null}
        </div>
    );
}
