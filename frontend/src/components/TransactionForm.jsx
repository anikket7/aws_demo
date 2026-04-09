import { useEffect, useMemo, useState } from "react";

function toDateInputValue(value) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const yyyy = String(d.getFullYear());
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export default function TransactionForm({ initial, onSubmit, submittingLabel }) {
    const defaults = useMemo(
        () => ({
            title: initial?.title ?? "",
            amount: initial?.amount ?? "",
            type: initial?.type ?? "expense",
            category: initial?.category ?? "",
            date: toDateInputValue(initial?.date) ?? "",
            note: initial?.note ?? ""
        }),
        [initial]
    );

    const [form, setForm] = useState(defaults);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setForm(defaults);
    }, [defaults]);

    function set(key) {
        return (e) => setForm((s) => ({ ...s, [key]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            await onSubmit({
                title: form.title,
                amount: Number(form.amount),
                type: form.type,
                category: form.category,
                date: form.date,
                note: form.note
            });
        } catch (err) {
            setError(err?.message || "submit failed");
            setSubmitting(false);
            return;
        }
        setSubmitting(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error ? <div className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}
            <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                    <div className="text-sm font-medium">Title</div>
                    <input className="mt-1 w-full rounded border p-2" value={form.title} onChange={set("title")} />
                </label>
                <label className="block">
                    <div className="text-sm font-medium">Amount</div>
                    <input className="mt-1 w-full rounded border p-2" type="number" min="0.01" step="0.01" value={form.amount} onChange={set("amount")} />
                </label>
                <label className="block">
                    <div className="text-sm font-medium">Type</div>
                    <select className="mt-1 w-full rounded border p-2" value={form.type} onChange={set("type")}>
                        <option value="income">income</option>
                        <option value="expense">expense</option>
                    </select>
                </label>
                <label className="block">
                    <div className="text-sm font-medium">Category</div>
                    <input className="mt-1 w-full rounded border p-2" value={form.category} onChange={set("category")} />
                </label>
                <label className="block">
                    <div className="text-sm font-medium">Date</div>
                    <input className="mt-1 w-full rounded border p-2" type="date" value={form.date} onChange={set("date")} />
                </label>
            </div>
            <label className="block">
                <div className="text-sm font-medium">Note</div>
                <textarea className="mt-1 w-full rounded border p-2" rows="3" value={form.note} onChange={set("note")} />
            </label>
            <button disabled={submitting} className="rounded bg-black px-4 py-2 text-white disabled:opacity-60" type="submit">
                {submitting ? "Saving..." : submittingLabel}
            </button>
        </form>
    );
}
