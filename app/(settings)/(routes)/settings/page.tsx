// TODO: extract to settings dashboard
"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@radix-ui/react-checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn } from "auth";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { UploadIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { rateLimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";
import { uploadToStorage } from "@/lib/gcs";
import path from "path";
import { getBase64 } from "@/lib/upload/util";
import { addBackgroundImage, deleteBackgroundImage } from "./server-actions";
import { useToast } from "@/components/ui/use-toast";

export default async function SettingsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  let user = session?.user;

  if (!user) {
    router.push("/sign-in");
  }

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <h1 className="text-lg">User ID: {user?.id}</h1>
      {user && (
        <div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              const formData = new FormData();
              const file: File = (e.target as HTMLFormElement)
                .background_image_url.files[0];
              // only accept <= 1MB files
              if (file.size > 5 * 1024 * 1024) {
                toast({
                  title: "File size must be less than or equal to 1MB.",
                  variant: "destructive",
                });
                setIsSubmitting(false);
                return;
              }
              //   console.log("file", file);
              formData.append("background_image_url", file);
              formData.append(
                "base64",
                ((await getBase64(file)) as string).split(",")[1],
              );
              const result = await addBackgroundImage(formData);
              if (result.status === "success") {
                toast({
                  title: "Background image uploaded successfully.",
                  variant: "default",
                });
              } else if (result.status === "failed") {
                toast({
                  title:
                    "Background image upload failed. Image may be corrupt, please try another!",
                  variant: "destructive",
                });
              }
              setIsSubmitting(false);
            }}
          >
            <Label htmlFor="background_image_url">
              Custom Chat Background Image
            </Label>
            <Input
              required
              disabled={isSubmitting}
              name="background_image_url"
              id="background_image_url"
              placeholder="Upload custom chat background image..."
              type="file"
              accept="image/*"
              className="w-fit gap-x-2 bg-muted text-muted-foreground hover:bg-opacity-10"
            />
            <Button
              disabled={isSubmitting}
              type="submit"
              className="my-2 flex items-center gap-2"
              variant="default"
            >
              Upload
            </Button>
            <Button
              type="reset"
              variant={"destructive"}
              onClick={async (e) => {
                e.preventDefault();
                if (
                  !confirm(
                    "Are you sure you want to delete current background image? This action is irreversible!",
                  )
                ) {
                  return;
                }
                setIsSubmitting(true);
                const result = await deleteBackgroundImage();
                if (result.status === "success") {
                  toast({
                    title: "Background image deleted successfully.",
                    variant: "default",
                  });
                } else if (result.status === "failed") {
                  toast({
                    title: "Background image delete failed.",
                    variant: "destructive",
                  });
                }
                setIsSubmitting(false);
              }}
              disabled={isSubmitting}
            >
              Delete Background Image
            </Button>
          </form>
        </div>
      )}
    </main>
  );
}
