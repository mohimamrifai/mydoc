"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updateGeneralSetting } from "@/lib/actions/update-general-setting";
import { GeneralSetting } from "@prisma/client";
import Image from "next/image";
import { updateSocialMedia } from "@/lib/actions/update-social-media";

const generalSettingSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"), 
  email: z.string().email("Invalid email address"),
  logoUrl: z.string().optional()
});

interface SettingPageComponentProps {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  socialMediaData: Array<{
    name: "facebook" | "twitter" | "instagram" | "youtube" | "linkedin";
    url: string;
  }>;
}

export default function SettingPageComponent({ 
  companyName, 
  address, 
  phone, 
  email, 
  logoUrl,
  socialMediaData 
}: SettingPageComponentProps) {
  const [logo, setLogo] = useState<File | null>(null);
  const [loadingSocialMedia, setLoadingSocialMedia] = useState<boolean>(false);
  const [socialMedia, setSocialMedia] = useState<Array<{name: "facebook" | "twitter" | "instagram" | "youtube" | "linkedin", url: string}>>(
    socialMediaData || [
      { name: "facebook", url: "" },
      { name: "twitter", url: "" },
      { name: "instagram", url: "" },
      { name: "youtube", url: "" },
      { name: "linkedin", url: "" }
    ]
  );

  const generalForm = useForm<z.infer<typeof generalSettingSchema>>({
    resolver: zodResolver(generalSettingSchema),
    defaultValues: {
      companyName: companyName,
      address: address,
      phone: phone,
      email: email,
      logoUrl: logoUrl
    }
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSocialMediaChange = (index: number, value: string) => {
    const newSocialMedia = [...socialMedia];
    newSocialMedia[index].url = value;
    setSocialMedia(newSocialMedia);
  };

  const isSubmitting = generalForm.formState.isSubmitting;

  const onGeneralSubmit = async (data: z.infer<typeof generalSettingSchema>) => {
    try {
      const formData = new FormData();
      formData.append("companyName", data.companyName);
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      
      if (logo) {
        formData.append("logo", logo);
      }

      // Add API call here
      const result = await updateGeneralSetting(formData);
      if (result.status === "success") {
        toast.success("General settings saved");
      } else {
        toast.error("Failed to save general settings");
      }
    } catch (error) {
      toast.error("Failed to save general settings");
    }
  };

  const onSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSocialMedia(true);
    try {
      // Filter out empty URLs before sending
      const socialMediaData = socialMedia.filter(item => item.url !== "");
      
      // Add API call here
      const result = await updateSocialMedia(socialMediaData);
      if (result.status === "success") {
        toast.success("Social media settings saved");
      } else {
        toast.error("Failed to save social media settings");
      }
    } catch (error) {
      toast.error("Failed to save social media settings");
    } finally {
      setLoadingSocialMedia(false);
    }
  };

  return (
    <div className="container mx-auto px-3 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
        <h1 className="text-xl md:text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="rounded-lg border bg-card text-card-foreground shadow h-full">
            <div className="flex flex-col space-y-1.5 p-3">
              <h3 className="text-lg md:text-xl font-semibold leading-none tracking-tight">General Settings</h3>
              <p className="text-sm text-muted-foreground">
                Manage your basic company information
              </p>
            </div>
            
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="p-3 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <FormField
                    control={generalForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm md:text-base">Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm md:text-base">Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm md:text-base">Phone</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm md:text-base">Address</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save General Settings"}</Button>
              </form>
            </Form>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow h-full">
            <div className="flex flex-col space-y-1.5 p-3">
              <h3 className="text-lg md:text-xl font-semibold leading-none tracking-tight">Company Logo</h3>
              <p className="text-sm text-muted-foreground">
                Upload your company logo
              </p>
            </div>
            <div className="p-3 pt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-sm md:text-base">Logo</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <Label htmlFor="logo" className="cursor-pointer">
                    <div className="space-y-3">
                      <div className="mx-auto w-16 h-16 md:w-40 md:h-20 bg-muted flex items-center justify-center">
                        {logo ? (
                          <Image
                            src={URL.createObjectURL(logo)}
                            alt="Selected Logo"
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                          />
                        ) : logoUrl ? (
                          <Image 
                            src={`/api/logos/${logoUrl}`}
                            alt="Company Logo"
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <Image 
                            src="/logo.png"
                            alt="Default Logo"
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                          />
                        )}
                      </div>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {logo ? logo.name : "Click to upload logo"}
                      </p>
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-12">
          <div className="rounded-lg border bg-card text-card-foreground shadow p-3">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Social Media Settings</h3>
            
            <form onSubmit={onSocialSubmit} className="space-y-4">
              {socialMedia.map((social, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <div className="w-full sm:w-32">
                    <Label className="text-sm font-medium">{social.name}</Label>
                  </div>
                  <Input 
                    value={social.url}
                    onChange={(e) => handleSocialMediaChange(index, e.target.value)}
                    placeholder={`https://${social.name.toLowerCase()}.com/...`}
                    className="w-full"
                  />
                </div>
              ))}
              
              <Button type="submit" className="w-full mt-6" disabled={loadingSocialMedia}>{loadingSocialMedia ? "Saving..." : "Save Changes"}</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
