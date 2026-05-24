"use client";

import { useEffect, useState } from "react";
import { transactionApi, categoryApi, Transaction, Category, TransactionRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, Receipt, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<TransactionRequest>({
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      const [transactionsRes, categoriesRes] = await Promise.all([
        transactionApi.getAll(),
        categoryApi.getAll(),
      ]);
      setTransactions(transactionsRes.data.transactions);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await transactionApi.update(editingId, formData);
      } else {
        await transactionApi.create(formData);
      }
      setIsOpen(false);
      setEditingId(null);
      setFormData({
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        category: "",
        description: "",
      });
      fetchData();
    } catch (error) {
      console.error("Failed to save transaction:", error);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setFormData({
      amount: transaction.amount,
      date: transaction.date,
      category: transaction.category,
      description: transaction.description || "",
    });
    setEditingId(transaction.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await transactionApi.delete(id);
      fetchData();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-foreground" />
          <span className="text-lg">Loading transactions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground">
            Transactions
          </h2>
          <p className="text-muted-foreground mt-2">Manage your income and expenses</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingId(null);
                setFormData({
                  amount: 0,
                  date: new Date().toISOString().split("T")[0],
                  category: "",
                  description: "",
                });
              }}
              className="bg-foreground text-background font-semibold uppercase tracking-[0.2em] shadow-lg shadow-black/10 hover:bg-foreground/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px] border border-border bg-card text-foreground">
            <DialogHeader className="space-y-2">
              <DialogTitle className="flex items-center gap-2 font-display text-xl">
                <div className="p-2 rounded-lg bg-accent">
                  <Receipt className="w-5 h-5 text-foreground" />
                </div>
                {editingId ? "Edit Transaction" : "Add Transaction"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Capture the essentials below. The category automatically sets the transaction type.
              </p>
            </DialogHeader>
            <div className="rounded-2xl border border-border bg-muted/60 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-subtle">Preview</p>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {formData.amount ? `$${formData.amount.toFixed(2)}` : "$0.00"}
                </p>
                <p className="text-sm text-muted-foreground">{formData.date}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-subtle">Category</p>
                <p className="text-sm font-semibold text-foreground">
                  {formData.category || "Not set"}
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-xs uppercase tracking-[0.2em] text-subtle">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    required
                    className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-xs uppercase tracking-[0.2em] text-subtle">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="h-12 border-border bg-background text-foreground"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs uppercase tracking-[0.2em] text-subtle">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="h-12 border-border bg-background text-foreground focus:border-foreground focus:ring-foreground/20">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          {cat.name} ({cat.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-subtle">Type will be inferred from the category.</p>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description" className="text-xs uppercase tracking-[0.2em] text-subtle">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground"
                  />
                  <p className="text-xs text-subtle">Optional note to help you remember the transaction.</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="submit" 
                  className="flex-1 bg-foreground text-background font-semibold uppercase tracking-[0.2em] shadow-lg shadow-black/10"
                >
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-border text-foreground hover:bg-accent uppercase tracking-[0.2em]"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-accent">
                <TableHead className="text-xs uppercase tracking-[0.2em] text-subtle">Date</TableHead>
                <TableHead className="text-xs uppercase tracking-[0.2em] text-subtle">Category</TableHead>
                <TableHead className="text-xs uppercase tracking-[0.2em] text-subtle">Description</TableHead>
                <TableHead className="text-xs uppercase tracking-[0.2em] text-subtle">Type</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-[0.2em] text-subtle">Amount</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-[0.2em] text-subtle">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-accent">
                        <Receipt className="w-8 h-8 text-subtle" />
                      </div>
                      <p className="text-muted-foreground text-lg">No transactions yet</p>
                      <p className="text-subtle text-sm">Add your first transaction to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction, index) => (
                  <TableRow 
                    key={transaction.id}
                    className="hover:bg-muted/60 transition-colors border-b border-border last:border-0"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-medium text-foreground">
                      {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent text-muted-foreground">
                        {transaction.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{transaction.description || "-"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        transaction.type === "INCOME"
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      }`}>
                        {transaction.type === "INCOME" ? (
                          <ArrowUpCircle className="w-3 h-3" />
                        ) : (
                          <ArrowDownCircle className="w-3 h-3" />
                        )}
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${
                      transaction.type === "INCOME" ? "text-success" : "text-danger"
                    }`}>
                      {transaction.type === "INCOME" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(transaction)}
                          className="hover:bg-accent hover:text-foreground transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(transaction.id)}
                          className="hover:bg-danger/10 hover:text-danger transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
