import express from "express";
import mongoose from "mongoose";
import { Transaction } from "../models/Transaction.js";

export const transactionsRouter = express.Router();

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function validateTransactionBody(body) {
    const { title, amount, type, category, date, note } = body ?? {};

    if (!title || typeof title !== "string") return { ok: false, error: "title is required" };
    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) return { ok: false, error: "amount must be a number greater than zero" };
    if (type !== "income" && type !== "expense") return { ok: false, error: 'type must be "income" or "expense"' };
    if (!category || typeof category !== "string") return { ok: false, error: "category is required" };
    if (!date) return { ok: false, error: "date is required" };

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return { ok: false, error: "date must be a valid date" };

    return {
        ok: true,
        value: {
            title: title.trim(),
            amount,
            type,
            category: category.trim(),
            date: parsedDate,
            note: typeof note === "string" ? note : ""
        }
    };
}

transactionsRouter.post("/", wrap(async (req, res) => {
    const validated = validateTransactionBody(req.body);
    if (!validated.ok) return res.status(400).json({ message: validated.error });

    const created = await Transaction.create(validated.value);
    return res.status(201).json(created);
}));

transactionsRouter.get("/", wrap(async (req, res) => {
    const items = await Transaction.find().sort({ date: -1, createdAt: -1 });
    return res.json(items);
}));

transactionsRouter.get("/summary", wrap(async (req, res) => {
    const grouped = await Transaction.aggregate([
        { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);

    const totals = grouped.reduce((acc, row) => {
        acc[row._id] = row.total;
        return acc;
    }, {});

    const totalIncome = Number(totals.income ?? 0);
    const totalExpense = Number(totals.expense ?? 0);
    const balance = totalIncome - totalExpense;

    return res.json({ totalIncome, totalExpense, balance });
}));

transactionsRouter.get("/:id", wrap(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "transaction not found" });

    const item = await Transaction.findById(id);
    if (!item) return res.status(404).json({ message: "transaction not found" });

    return res.json(item);
}));

transactionsRouter.put("/:id", wrap(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "transaction not found" });

    const validated = validateTransactionBody(req.body);
    if (!validated.ok) return res.status(400).json({ message: validated.error });

    const updated = await Transaction.findByIdAndUpdate(id, validated.value, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "transaction not found" });

    return res.json(updated);
}));

transactionsRouter.delete("/:id", wrap(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "transaction not found" });

    const deleted = await Transaction.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "transaction not found" });

    return res.json({ message: "deleted" });
}));
