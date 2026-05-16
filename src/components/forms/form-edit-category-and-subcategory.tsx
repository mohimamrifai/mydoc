"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { X, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { updateCategory } from "@/lib/actions/update-category";

interface FormEditCategoryAndSubCategoryProps {
  categoryId: string;
  categoryName: string;
  subCategories: {
    id: string;
    name: string;
  }[];
}

export const FormEditCategoryAndSubCategory = ({ categoryId, categoryName, subCategories }: FormEditCategoryAndSubCategoryProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(categoryName);
  const [subs, setSubs] = useState(subCategories.map(sub => sub.name));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubCategory = () => {
    setSubs([...subs, ""]);
  };

  const handleRemoveSubCategory = (index: number) => {
    const newSubs = subs.filter((_, i) => i !== index);
    setSubs(newSubs);
  };

  const handleSubCategoryChange = (index: number, value: string) => {
    const newSubs = [...subs];
    newSubs[index] = value;
    setSubs(newSubs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!name) {
        throw new Error("Category name is required");
      }

      if (subs.some(cat => !cat)) {
        throw new Error("All sub category names are required");
      }

      const result = await updateCategory({ categoryId, categoryName: name, subCategories: subs });
      
      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Category Name</label>
            <Input 
              placeholder="Enter category name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
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

            {subs.map((subCategory, index) => (
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
                  Updating...
                </>
              ) : (
                "Update Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
