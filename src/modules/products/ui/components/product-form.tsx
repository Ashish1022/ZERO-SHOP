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
  Package,
  DollarSign,
  Truck,
  Tag,
  FileText,
  Search,
} from "lucide-react";

import AlertModal from "@/components/modals/alert-modal";
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
import ImageUpload from "@/components/image-upload";
import { createProductSchema } from "../../schema";

interface Props {
  initialData: any;
  images: any;
  categories?: Array<{ id: string; name: string }>;
}

export const ProductForm = ({ initialData, categories = [] }: Props) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData
    ? "Update your product details and information"
    : "Add a new product to your catalog";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save Changes" : "Create Product";

  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: initialData
      ? {
          name: initialData.name ?? "",
          slug: initialData.slug ?? "",
          description: initialData.description ?? "",
          shortDescription: initialData.shortDescription ?? "",
          price: initialData.price ?? "",
          compareAtPrice: initialData.compareAtPrice ?? null,
          costPrice: initialData.costPrice ?? null,
          sku: initialData.sku ?? "",
          categoryId: initialData.categoryId ?? "",
          status: initialData.status ?? "active",
          featured: initialData.featured ?? false,
          taxable: initialData.taxable ?? true,
          trackQuantity: initialData.trackQuantity ?? true,
          quantity: initialData.quantity ?? 0,
          lowStockThreshold: initialData.lowStockThreshold ?? 5,
          allowBackorders: initialData.allowBackorders ?? false,
          requiresShipping: initialData.requiresShipping ?? true,
          freeShipping: initialData.freeShipping ?? false,
          shippingCost: initialData.shippingCost ?? null,
          weight: initialData.weight ?? null,
          badge: initialData.badge ?? null,
          refundPolicy: initialData.refundPolicy ?? "30-day",
          images: initialData.images ?? [],
          seoTitle: initialData.seoTitle ?? "",
          seoDescription: initialData.seoDescription ?? "",
        }
      : {
          name: "",
          slug: "",
          description: "",
          shortDescription: "",
          price: "",
          status: "active",
          featured: false,
          taxable: true,
          trackQuantity: true,
          quantity: 0,
          lowStockThreshold: 5,
          allowBackorders: false,
          requiresShipping: true,
          freeShipping: false,
          refundPolicy: "30-day",
          images: [],
          seoTitle: "",
          seoDescription: "",
        },
  });

  const trpc = useTRPC();

  const deleteMutation = useMutation(trpc.products.deleteOne.mutationOptions());
  const createMutation = useMutation(trpc.products.createOne.mutationOptions());
  const updateMutation = useMutation(trpc.products.updateOne.mutationOptions());

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteMutation.mutateAsync({
        productId: params.productId as string,
      });
      router.push("/admin/dashboard/products");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof createProductSchema>) => {
    try {
      setLoading(true);

      const cleanedImages =
        values.images?.filter(
          (img) => img.imageId && img.imageId.trim() !== ""
        ) || [];

      const cleanedValues = {
        ...values,
        images: cleanedImages,
      };

      if (initialData) {
        await updateMutation.mutateAsync({
          productId: params.productId as string,
          ...cleanedValues,
        });
      } else {
        await createMutation.mutateAsync(cleanedValues);
      }

      router.push("/admin/dashboard/products");
      router.refresh();
    } catch (error) {
      console.error("Failed to save product:", error);
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

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

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
            variant="elevated"
            onClick={() => router.push("/admin/dashboard/products")}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          {initialData && (
            <Button
              variant="elevated"
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
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <CardTitle>Basic Information</CardTitle>
              </div>
              <CardDescription>
                Essential product details and identification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Product Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Premium Cotton T-Shirt"
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
                          placeholder="premium-cotton-t-shirt"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder="PROD-001"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief, catchy description of your product"
                          disabled={loading}
                          rows={2}
                          className="resize-none"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Description{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed product description with features, materials, care instructions, etc."
                          disabled={loading}
                          rows={8}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle>Pricing</CardTitle>
              </div>
              <CardDescription>
                Set product pricing and cost information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Selling Price{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          disabled={loading}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="compareAtPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compare at Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          disabled={loading}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          disabled={loading}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="refundPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refund Policy</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select policy" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="no-refunds">No Refunds</SelectItem>
                          <SelectItem value="1-day">1 Day</SelectItem>
                          <SelectItem value="3-day">3 Days</SelectItem>
                          <SelectItem value="7-day">7 Days</SelectItem>
                          <SelectItem value="14-day">14 Days</SelectItem>
                          <SelectItem value="30-day">30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <CardTitle>Inventory Management</CardTitle>
              </div>
              <CardDescription>
                Track and manage product stock levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          disabled={loading}
                          {...field}
                          value={field.value ?? 0}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lowStockThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Low Stock Alert</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5"
                          disabled={loading}
                          {...field}
                          value={field.value ?? 5}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 5)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="trackQuantity"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4 hover:border-primary/50 transition-colors">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">
                          Track Quantity
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
                <FormField
                  control={form.control}
                  name="allowBackorders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4 hover:border-primary/50 transition-colors">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">
                          Allow Backorders
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
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <CardTitle>Shipping Information</CardTitle>
              </div>
              <CardDescription>
                Configure shipping options and costs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          disabled={loading}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Cost</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          disabled={loading}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requiresShipping"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4 hover:border-primary/50 transition-colors">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">
                          Requires Shipping
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
                <FormField
                  control={form.control}
                  name="freeShipping"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4 hover:border-primary/50 transition-colors">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">
                          Free Shipping
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
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                <CardTitle>Organization & Display</CardTitle>
              </div>
              <CardDescription>
                Categorize and configure product visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
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
                              <Badge variant="default">Active</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="archived">
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive">Archived</Badge>
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
                  name="badge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Badge</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value ?? undefined}
                        defaultValue={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select badge" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="sale">Sale</SelectItem>
                          <SelectItem value="bestseller">Bestseller</SelectItem>
                          <SelectItem value="limited">
                            Limited Edition
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4 hover:border-primary/50 transition-colors">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">
                          Featured
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
                <FormField
                  control={form.control}
                  name="taxable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4 hover:border-primary/50 transition-colors">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">
                          Taxable
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
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <CardTitle>Search Engine Optimization</CardTitle>
              </div>
              <CardDescription>
                Optimize your product for search engines and social sharing
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
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Product Images</CardTitle>
              </div>
              <CardDescription>
                Upload product images (first image will be the primary)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-4">
                        {field.value?.map((img, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary/50 transition-colors"
                          >
                            <ImageUpload
                              value={img.imageId}
                              disabled={loading}
                              onChange={(imageId) => {
                                const updated = [...(field.value || [])];
                                updated[index] = {
                                  imageId,
                                  isPrimary: index === 0,
                                  sortOrder: index,
                                };
                                field.onChange(updated);
                              }}
                              onRemove={() => {
                                const filtered =
                                  field.value?.filter((_, i) => i !== index) ||
                                  [];
                                const reordered = filtered.map((img, i) => ({
                                  ...img,
                                  isPrimary: i === 0,
                                  sortOrder: i,
                                }));
                                field.onChange(reordered);
                              }}
                            />
                            <div className="flex-1">
                              {index === 0 && (
                                <Badge variant="default" className="bg-primary">
                                  Primary Image
                                </Badge>
                              )}
                              {index > 0 && (
                                <span className="text-sm text-muted-foreground">
                                  Gallery Image {index}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const current = field.value || [];
                            field.onChange([
                              ...current,
                              {
                                imageId: "",
                                isPrimary: current.length === 0,
                                sortOrder: current.length,
                              },
                            ]);
                          }}
                          disabled={loading}
                          className="w-full border border-dashed hover:border-primary transition-colors"
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Add Image
                        </Button>
                      </div>
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
                    ? "Save your changes to update this product"
                    : "Create your product and add it to your catalog"}
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/dashboard/products")}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    disabled={loading}
                    type="submit"
                    className="min-w-[140px] shadow-lg hover:shadow-xl transition-all"
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
