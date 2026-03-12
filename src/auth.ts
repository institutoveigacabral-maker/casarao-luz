import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { db } from "@/db/index"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

async function getOrCreateGoogleUser(profile: {
  email: string
  name: string
  picture?: string
}) {
  let user = await db.query.users.findFirst({
    where: eq(users.email, profile.email),
  })

  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values({
        email: profile.email,
        name: profile.name,
        passwordHash: "__google_oauth__",
        avatarUrl: profile.picture ?? null,
        role: "user",
      })
      .returning()

    user = newUser
  }

  return user
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        await getOrCreateGoogleUser({
          email: profile.email,
          name: profile.name ?? user.name ?? "Usuario",
          picture: (profile as { picture?: string }).picture,
        })
      }
      return true
    },
    async jwt({ token, user, account, profile }) {
      if (user && account?.provider === "credentials") {
        token.id = user.id
        token.role = user.role
      }

      if (account?.provider === "google" && profile?.email) {
        const dbUser = await getOrCreateGoogleUser({
          email: profile.email,
          name: profile.name ?? "Usuario",
          picture: (profile as { picture?: string }).picture,
        })
        token.id = dbUser.id
        token.role = dbUser.role
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        })

        if (!user) return null
        if (user.passwordHash === "__google_oauth__") return null

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
})
