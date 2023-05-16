import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "../../../../prisma/db";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET 
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const { email, password } = credentials;

          // check if user exists
          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            return null;
          }

          // compare password

          const isPassMatch = await bcrypt.compare(password, user.hash);
          if (!isPassMatch) {
            return null;
          }

          // If no error and we have user data, return it
          return {
            name: user.fullName,
            email: user.email,
            admin: user.admin,
            pic: user.pic,
            id: user.id,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {

      if (user) {
        token.id = user.id;
        token.admin = user.admin;
        token.pic = user.pic;
      }
      if (trigger === "update" && session?.pic) {
        token.pic = session?.pic
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.user.admin = token.admin;
        session.user.pic = token.pic;


      }
      return session;
    },
  },
  secret: "test",
  jwt: {
    secret: "test",
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
  },
};

export default NextAuth(authOptions);
