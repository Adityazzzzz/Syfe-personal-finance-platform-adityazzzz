"use client";

import { useEffect, useState } from "react";
import { reportApi, MonthlyReport, YearlyReport } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Loader2, TrendingUp, TrendingDown, PiggyBank, BarChart3, Calendar, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReportsPage() {
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [yearlyReport, setYearlyReport] = useState<YearlyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [monthlyRes, yearlyRes] = await Promise.all([
        reportApi.getMonthly(year, month),
        reportApi.getYearly(year),
      ]);
      setMonthlyReport(monthlyRes.data);
      setYearlyReport(yearlyRes.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [year, month]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-foreground" />
          <span className="text-lg">Loading reports...</span>
        </div>
      </div>
    );
  }

  const incomeCategories = Object.entries(monthlyReport?.totalIncome || {});
  const expenseCategories = Object.entries(monthlyReport?.totalExpenses || {});

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-foreground">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground">
            Reports
          </h2>
          <p className="text-muted-foreground mt-2">View your financial reports and analytics</p>
        </div>
        <div className="flex gap-3 items-end flex-wrap">
          <div className="space-y-1.5">
            <Label htmlFor="year" className="text-xs uppercase tracking-[0.2em] text-subtle flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-foreground" />
              Year
            </Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-24 h-11 border-border bg-card text-foreground focus:border-foreground focus:ring-foreground/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="month" className="text-xs uppercase tracking-[0.2em] text-subtle">Month</Label>
            <Input
              id="month"
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="w-24 h-11 border-border bg-card text-foreground focus:border-foreground focus:ring-foreground/20"
            />
          </div>
          <Button 
            onClick={fetchReports}
            className="bg-foreground text-background font-semibold uppercase tracking-[0.2em] shadow-lg shadow-black/10 hover:bg-foreground/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-xs uppercase tracking-[0.3em] text-subtle flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-success/10">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              Monthly Income
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <p className="font-display text-3xl text-foreground">
              ${Object.values(monthlyReport?.totalIncome || {}).reduce((a, b) => a + b, 0).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total earnings this month</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-xs uppercase tracking-[0.3em] text-subtle flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-danger/10">
                <TrendingDown className="w-4 h-4 text-danger" />
              </div>
              Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <p className="font-display text-3xl text-foreground">
              ${Object.values(monthlyReport?.totalExpenses || {}).reduce((a, b) => a + b, 0).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total spending this month</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-xs uppercase tracking-[0.3em] text-subtle flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <PiggyBank className="w-4 h-4 text-primary" />
              </div>
              Net Savings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <p className={`font-display text-3xl ${(monthlyReport?.netSavings || 0) >= 0 ? "text-primary" : "text-warning"}`}>
              ${(monthlyReport?.netSavings || 0).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {(monthlyReport?.netSavings || 0) >= 0 ? "You're saving money!" : "Spending exceeds income"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income Breakdown */}
        <Card className="overflow-hidden border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg font-display flex items-center gap-2 text-foreground">
              <div className="p-2 rounded-lg bg-success/10">
                <BarChart3 className="w-5 h-5 text-success" />
              </div>
              Income by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {incomeCategories.length === 0 ? (
              <div className="p-8 text-center">
                <div className="p-3 rounded-full bg-accent w-fit mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-subtle" />
                </div>
                <p className="text-muted-foreground">No income data available</p>
                <p className="text-subtle text-sm mt-1">Add income transactions to see breakdown</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/60">
                    <TableHead className="text-xs uppercase tracking-[0.2em] text-subtle">Category</TableHead>
                    <TableHead className="text-right text-xs uppercase tracking-[0.2em] text-subtle">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeCategories.map(([category, amount]) => (
                    <TableRow 
                      key={category}
                      className="hover:bg-muted/60 transition-colors border-b border-border last:border-0"
                    >
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-success/10">
                            <DollarSign className="w-3.5 h-3.5 text-success" />
                          </div>
                          {category}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-success">
                        ${amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card className="overflow-hidden border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg font-display flex items-center gap-2 text-foreground">
              <div className="p-2 rounded-lg bg-danger/10">
                <BarChart3 className="w-5 h-5 text-danger" />
              </div>
              Expenses by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {expenseCategories.length === 0 ? (
              <div className="p-8 text-center">
                <div className="p-3 rounded-full bg-accent w-fit mx-auto mb-3">
                  <TrendingDown className="w-6 h-6 text-subtle" />
                </div>
                <p className="text-muted-foreground">No expense data available</p>
                <p className="text-subtle text-sm mt-1">Add expense transactions to see breakdown</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/60">
                    <TableHead className="text-xs uppercase tracking-[0.2em] text-subtle">Category</TableHead>
                    <TableHead className="text-right text-xs uppercase tracking-[0.2em] text-subtle">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseCategories.map(([category, amount]) => (
                    <TableRow 
                      key={category}
                      className="hover:bg-muted/60 transition-colors border-b border-border last:border-0"
                    >
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-danger/10">
                            <DollarSign className="w-3.5 h-3.5 text-danger" />
                          </div>
                          {category}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-danger">
                        ${amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Yearly Summary */}
      <Card className="overflow-hidden border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg font-display flex items-center gap-2 text-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            Yearly Summary ({year})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-success/10 rounded-xl border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-card">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <p className="text-sm font-medium text-success">Total Income</p>
              </div>
              <p className="text-2xl font-display text-success">
                ${Object.values(yearlyReport?.totalIncome || {}).reduce((a, b) => a + b, 0).toFixed(2)}
              </p>
            </div>
            <div className="p-5 bg-danger/10 rounded-xl border border-danger/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-card">
                  <TrendingDown className="w-4 h-4 text-danger" />
                </div>
                <p className="text-sm font-medium text-danger">Total Expenses</p>
              </div>
              <p className="text-2xl font-display text-danger">
                ${Object.values(yearlyReport?.totalExpenses || {}).reduce((a, b) => a + b, 0).toFixed(2)}
              </p>
            </div>
            <div className="p-5 bg-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-card">
                  <PiggyBank className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-medium text-primary">Net Savings</p>
              </div>
              <p className={`text-2xl font-display ${(yearlyReport?.netSavings || 0) >= 0 ? "text-primary" : "text-warning"}`}>
                ${(yearlyReport?.netSavings || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
