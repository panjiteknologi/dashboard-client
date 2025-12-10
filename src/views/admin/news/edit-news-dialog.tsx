"use client";

import { useState, useEffect } from "react";
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

type NewsItem = {
  _id: string;
  id: number;
  title: string;
  subtitle: string;
  image: string;
  number: string;
  type: string;
  issuer: string;
  sector: string;
  jurisdiction: string;
  status: "Berlaku" | "Dicabut" | "Draft";
  publishedAt: string;
  effectiveAt: string;
  summary: string;
  keywords?: string[];
  sourceUrl?: string;
  modules: { duration: string; title: string; isFree: boolean }[];
  relatedCourses: string[];
  author: string;
  time: string;
  students: string;
  chapters: string;
  level: string;
  price: string;
};

type EditNewsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news: NewsItem;
  onSubmit: (data: {
    title: string;
    subtitle: string;
    image: string;
    number: string;
    type: string;
    issuer: string;
    sector: string;
    jurisdiction: string;
    status: "Berlaku" | "Dicabut" | "Draft";
    publishedAt: string;
    effectiveAt: string;
    summary: string;
    keywords: string[];
    sourceUrl: string;
    modules: { duration: string; title: string; isFree: boolean }[];
    relatedCourses: string[];
    author: string;
    time: string;
    students: string;
    chapters: string;
    level: string;
    price: string;
  }) => void;
};

export function EditNewsDialog({
  open,
  onOpenChange,
  news,
  onSubmit,
}: EditNewsDialogProps) {
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || "",
        subtitle: news.subtitle || "",
        image: news.image || "",
        number: news.number || "",
        type: news.type || "",
        issuer: news.issuer || "",
        sector: news.sector || "",
        jurisdiction: news.jurisdiction || "",
        status: news.status || "Draft",
        publishedAt: news.publishedAt || "",
        effectiveAt: news.effectiveAt || "",
        summary: news.summary || "",
        keywords: news.keywords || [],
        sourceUrl: news.sourceUrl || "",
        modules: news.modules || [{ duration: "", title: "", isFree: false }],
        relatedCourses: news.relatedCourses || [],
        author: news.author || "",
        time: news.time || "",
        students: news.students || "",
        chapters: news.chapters || "",
        level: news.level || "",
        price: news.price || "",
      });
    }
  }, [news]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      subtitle: formData.subtitle,
      image: formData.image,
      number: formData.number,
      type: formData.type,
      issuer: formData.issuer,
      sector: formData.sector,
      jurisdiction: formData.jurisdiction,
      status: formData.status,
      publishedAt: formData.publishedAt,
      effectiveAt: formData.effectiveAt,
      summary: formData.summary,
      keywords: formData.keywords,
      sourceUrl: formData.sourceUrl,
      modules: formData.modules,
      relatedCourses: formData.relatedCourses,
      author: formData.author,
      time: formData.time,
      students: formData.students,
      chapters: formData.chapters,
      level: formData.level,
      price: formData.price,
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
          <DialogTitle>Edit News</DialogTitle>
          <DialogDescription>
            Update the news item details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-number">Number</Label>
              <Input
                id="edit-number"
                value={formData.number}
                onChange={(e) => handleChange("number", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-subtitle">Subtitle</Label>
              <Input
                id="edit-subtitle"
                value={formData.subtitle}
                onChange={(e) => handleChange("subtitle", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-image">Image URL</Label>
              <Input
                id="edit-image"
                type="url"
                value={formData.image}
                onChange={(e) => handleChange("image", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Type</Label>
                <Input
                  id="edit-type"
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
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
                <Label htmlFor="edit-issuer">Issuer</Label>
                <Input
                  id="edit-issuer"
                  value={formData.issuer}
                  onChange={(e) => handleChange("issuer", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-sector">Sector</Label>
                <Input
                  id="edit-sector"
                  value={formData.sector}
                  onChange={(e) => handleChange("sector", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-jurisdiction">Jurisdiction</Label>
                <Input
                  id="edit-jurisdiction"
                  value={formData.jurisdiction}
                  onChange={(e) => handleChange("jurisdiction", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-author">Author</Label>
                <Input
                  id="edit-author"
                  value={formData.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-publishedAt">Published At</Label>
                <Input
                  id="edit-publishedAt"
                  type="date"
                  value={formData.publishedAt}
                  onChange={(e) => handleChange("publishedAt", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-effectiveAt">Effective At</Label>
                <Input
                  id="edit-effectiveAt"
                  type="date"
                  value={formData.effectiveAt}
                  onChange={(e) => handleChange("effectiveAt", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-summary">Summary</Label>
              <Textarea
                id="edit-summary"
                value={formData.summary}
                onChange={(e) => handleChange("summary", e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-sourceUrl">Source URL</Label>
              <Input
                id="edit-sourceUrl"
                type="url"
                value={formData.sourceUrl}
                onChange={(e) => handleChange("sourceUrl", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-students">Students</Label>
                <Input
                  id="edit-students"
                  value={formData.students}
                  onChange={(e) => handleChange("students", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-chapters">Chapters</Label>
                <Input
                  id="edit-chapters"
                  value={formData.chapters}
                  onChange={(e) => handleChange("chapters", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-level">Level</Label>
                <Input
                  id="edit-level"
                  value={formData.level}
                  onChange={(e) => handleChange("level", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Modules</Label>
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
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

