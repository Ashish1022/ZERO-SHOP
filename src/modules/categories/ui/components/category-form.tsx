"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import z from "zod";
import {
  Trash,
  Save,
  X,
  Loader2,
  FolderTree,
  Tag,
  Image as ImageIcon,
  Search,
  ArrowUpDown,
} from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createCategorySchema } from "../../schema";

interface Props {
  initialData: any;
  categories?: Array<{ id: string; name: string }>;
}

export const CategoryForm = ({ initialData, categories = [] }: Props) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData
    ? "Update your category details and organization"
    : "Add a new category to organize your products";
  const toastMessage = initialData ? "Category updated." : "Category created.";
  const action = initialData ? "Save Changes" : "Create Category";

  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: initialData
      ? {
          name: initialData.name ?? "",
          slug: initialData.slug ?? "",
          description: initialData.description ?? "",
          status: initialData.status ?? "active",
          featured: initialData.featured ?? false,
          sortOrder: initialData.sortOrder ?? 0,
          parentId: initialData.parentId ?? null,
          thumbnailId: initialData.thumbnailId ?? null,
          seoTitle: initialData.seoTitle ?? "",
          seoDescription: initialData.seoDescription ?? "",
          seoKeywords: initialData.seoKeywords ?? "",
        }
      : {
          name: "",
          slug: "",
          description: "",
          status: "active",
          featured: false,
          sortOrder: 0,
          parentId: null,
          thumbnailId: null,
          seoTitle: "",
          seoDescription: "",
          seoKeywords: "",
        },
  });

  const trpc = useTRPC();

  const deleteMutation = useMutation(
    trpc.categories.deleteOne.mutationOptions()
  );
  const createMutation = useMutation(
    trpc.categories.createOne.mutationOptions()
  );
  const updateMutation = useMutation(
    trpc.categories.updateOne.mutationOptions()
  );

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteMutation.mutateAsync({
        categoryId: params.categoryId as string,
      });
      router.push("/admin/dashboard/categories");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof createCategorySchema>) => {
    try {
      setLoading(true);

      const cleanedValues = {
        ...values,
        parentId: values.parentId === "none" ? null : values.parentId,
      };

      if (initialData) {
        await updateMutation.mutateAsync({
          categoryId: params.categoryId as string,
          ...cleanedValues,
        });
      } else {
        await createMutation.mutateAsync(cleanedValues);
      }

      router.push("/admin/dashboard/categories");
      router.refresh();
    } catch (error) {
      console.error("Failed to save category:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const parentOptions = categories.filter((cat) => cat.id !== initialData?.id);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/dashboard/categories")}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          {initialData && (
            <Button
              variant="destructive"
              onClick={() => setOpen(true)}
              disabled={loading}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-primary" />
                <CardTitle>Basic Information</CardTitle>
              </div>
              <CardDescription>
                Essential category details and identification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category Name{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Electronics, Clothing"
                          disabled={loading}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (!initialData) {
                              form.setValue(
                                "slug",
                                generateSlug(e.target.value)
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        URL Slug <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="electronics-clothing"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of this category and what products it contains"
                        disabled={loading}
                        rows={4}
                        className="resize-none"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                <CardTitle>Organization & Display</CardTitle>
              </div>
              <CardDescription>
                Configure category hierarchy and visibility settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Category</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value ?? "none"}
                        defaultValue={field.value ?? "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="None (Top Level)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Root</Badge>
                              <span>None (Top Level)</span>
                            </div>
                          </SelectItem>
                          {parentOptions.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Draft</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="active">
                            <div className="flex items-center gap-2">
                              <Badge variant="default" className="bg-green-500">
                                Active
                              </Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="inactive">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Inactive</Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="0"
                            disabled={loading}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                          <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4 hover:border-primary/50 transition-colors">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-semibold">
                        Featured Category
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                <CardTitle>Category Image</CardTitle>
              </div>
              <CardDescription>
                Upload a representative image for this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="thumbnailId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="p-4 rounded-lg border border-dashed hover:border-primary/50 transition-colors">
                        {/* <ImageUpload
                          value={field.value ?? ""}
                          disabled={loading}
                          onChange={(url) => field.onChange(url)}
                          onRemove={() => field.onChange(null)}
                        /> */}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <CardTitle>Search Engine Optimization</CardTitle>
              </div>
              <CardDescription>
                Optimize your category for search engines and social sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Optimized title for search engines"
                        disabled={loading}
                        {...field}
                        value={field.value ?? ""}
                        maxLength={60}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Meta Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description for search engine results"
                        disabled={loading}
                        rows={3}
                        className="resize-none"
                        {...field}
                        value={field.value ?? ""}
                        maxLength={160}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seoKeywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Keywords</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="keyword1, keyword2, keyword3"
                        disabled={loading}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {initialData
                    ? "Save your changes to update this category"
                    : "Create your category to organize products"}
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/dashboard/categories")}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    disabled={loading}
                    type="submit"
                    className="min-w-35 shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {action}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
};
