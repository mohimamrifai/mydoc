"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCategory } from "@/lib/actions/create-category";

export const FormCreateCategoryAndSubCategory = () => {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [subCategories, setSubCategories] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubCategory = () => {
    setSubCategories([...subCategories, ""]);
  };

  const handleRemoveSubCategory = (index: number) => {
    const newSubCategories = subCategories.filter((_, i) => i !== index);
    setSubCategories(newSubCategories);
  };

  const handleSubCategoryChange = (index: number, value: string) => {
    const newSubCategories = [...subCategories];
    newSubCategories[index] = value;
    setSubCategories(newSubCategories);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!categoryName) {
        throw new Error("Category name is required");
      }

      if (subCategories.some(cat => !cat)) {
        throw new Error("All sub category names are required");
      }

      const result = await createCategory({ categoryName, subCategories });
      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
        setCategoryName("");
        setSubCategories([""]);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Category Name</label>
            <Input 
              placeholder="Enter category name" 
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Sub Categories</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSubCategory}
              >
                Add Sub Category
              </Button>
            </div>

            {subCategories.map((subCategory, index) => (
              <div key={index} className="flex gap-2">
                <Input 
                  placeholder="Enter sub category name"
                  value={subCategory}
                  onChange={(e) => handleSubCategoryChange(index, e.target.value)}
                  className="flex-1"
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSubCategory(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
