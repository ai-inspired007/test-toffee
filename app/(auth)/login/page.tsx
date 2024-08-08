import Login from "@/components/toffee/auth/Login";
import { auth } from "@/auth";
export default async function SignIn() {
  const session = await auth();
  const isAuth = session?.user?.id? true: false;
  return <Login isAuth = {isAuth} />
}