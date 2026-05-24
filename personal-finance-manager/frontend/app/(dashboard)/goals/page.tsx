"use client";

import { useEffect, useState } from "react";
import { goalApi, Goal, GoalRequest } from "@/lib/api";
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
import { Plus, Trash2, Target, Loader2, Sparkles, TrendingUp, Calendar, DollarSign } from "lucide-react";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<GoalRequest>({
    goalName: "",
    targetAmount: 0,
    targetDate: "",
  });

  const fetchGoals = async () => {
    try {
      const response = await goalApi.getAll();
      setGoals(response.data.goals);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await goalApi.create(formData);
      setIsOpen(false);
      setFormData({ goalName: "", targetAmount: 0, targetDate: "" });
      fetchGoals();
    } catch (error) {
      console.error("Failed to create goal:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      await goalApi.delete(id);
      fetchGoals();
    } catch (error) {
      console.error("Failed to delete goal:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-foreground" />
          <span className="text-lg">Loading goals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground">
            Savings Goals
          </h2>
          <p className="text-muted-foreground mt-2">Track your financial goals and progress</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-foreground text-background font-semibold uppercase tracking-[0.2em] shadow-lg shadow-black/10 hover:bg-foreground/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px] border border-border bg-card text-foreground">
            <DialogHeader className="space-y-2">
              <DialogTitle className="flex items-center gap-2 font-display text-xl">
                <div className="p-2 rounded-lg bg-accent">
                  <Target className="w-5 h-5 text-foreground" />
                </div>
                Create Savings Goal
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Define a target and deadline so we can track your progress clearly.
              </p>
            </DialogHeader>
            <div className="rounded-2xl border border-border bg-muted/60 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-subtle">Goal</p>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {formData.goalName || "New savings goal"}
                </p>
                <p className="text-sm text-muted-foreground">Target date: {formData.targetDate || "Not set"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-subtle">Target</p>
                <p className="text-sm font-semibold text-foreground">
                  {formData.targetAmount ? `$${formData.targetAmount.toFixed(2)}` : "$0.00"}
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="goalName" className="text-xs uppercase tracking-[0.2em] text-subtle">Goal Name</Label>
                  <Input
                    id="goalName"
                    value={formData.goalName}
                    onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
                    placeholder="e.g., Emergency Fund"
                    required
                    className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground"
                  />
                  <p className="text-xs text-subtle">Make it specific so you can celebrate progress.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAmount" className="text-xs uppercase tracking-[0.2em] text-subtle">Target Amount</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) })}
                    required
                    className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetDate" className="text-xs uppercase tracking-[0.2em] text-subtle">Target Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    required
                    className="h-12 border-border bg-background text-foreground"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="submit" 
                  className="flex-1 bg-foreground text-background font-semibold uppercase tracking-[0.2em] shadow-lg shadow-black/10"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Goal
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

      {goals.length === 0 ? (
        <Card className="p-12 text-center border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
          <div className="p-4 rounded-full bg-accent w-fit mx-auto mb-4">
            <Target className="w-12 h-12 text-subtle" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No goals yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Create your first savings goal to start tracking your progress and achieve your financial dreams</p>
          <Button 
            onClick={() => setIsOpen(true)}
            className="bg-foreground text-background font-semibold uppercase tracking-[0.2em] shadow-lg shadow-black/10 hover:bg-foreground/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <Card 
              key={goal.id} 
              className="overflow-hidden border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-accent">
                      <Target className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">{goal.goalName}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        Target: ${goal.targetAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(goal.id)}
                    className="hover:bg-danger/10 hover:text-danger transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Progress
                    </span>
                    <span className={`font-semibold ${
                      goal.progressPercentage >= 100 ? "text-success" : "text-primary"
                    }`}>
                      {goal.progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        goal.progressPercentage >= 100 
                          ? "bg-success" 
                          : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="p-3 rounded-xl bg-success/10">
                    <p className="text-sm text-success flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-success" />
                      Current
                    </p>
                    <p className="text-xl font-bold text-success mt-1">
                      ${goal.currentProgress.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10">
                    <p className="text-sm text-primary flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-primary" />
                      Remaining
                    </p>
                    <p className="text-xl font-bold text-primary mt-1">
                      ${Math.max(goal.remainingAmount, 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Started: {new Date(goal.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-foreground" />
                    Target: {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
