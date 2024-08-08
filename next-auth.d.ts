import NextAuth, { DefaultSession, Account, Profile } from "next-auth";
import { JWT as BaseJWT } from "next-auth/jwt";

declare module "next-auth" {
  export interface ProfileObject extends Profile {
    id: number | string
  }
  export interface UserAccount extends Account {
    profile: ProfileObject;
    provider: string;
  }
  export interface UserObject {
    id: number | string | StringFilter<"Character">;
    name: string;
    email: string;
    image: string;
  }
  export interface Session extends DefaultSession {
    user: UserObject & DefaultSession["user"];
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  export interface JWT extends BaseJWT {
    accessToken?: string;
  }
}
