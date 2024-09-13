import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { createStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";
import vercelKVDriver from "unstorage/drivers/vercel-kv";
import { UnstorageAdapter } from "@auth/unstorage-adapter";
import { getServerSession, type AuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { Redis } from "@upstash/redis";
import { Adapter } from 'next-auth/adapters';
import prismadb from "./lib/prismadb";
import axios from "axios";
import bcrypt from "bcrypt";
const getUserByEmail = async (email: string) => {
  const user = await prismadb.userSettings.findFirst({
    where: {
      email: email,
      password: {
        not: null,
      },
    }
  })
  return user
}
const storage = createStorage({
  driver: process.env.VERCEL
    ? vercelKVDriver({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
        env: false,
      })
    : memoryDriver(),
});
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})
export const authOptions: AuthOptions = {
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  // adapter: UnstorageAdapter(storage) as Adapter,
  // adapter: UpstashRedisAdapter(redis) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const user = await getUserByEmail(email);

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          throw new Error("Incorrect password");
        }

        const nextAuthUser = {
          id: user.userId,
          email: user.email,
          name: user.name,
          image: user.profile_image,
        };

        return nextAuthUser;
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const _user = await prismadb.userSettings.findUnique({
        where: {
          userId: user.id
        }
      })
      if (_user?.userId === user.id) {
        return true
      } else if(account?.provider === "google"){        
        await prismadb.userSettings.create({
          data: {
            userId: user.id,
            name: user.name,
            email: user.email,
            profile_image: user.image
          }
        })
        await prismadb.chatSetting.create({
          data: {
            userId: user.id,
            voiceId: "",
            themeId: "",
            prompt: "",
            chat_model: "gpt-4o"
          }
        });
        return true
      } else {
        return "/signup"
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async jwt({ token, trigger, session, account, user }) {
      if (trigger === "update") token.name = session.user.name;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub
      // console.log("[TOKEN]:" ,token)
      // console.log("[SESSION]:" ,session)
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
};
export const { handlers, signIn, signOut } = NextAuth(authOptions);
export const auth = () => getServerSession(authOptions);