import { useNavigate } from "react-router-dom";
import TransactionForm from "../components/TransactionForm.jsx";
import { createTransaction } from "../api.js";

export default function AddTransaction() {
    const navigate = useNavigate();

    async function onSubmit(payload) {
        await createTransaction(payload);
        navigate("/transactions");
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Add Transaction</h1>
            <TransactionForm submittingLabel="Create" onSubmit={onSubmit} />
        </div>
    );
}
