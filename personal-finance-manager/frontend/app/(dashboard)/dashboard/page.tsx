"use client";

import { useEffect, useState } from "react";
import { transactionApi, goalApi, reportApi, Transaction, Goal, MonthlyReport } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Target, Wallet, Loader2, DollarSign, PiggyBank, Receipt } from "lucide-react";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const [transactionsRes, goalsRes, reportRes] = await Promise.all([
          transactionApi.getAll(),
          goalApi.getAll(),
          reportApi.getMonthly(now.getFullYear(), now.getMonth() + 1),
        ]);
        setTransactions(transactionsRes.data.transactions.slice(0, 5));
        setGoals(goalsRes.data.goals.slice(0, 3));
        setReport(reportRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const totalIncome = Object.values(report?.totalIncome || {}).reduce((a, b) => a + b, 0);
  const totalExpenses = Object.values(report?.totalExpenses || {}).reduce((a, b) => a + b, 0);
  const netSavings = report?.netSavings || 0;
  const monthLabel = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const savingsTone = netSavings >= 0 ? "text-success" : "text-warning";
  const savingsBadge = netSavings >= 0 ? "bg-success/10" : "bg-warning/10";
  const savingsLabel = netSavings >= 0 ? "On track" : "Needs attention";
  const savingsMessage = netSavings >= 0
    ? "You spent less than you earned this month."
    : "Spending is above income this month.";

  return (
    <div className="space-y-10 text-foreground">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end justify-between mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-subtle">
            <span className="rounded-full border border-border bg-card px-3 py-1">Overview</span>
            <span>{monthLabel}</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back — here&apos;s a clear overview of your cashflow.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-foreground" />
            Updated moments ago
          </div>
          <Link href="/transactions">
            <Button className="bg-foreground text-background font-semibold uppercase tracking-[0.2em] shadow-lg shadow-black/10 hover:bg-foreground/90">
              <Receipt className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
          <Link href="/goals">
            <Button variant="outline" className="border-border text-foreground hover:bg-accent uppercase tracking-[0.2em]">
              <PiggyBank className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">Monthly highlight</p>
            <p className="text-lg font-semibold text-foreground mt-2">{savingsMessage}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Net savings: {netSavings >= 0 ? "+" : "-"}${Math.abs(netSavings).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${savingsBadge} ${savingsTone}`}>
            {savingsLabel}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs uppercase tracking-[0.3em] text-subtle">Total Income</CardTitle>
            <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="font-display text-3xl text-foreground">
              ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs uppercase tracking-[0.3em] text-subtle">Total Expenses</CardTitle>
            <div className="h-10 w-10 rounded-full bg-danger/10 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-danger" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="font-display text-3xl text-foreground">
              ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3" />
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs uppercase tracking-[0.3em] text-subtle">Net Savings</CardTitle>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              netSavings >= 0 ? "bg-primary/10" : "bg-warning/10"
            }`}>
              <TrendingUp className={`h-5 w-5 ${netSavings >= 0 ? "text-primary" : "text-warning"}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className={`font-display text-3xl ${netSavings >= 0 ? "text-primary" : "text-warning"}`}>
              ${netSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <Card className="border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-display text-foreground">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-primary" />
                </div>
                Recent Transactions
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-subtle">{transactions.length} items</span>
              </CardTitle>
              <Link href="/transactions">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-accent">
                  View all
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-3">
                  <Receipt className="h-6 w-6 text-subtle" />
                </div>
                <p className="text-muted-foreground">No transactions yet</p>
                <Link href="/transactions">
                  <Button variant="link" className="text-primary mt-2">Add your first transaction</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((t, index) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-2xl border border-border bg-muted/60 p-4 hover:bg-accent transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        t.type === "INCOME" ? "bg-success/10" : "bg-danger/10"
                      }`}>
                        {t.type === "INCOME" ? (
                          <ArrowUpRight className="h-5 w-5 text-success" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-danger" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{t.category}</p>
                        <p className="text-sm text-muted-foreground">{t.date}</p>
                      </div>
                    </div>
                    <span className={`font-display text-lg ${t.type === "INCOME" ? "text-success" : "text-danger"}`}>
                      {t.type === "INCOME" ? "+" : "-"}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card className="border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-display text-foreground">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                  <Target className="w-4 h-4 text-foreground" />
                </div>
                Savings Goals
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-subtle">{goals.length} goals</span>
              </CardTitle>
              <Link href="/goals">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-accent">
                  View all
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {goals.length === 0 ? (
              <div className="text-center py-8">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-3">
                  <PiggyBank className="h-6 w-6 text-subtle" />
                </div>
                <p className="text-muted-foreground">No goals set yet</p>
                <Link href="/goals">
                  <Button variant="link" className="text-primary mt-2">Create your first goal</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {goals.map((goal) => (
                  <div key={goal.id} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                          <Target className="h-4 w-4 text-foreground" />
                        </div>
                        <span className="font-semibold text-foreground">{goal.goalName}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ${goal.currentProgress.toLocaleString('en-US', { minimumFractionDigits: 2 })} / ${goal.targetAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          goal.progressPercentage >= 100
                            ? 'bg-success'
                            : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs">
                      <p className="text-muted-foreground">{goal.progressPercentage.toFixed(1)}% complete</p>
                      {goal.progressPercentage >= 100 && (
                        <span className="text-success">Goal achieved</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
