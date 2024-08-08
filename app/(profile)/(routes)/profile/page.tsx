import { auth } from "auth";
import { redirect } from "next/navigation";

export default async function UserProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect(`/login`);
  }

  redirect(`/profile/${session?.user.id}`);
}