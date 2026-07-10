import { useState } from "react";
import { useAuth } from "@/components/authcontext";
import { UserCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
// Import postRequest or putRequest for API calls

export default function Profile() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 15));
    }, 150);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      // await postRequest("/profile/avatar", formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Normally you'd trigger a context refresh here to get the new avatar url
      setTimeout(() => setIsUploading(false), 500);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 mt-10">
      <div className="bg-card border border-border/50 rounded-[2rem] p-8 shadow-sm backdrop-blur-xl relative overflow-hidden">
        
        <h2 className="text-2xl font-bold mb-8 text-foreground">Account Settings</h2>
        
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8 mb-8">
          
          {/* Avatar Upload Hub */}
          <div className="relative group size-32 rounded-full overflow-hidden border-4 border-background shadow-lg ring-1 ring-border">
            {user?.avatar ? (
               <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold">
                 {user?.username.charAt(0).toUpperCase()}
               </div>
            )}
            
            {/* Hover Camera Overlay */}
            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center text-white backdrop-blur-sm z-10">
              <Camera className="size-6 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploading} />
            </label>

            {isUploading && (
               <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-20">
                 <Progress value={uploadProgress} className="h-1 w-1/2" />
               </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <h3 className="text-3xl font-extrabold text-foreground">{user?.username}</h3>
            <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">Premium Chef Status</p>
          </div>
        </div>

        <hr className="border-border/50 my-6" />
        
        <div className="flex justify-end">
           <Button variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white">Delete Account</Button>
        </div>
      </div>
    </div>
  );
}