import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImagePlus, ChefHat, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Field, FieldLabel, FieldDescription, FieldGroup, FieldSet } from "@/components/ui/field";
// Assuming you have postRequest configured for FormData in your api.js
import { postRequest } from "@/lib/api"; 
import { ROUTES } from "@/lib/routes";

// Strict input validation
const recipeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(15, "Give a brief description of the flavor profile"),
  time: z.string().min(1, "Prep time is required (e.g., 45m)"),
  category: z.string().min(1, "Category is required"),
});

export default function CreateRecipe() {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(recipeSchema),
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!imageFile) return alert("Please upload a heroic image of your dish.");
    
    setIsUploading(true);
    
    // Simulate upload progress for the Shadcn bar
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 15));
    }, 200);

    try {
      // 1. Build FormData (Required for Multer)
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("time", data.time);
      formData.append("category", data.category);
      formData.append("image", imageFile);

      // 2. Post to your backend (Ensure your postRequest in api.js omits the 'Content-Type' header if body is FormData)
      await postRequest("/recipes", formData);
      
      // Snap to 100% on success
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        navigate(ROUTES.FEED);
      }, 800);

    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setIsUploading(false);
      console.error("Failed to upload recipe", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <ChefHat className="text-primary size-10" /> Design a Recipe
          </h1>
          <p className="text-muted-foreground text-lg">Share your culinary masterpiece with the world.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* Left Side: Image Upload Glass Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[4/5] w-full rounded-3xl border-2 border-dashed border-border overflow-hidden group bg-muted/20 hover:bg-muted/30 transition-colors flex items-center justify-center cursor-pointer">
              
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-4 text-muted-foreground p-6 text-center">
                  <div className="size-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                    <ImagePlus className="size-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Click to upload</p>
                    <p className="text-xs mt-1">High-res JPEG or PNG</p>
                  </div>
                </div>
              )}

              {/* Progress Overlay */}
              {isUploading && (
                <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 gap-4 animate-in fade-in">
                  <Sparkles className="size-8 text-primary animate-pulse" />
                  <p className="font-bold tracking-widest uppercase text-xs">Simmering...</p>
                  <Progress value={uploadProgress} className="h-2 w-full" />
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Inputs */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border/50 rounded-[2rem] p-8 shadow-sm backdrop-blur-xl">
              <FieldSet>
                <FieldGroup className="space-y-6">
                  
                  <Field>
                    <FieldLabel>Recipe Title</FieldLabel>
                    <Input placeholder="e.g. Brown Butter Scallops" className="text-lg py-6" {...register("title")} disabled={isUploading} />
                    {errors.title && <FieldDescription className="text-red-500">{errors.title.message}</FieldDescription>}
                  </Field>

                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea 
                      placeholder="Describe the textures, the aroma, and what makes this special..." 
                      className="resize-none h-32 text-base" 
                      {...register("description")} 
                      disabled={isUploading}
                    />
                    {errors.description && <FieldDescription className="text-red-500">{errors.description.message}</FieldDescription>}
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Prep Time</FieldLabel>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input placeholder="45m" className="pl-9" {...register("time")} disabled={isUploading} />
                      </div>
                      {errors.time && <FieldDescription className="text-red-500">{errors.time.message}</FieldDescription>}
                    </Field>

                    <Field>
                      <FieldLabel>Category</FieldLabel>
                      <Input placeholder="Dinner, Dessert, Vegan..." {...register("category")} disabled={isUploading} />
                      {errors.category && <FieldDescription className="text-red-500">{errors.category.message}</FieldDescription>}
                    </Field>
                  </div>

                </FieldGroup>
              </FieldSet>

              <div className="mt-10">
                <Button type="submit" size="lg" className="w-full h-14 text-lg rounded-xl" disabled={isUploading}>
                  {isUploading ? "Publishing..." : "Publish Recipe"}
                </Button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}