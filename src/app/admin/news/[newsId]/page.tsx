"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
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
import AdminLayout from "@/layout/admin-layout.tsx";
import { ArrowLeftIcon, UploadIcon, XIcon, Loader2 } from "lucide-react";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.newsId as Id<"news">;

  const news = useQuery(api.news.get, { id: newsId });
  const updateMutation = useMutation(api.news.update);
  const generateUploadUrl = useMutation(api.news.generateImageUploadUrl);
  const getImageUrl = useQuery(
    api.news.getImageUrl,
    news?.imageStorageId ? { storageId: news.imageStorageId } : "skip"
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    number: "",
    type: "" as "Berita" | "Event" | "Update" | "Studi Kasus" | "",
    issuer: "PT TIS Sertifikasi Internasional",
    sector: "",
    jurisdiction: "Indonesia" as "Indonesia" | "Internasional",
    status: "Draft" as "Berlaku" | "Dicabut" | "Draft",
    publishedAt: "",
    effectiveAt: "",
    summary: "",
    keywords: [] as string[],
    sourceUrl: "https://www.tsi-certification.com/news",
    modules: [{ duration: "", title: "", isFree: false }],
    relatedCourses: [] as string[],
    author: "Tim Redaksi TSI",
    time: "",
    students: "",
    chapters: "",
    level: "",
    price: "",
  });

  // Load news data
  useEffect(() => {
    if (news) {
      const imageUrl = news.image || getImageUrl || "";
      setFormData({
        title: news.title || "",
        subtitle: news.subtitle || "",
        image: imageUrl,
        number: news.number || "",
        type:
          (news.type as "Berita" | "Event" | "Update" | "Studi Kasus") || "",
        issuer: news.issuer || "PT TIS Sertifikasi Internasional",
        sector: news.sector || "",
        jurisdiction:
          (news.jurisdiction as "Indonesia" | "Internasional") || "Indonesia",
        status: news.status || "Draft",
        publishedAt: news.publishedAt || "",
        effectiveAt: news.effectiveAt || "",
        summary: news.summary || "",
        keywords: news.keywords || [],
        sourceUrl: news.sourceUrl || "https://www.tsi-certification.com/news",
        modules:
          news.modules && news.modules.length > 0
            ? news.modules
            : [{ duration: "", title: "", isFree: false }],
        relatedCourses: news.relatedCourses || [],
        author: news.author || "Tim Redaksi TSI",
        time: news.time || "",
        students: news.students || "",
        chapters: news.chapters || "",
        level: news.level || "",
        price: news.price || "",
      });

      if (imageUrl) {
        setImagePreview(imageUrl);
      }

      if (news.imageStorageId) {
        setImageStorageId(news.imageStorageId);
      }
    }
  }, [news, getImageUrl]);

  // Handle image upload
  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        setIsUploading(true);
        const uploadUrl = await generateUploadUrl();

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error("Upload failed");
        }

        const response = await result.json();
        const storageId = response.storageId || response;

        if (!storageId) {
          throw new Error("No storage ID returned");
        }

        setImageStorageId(storageId as Id<"_storage">);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        toast.success("Image uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload image");
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    },
    [generateUploadUrl]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    } else {
      toast.error("Please drop a valid image file");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageStorageId(null);
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      // Get image URL if storageId exists
      let imageUrl = "";
      if (imageStorageId) {
        imageUrl = imagePreview || "";
      } else if (imagePreview) {
        imageUrl = imagePreview;
      }

      // Filter out empty modules (where both duration and title are empty)
      const validModules = formData.modules.filter(
        (module) => module.duration.trim() !== "" || module.title.trim() !== ""
      );

      await updateMutation({
        id: newsId,
        data: {
          ...formData,
          image: imageUrl,
          imageStorageId: imageStorageId || undefined,
          modules: validModules,
          relatedCourses: formData.relatedCourses,
        },
      });
      toast.success("News updated successfully");
      router.push("/admin/news");
    } catch (error) {
      toast.error("Failed to update news");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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

  const updateModule = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
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

  if (!news) {
    return (
      <AdminLayout>
        <div className="flex flex-col gap-4 p-4 pt-0">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Loading news...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin/news")}
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <h1 className="text-2xl font-bold">Edit News</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-8">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="number">Number *</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                  readOnly
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  Number is auto-generated
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subtitle">Subtitle *</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>Image *</Label>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    <UploadIcon className="size-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Drag & drop image here, or click to select
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supports: JPG, PNG, GIF, WebP
                    </p>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </div>
                )}
                {isUploading && (
                  <p className="text-sm text-muted-foreground">
                    Uploading image...
                  </p>
                )}
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(
                      value: "Berita" | "Event" | "Update" | "Studi Kasus"
                    ) => handleChange("type", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Berita">Berita</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Update">Update</SelectItem>
                      <SelectItem value="Studi Kasus">Studi Kasus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "Berlaku" | "Dicabut" | "Draft") =>
                      handleChange("status", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Berlaku">Berlaku</SelectItem>
                      <SelectItem value="Dicabut">Dicabut</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="jurisdiction">Jurisdiction *</Label>
                  <Select
                    value={formData.jurisdiction}
                    onValueChange={(value: "Indonesia" | "Internasional") =>
                      handleChange("jurisdiction", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Indonesia">Indonesia</SelectItem>
                      <SelectItem value="Internasional">
                        Internasional
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleChange("author", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="issuer">Issuer *</Label>
                  <Input
                    id="issuer"
                    value={formData.issuer}
                    onChange={(e) => handleChange("issuer", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sector">Sector *</Label>
                  <Input
                    id="sector"
                    value={formData.sector}
                    onChange={(e) => handleChange("sector", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="publishedAt">Published At *</Label>
                  <Input
                    id="publishedAt"
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) =>
                      handleChange("publishedAt", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="effectiveAt">Effective At *</Label>
                  <Input
                    id="effectiveAt"
                    type="date"
                    value={formData.effectiveAt}
                    onChange={(e) =>
                      handleChange("effectiveAt", e.target.value)
                    }
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
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="summary">Summary *</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleChange("summary", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="students">Students</Label>
                  <Input
                    id="students"
                    value={formData.students}
                    onChange={(e) => handleChange("students", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="chapters">Chapters</Label>
                  <Input
                    id="chapters"
                    value={formData.chapters}
                    onChange={(e) => handleChange("chapters", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    value={formData.level}
                    onChange={(e) => handleChange("level", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Modules</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addModule}
                  >
                    Add Module
                  </Button>
                </div>
                {formData.modules.map((module, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-2 p-2 border rounded"
                  >
                    <Input
                      placeholder="Duration"
                      value={module.duration}
                      onChange={(e) =>
                        updateModule(index, "duration", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Title"
                      value={module.title}
                      onChange={(e) =>
                        updateModule(index, "title", e.target.value)
                      }
                    />
                    <div className="flex gap-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={module.isFree}
                          onChange={(e) =>
                            updateModule(index, "isFree", e.target.checked)
                          }
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

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/news")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
