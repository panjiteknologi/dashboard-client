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
import {
  ArrowLeftIcon,
  UploadIcon,
  XIcon,
  PlusIcon,
  TrashIcon,
  Loader2,
} from "lucide-react";
import { SelectableCombobox } from "@/components/ui/selectable-combobox";

export default function EditRegulationPage() {
  const router = useRouter();
  const params = useParams();
  const regulationId = params.regulationId as Id<"regulations">;

  const regulation = useQuery(api.regulations.get, { id: regulationId });
  const updateMutation = useMutation(api.regulations.update);
  const generateUploadUrl = useMutation(api.regulations.generateImageUploadUrl);
  const getImageUrl = useQuery(
    api.regulations.getImageUrl,
    regulation?.imageStorageId
      ? { storageId: regulation.imageStorageId }
      : "skip"
  );

  const createCategoryMutation = useMutation(api.regulationCategories.create);
  const createSubCategoryMutation = useMutation(
    api.regulationSubCategories.create
  );

  const categories = useQuery(api.regulationCategories.list);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    Id<"regulationCategories"> | undefined
  >();

  // Get subcategory to find its category
  const currentSubCategory = useQuery(
    api.regulationSubCategories.get,
    regulation?.subCategoryId ? { id: regulation.subCategoryId } : "skip"
  );

  // Get all subcategories for the selected category, or the current one if editing
  const subCategories = useQuery(
    api.regulationSubCategories.list,
    selectedCategoryId || currentSubCategory?.categoryId
      ? { categoryId: (selectedCategoryId || currentSubCategory?.categoryId)! }
      : "skip"
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
    type: "",
    issuer: "",
    sector: "",
    jurisdiction: "Nasional" as "Nasional" | "Internasional",
    status: "Draft" as "Berlaku" | "Dicabut" | "Draft",
    publishedAt: "",
    effectiveAt: "",
    summary: "",
    keywords: [] as string[],
    sourceUrl: "",
    attachments: [] as { filename: string; url: string }[],
    sections: [] as { title: string; description: string }[],
    relatedRegulations: [] as { id: number; title: string }[],
    subCategoryId: "" as Id<"regulationSubCategories"> | "",
  });

  const [keywordInput, setKeywordInput] = useState("");

  // Load regulation data
  useEffect(() => {
    if (regulation) {
      const imageUrl = regulation.image || getImageUrl || "";
      setFormData({
        title: regulation.title || "",
        subtitle: regulation.subtitle || "",
        image: imageUrl,
        type: regulation.type || "",
        issuer: regulation.issuer || "",
        sector: regulation.sector || "",
        jurisdiction:
          (regulation.jurisdiction as "Nasional" | "Internasional") ||
          "Nasional",
        status: regulation.status || "Draft",
        publishedAt: regulation.publishedAt || "",
        effectiveAt: regulation.effectiveAt || "",
        summary: regulation.summary || "",
        keywords: regulation.keywords || [],
        sourceUrl: regulation.sourceUrl || "",
        attachments: regulation.attachments || [],
        sections: regulation.sections || [],
        relatedRegulations: regulation.relatedRegulations || [],
        subCategoryId: regulation.subCategoryId || "",
      });

      if (imageUrl) {
        setImagePreview(imageUrl);
      }

      if (regulation.imageStorageId) {
        setImageStorageId(regulation.imageStorageId);
      }
    }
  }, [regulation, getImageUrl]);

  // Set category when subcategory is loaded
  useEffect(() => {
    if (currentSubCategory) {
      setSelectedCategoryId(currentSubCategory.categoryId);
    }
  }, [currentSubCategory]);

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

  const handleChange = (
    field: string,
    value: string | number | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId as Id<"regulationCategories">);
    setFormData((prev) => ({ ...prev, subCategoryId: "" }));
  };

  const handleCreateCategory = async (name: string): Promise<string> => {
    try {
      const id = `${name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")}-${Date.now()}`;
      const categoryId = await createCategoryMutation({
        id,
        name,
      });
      toast.success("Category created successfully");
      return categoryId;
    } catch (error) {
      toast.error("Failed to create category");
      throw error;
    }
  };

  const handleCreateSubCategory = async (name: string): Promise<string> => {
    if (!selectedCategoryId) {
      toast.error("Please select a category first");
      throw new Error("No category selected");
    }
    try {
      const id = `${name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")}-${Date.now()}`;
      const subCategoryId = await createSubCategoryMutation({
        id,
        name,
        categoryId: selectedCategoryId,
      });
      toast.success("Sub category created successfully");
      return subCategoryId;
    } catch (error) {
      toast.error("Failed to create sub category");
      throw error;
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()],
      }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  };

  const addAttachment = () => {
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, { filename: "", url: "" }],
    }));
  };

  const updateAttachment = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.map((att, i) =>
        i === index ? { ...att, [field]: value } : att
      ),
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: "", description: "" }],
    }));
  };

  const updateSection = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec, i) =>
        i === index ? { ...sec, [field]: value } : sec
      ),
    }));
  };

  const removeSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const addRelatedRegulation = () => {
    setFormData((prev) => ({
      ...prev,
      relatedRegulations: [...prev.relatedRegulations, { id: 0, title: "" }],
    }));
  };

  const updateRelatedRegulation = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      relatedRegulations: prev.relatedRegulations.map((rel, i) =>
        i === index ? { ...rel, [field]: value } : rel
      ),
    }));
  };

  const removeRelatedRegulation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      relatedRegulations: prev.relatedRegulations.filter((_, i) => i !== index),
    }));
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

      // Filter out empty attachments, sections, and relatedRegulations
      const validAttachments = formData.attachments.filter(
        (att) => att.filename.trim() !== "" && att.url.trim() !== ""
      );
      const validSections = formData.sections.filter(
        (sec) => sec.title.trim() !== "" || sec.description.trim() !== ""
      );
      const validRelatedRegulations = formData.relatedRegulations.filter(
        (rel) => rel.id > 0 && rel.title.trim() !== ""
      );

      await updateMutation({
        id: regulationId,
        data: {
          title: formData.title,
          subtitle: formData.subtitle,
          image: imageUrl,
          imageStorageId: imageStorageId || undefined,
          type: formData.type,
          issuer: formData.issuer,
          sector: formData.sector,
          jurisdiction: formData.jurisdiction,
          status: formData.status,
          publishedAt: formData.publishedAt,
          effectiveAt: formData.effectiveAt,
          summary: formData.summary,
          keywords:
            formData.keywords.length > 0 ? formData.keywords : undefined,
          sourceUrl: formData.sourceUrl || undefined,
          attachments:
            validAttachments.length > 0 ? validAttachments : undefined,
          sections: validSections.length > 0 ? validSections : undefined,
          relatedRegulations:
            validRelatedRegulations.length > 0
              ? validRelatedRegulations
              : undefined,
          subCategoryId: formData.subCategoryId
            ? (formData.subCategoryId as Id<"regulationSubCategories">)
            : undefined,
        },
      });
      toast.success("Regulation updated successfully");
      router.push("/admin/regulation");
    } catch (error) {
      toast.error("Failed to update regulation");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions =
    categories?.map((cat) => ({ id: cat._id, name: cat.name })) || [];

  // Include current subcategory even if category changes
  const subCategoryOptions = subCategories
    ? [
        ...subCategories.map((sub) => ({ id: sub._id, name: sub.name })),
        ...(currentSubCategory &&
        !subCategories.some((s) => s._id === currentSubCategory._id)
          ? [{ id: currentSubCategory._id, name: currentSubCategory.name }]
          : []),
      ]
    : currentSubCategory
      ? [{ id: currentSubCategory._id, name: currentSubCategory.name }]
      : [];

  if (!regulation) {
    return (
      <AdminLayout>
        <div className="flex flex-col gap-4 p-4 pt-0">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Loading regulation...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin/regulation")}
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <h1 className="text-2xl font-bold">Edit Regulation</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-8">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => handleChange("subtitle", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Image</Label>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <SelectableCombobox
                    label="Category *"
                    options={categoryOptions}
                    value={selectedCategoryId}
                    onChange={handleCategoryChange}
                    onCreateNew={handleCreateCategory}
                    placeholder="Select or create category"
                    createText="Create category"
                  />
                </div>
                <div className="grid gap-2">
                  <SelectableCombobox
                    label="Sub Category *"
                    options={subCategoryOptions}
                    value={formData.subCategoryId}
                    onChange={(value) => handleChange("subCategoryId", value)}
                    onCreateNew={handleCreateSubCategory}
                    placeholder={
                      selectedCategoryId
                        ? "Select or create sub category"
                        : "Please select a category first"
                    }
                    createText="Create sub category"
                    emptyText={
                      selectedCategoryId
                        ? "No sub categories found"
                        : "Please select a category first"
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Type *</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    placeholder="e.g., Undang-Undang, Peraturan Menteri"
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
                    onValueChange={(value: "Nasional" | "Internasional") =>
                      handleChange("jurisdiction", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nasional">Nasional</SelectItem>
                      <SelectItem value="Internasional">
                        Internasional
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="issuer">Issuer *</Label>
                  <Input
                    id="issuer"
                    value={formData.issuer}
                    onChange={(e) => handleChange("issuer", e.target.value)}
                    placeholder="e.g., Departemen Tenaga Kerja"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sector">Sector *</Label>
                  <Input
                    id="sector"
                    value={formData.sector}
                    onChange={(e) => handleChange("sector", e.target.value)}
                    placeholder="e.g., K3, Lingkungan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="summary">Summary *</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleChange("summary", e.target.value)}
                  rows={4}
                  placeholder="Enter regulation summary..."
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Keywords</Label>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                    placeholder="Add keyword and press Enter"
                  />
                  <Button type="button" onClick={addKeyword} variant="outline">
                    <PlusIcon className="size-4" />
                  </Button>
                </div>
                {formData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(index)}
                          className="hover:text-destructive"
                        >
                          <XIcon className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Attachments</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAttachment}
                  >
                    <PlusIcon className="size-4" />
                    Add Attachment
                  </Button>
                </div>
                {formData.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-2 p-2 border rounded"
                  >
                    <Input
                      placeholder="Filename"
                      value={attachment.filename}
                      onChange={(e) =>
                        updateAttachment(index, "filename", e.target.value)
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="URL"
                        value={attachment.url}
                        onChange={(e) =>
                          updateAttachment(index, "url", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttachment(index)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Sections</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSection}
                  >
                    <PlusIcon className="size-4" />
                    Add Section
                  </Button>
                </div>
                {formData.sections.map((section, index) => (
                  <div key={index} className="grid gap-2 p-2 border rounded">
                    <Input
                      placeholder="Section Title"
                      value={section.title}
                      onChange={(e) =>
                        updateSection(index, "title", e.target.value)
                      }
                    />
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Section Description"
                        value={section.description}
                        onChange={(e) =>
                          updateSection(index, "description", e.target.value)
                        }
                        rows={2}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSection(index)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Related Regulations</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRelatedRegulation}
                  >
                    <PlusIcon className="size-4" />
                    Add Related
                  </Button>
                </div>
                {formData.relatedRegulations.map((rel, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-2 p-2 border rounded"
                  >
                    <Input
                      type="number"
                      placeholder="ID"
                      value={rel.id || ""}
                      onChange={(e) =>
                        updateRelatedRegulation(
                          index,
                          "id",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Title"
                        value={rel.title}
                        onChange={(e) =>
                          updateRelatedRegulation(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRelatedRegulation(index)}
                      >
                        <TrashIcon className="size-4" />
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
                onClick={() => router.push("/admin/regulation")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
