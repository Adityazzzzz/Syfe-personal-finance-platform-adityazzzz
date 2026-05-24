"use client";

import { useEffect, useState } from "react";
import { categoryApi, Category, CategoryRequest } from "@/lib/api";
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
import { Plus, Trash2, Loader2, Tags, Tag, Sparkles } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryRequest>({
    name: "",
    type: "EXPENSE",
  });

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryApi.create(formData);
      setIsOpen(false);
      setFormData({ name: "", type: "EXPENSE" });
      fetchCategories();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleDelete = async (name: string, isCustom: boolean) => {
    if (!isCustom) {
      alert("Default categories cannot be deleted");
      return;
    }
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await categoryApi.delete(name);
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-foreground" />
          <span className="text-lg">Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground">
            Categories
          </h2>
          <p className="text-muted-foreground mt-2">Organize your income and expenses</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-foreground text-background font-semibold uppercase tracking-[0.2em] shadow-lg shadow-black/10 hover:bg-foreground/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border border-border bg-card text-foreground">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display text-xl">
                <div className="p-2 rounded-lg bg-accent">
                  <Tag className="w-5 h-5 text-foreground" />
                </div>
                Create Custom Category
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-subtle">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-xs uppercase tracking-[0.2em] text-subtle">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "INCOME" | "EXPENSE") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="h-12 border-border bg-background text-foreground focus:border-foreground focus:ring-foreground/20">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-foreground text-background font-semibold uppercase tracking-[0.2em] shadow-lg shadow-black/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Category
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden border border-border bg-card shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg font-display flex items-center gap-2 text-foreground">
            <Tags className="w-5 h-5 text-foreground" />
            All Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-accent">
                <TableHead className="text-xs uppercase tracking-[0.2em] text-subtle">Name</TableHead>
                <TableHead className="text-xs uppercase tracking-[0.2em] text-subtle">Type</TableHead>
                <TableHead className="text-xs uppercase tracking-[0.2em] text-subtle">Source</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-[0.2em] text-subtle">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-accent">
                        <Tags className="w-8 h-8 text-subtle" />
                      </div>
                      <p className="text-muted-foreground text-lg">No categories found</p>
                      <p className="text-subtle text-sm">Create a custom category to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category, index) => (
                  <TableRow 
                    key={category.name}
                    className="hover:bg-muted/60 transition-colors border-b border-border last:border-0"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${
                          category.type === "INCOME" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                        }`}>
                          <Tag className="w-3.5 h-3.5" />
                        </div>
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        category.type === "INCOME"
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      }`}>
                        {category.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        category.isCustom
                          ? "bg-primary/10 text-primary"
                          : "bg-accent text-muted-foreground"
                      }`}>
                        {category.isCustom ? "Custom" : "Default"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.name, category.isCustom)}
                        disabled={!category.isCustom}
                        className={`transition-colors ${
                          category.isCustom 
                            ? "hover:bg-danger/10 hover:text-danger" 
                            : "opacity-40 cursor-not-allowed"
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
