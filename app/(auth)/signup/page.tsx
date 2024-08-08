import Signup from "@/components/toffee/auth/Signup";
import { auth } from "@/auth";
export default async function SignIn() {
  const session = await auth();
  const isAuth = session?.user?.id? true: false;
  return <Signup isAuth = {isAuth} />
}