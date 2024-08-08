import { signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Button {...props} onClick={() => signIn()}>
      Sign In
    </Button>
  );
}

export function SignOut({
  callbackUrl,
  ...props
}: { callbackUrl?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Button
      variant="ghost"
      className="w-full p-0"
      {...props}
      onClick={() => signOut({ callbackUrl })}
    >
      <LogOut className="mr-4" />
      <span>Sign Out</span>
    </Button>
  );
}
