import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./prisma-client";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", //already set by default
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@mail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please fill out required fields");
        }

        //check email
        const existingUser = await db.user.findUnique({
          where: { email: credentials?.email.toLowerCase() },
          include: {
            avatar: true,
            status: true,
          },
        });

        if (!existingUser) {
          throw new Error("Invalid credentials");
        }
        //check password
        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        //check if email is verified
        if (!existingUser.email_verified_at) {
          throw new Error("Email not verified");
        }

        const url = existingUser.avatar?.formatted_url;

        return {
          id: existingUser.id,
          email: existingUser.email,
          first_name: existingUser.first_name,
          last_name: existingUser.last_name,
          image: url,
          status: existingUser.status.title,
        };
      },
    }),
  ],
  callbacks: {
    //authorize function sends value into jwt
    async jwt({ token, session, trigger, user }) {
      //next-auth session is refering to client side session data
      //next-auth token is refering to server side session data

      if (trigger === "update" && session) {
        if (session.first_name) {
          token.first_name = session.first_name;
        }

        if (session.last_name) {
          token.last_name = session.last_name;
        }

        if (session.status) {
          token.status = session.status.title;
        }
        if (session.avatar) {
          token.picture = session.avatar.formatted_url;
        }
      }

      if (user) {
        return {
          ...token,
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          status: user.status,
        };
      }
      return token;
    },
    //jwt function sends value into session
    async session({ session, user, token }) {
      //console.log("session", token, user);

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          first_name: token.first_name,
          last_name: token.last_name,
          status: token.status,
        },
        token,
      };
    },
  },
  pages: {
    signIn: "/rooms",
    signOut: "/login",
  },
};
