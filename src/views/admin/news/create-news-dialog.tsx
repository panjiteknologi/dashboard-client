"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CreateNewsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
};

export function CreateNewsDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateNewsDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    subtitle: "",
    image: "",
    number: "",
    type: "",
    issuer: "",
    sector: "",
    jurisdiction: "",
    status: "Draft" as "Berlaku" | "Dicabut" | "Draft",
    publishedAt: "",
    effectiveAt: "",
    summary: "",
    keywords: [] as string[],
    sourceUrl: "",
    modules: [{ duration: "", title: "", isFree: false }],
    relatedCourses: [] as string[],
    author: "",
    time: "",
    students: "",
    chapters: "",
    level: "",
    price: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      data: {
        ...formData,
        id: Number(formData.id),
        modules: formData.modules,
        relatedCourses: formData.relatedCourses,
      },
    });
  };

  const handleChange = (
    field: string,
    value: string | number | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addModule = () => {
    setFormData((prev) => ({
      ...prev,
      modules: [...prev.modules, { duration: "", title: "", isFree: false }],
    }));
  };

  const updateModule = (index: number, field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.map((mod, i) =>
        i === index ? { ...mod, [field]: value } : mod
      ),
    }));
  };

  const removeModule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create News</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new news item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="id">ID *</Label>
                <Input
                  id="id"
                  type="number"
                  required
                  value={formData.id}
                  onChange={(e) => handleChange("id", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="number">Number *</Label>
                <Input
                  id="number"
                  required
                  value={formData.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subtitle">Subtitle *</Label>
              <Input
                id="subtitle"
                required
                value={formData.subtitle}
                onChange={(e) => handleChange("subtitle", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => handleChange("image", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type *</Label>
                <Input
                  id="type"
                  required
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "Berlaku" | "Dicabut" | "Draft") =>
                    handleChange("status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Berlaku">Berlaku</SelectItem>
                    <SelectItem value="Dicabut">Dicabut</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="issuer">Issuer *</Label>
                <Input
                  id="issuer"
                  required
                  value={formData.issuer}
                  onChange={(e) => handleChange("issuer", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sector">Sector *</Label>
                <Input
                  id="sector"
                  required
                  value={formData.sector}
                  onChange={(e) => handleChange("sector", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="jurisdiction">Jurisdiction *</Label>
                <Input
                  id="jurisdiction"
                  required
                  value={formData.jurisdiction}
                  onChange={(e) => handleChange("jurisdiction", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  required
                  value={formData.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="publishedAt">Published At *</Label>
                <Input
                  id="publishedAt"
                  type="date"
                  required
                  value={formData.publishedAt}
                  onChange={(e) => handleChange("publishedAt", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="effectiveAt">Effective At *</Label>
                <Input
                  id="effectiveAt"
                  type="date"
                  required
                  value={formData.effectiveAt}
                  onChange={(e) => handleChange("effectiveAt", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="summary">Summary *</Label>
              <Textarea
                id="summary"
                required
                value={formData.summary}
                onChange={(e) => handleChange("summary", e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sourceUrl">Source URL</Label>
              <Input
                id="sourceUrl"
                type="url"
                value={formData.sourceUrl}
                onChange={(e) => handleChange("sourceUrl", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  required
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="students">Students *</Label>
                <Input
                  id="students"
                  required
                  value={formData.students}
                  onChange={(e) => handleChange("students", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="chapters">Chapters *</Label>
                <Input
                  id="chapters"
                  required
                  value={formData.chapters}
                  onChange={(e) => handleChange("chapters", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="level">Level *</Label>
                <Input
                  id="level"
                  required
                  value={formData.level}
                  onChange={(e) => handleChange("level", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                required
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Modules *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addModule}>
                  Add Module
                </Button>
              </div>
              {formData.modules.map((module, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 p-2 border rounded">
                  <Input
                    placeholder="Duration"
                    value={module.duration}
                    onChange={(e) => updateModule(index, "duration", e.target.value)}
                  />
                  <Input
                    placeholder="Title"
                    value={module.title}
                    onChange={(e) => updateModule(index, "title", e.target.value)}
                  />
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={module.isFree}
                        onChange={(e) => updateModule(index, "isFree", e.target.checked)}
                      />
                      <span className="text-sm">Free</span>
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeModule(index)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

