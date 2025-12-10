import NextAuth from "next-auth";
import authConfig from "../../auth.config";
import "next-auth/jwt";

type TSIUser = {
  id: string;
  uid: number;
  username: string;
  partner_name: string;
  access_token: string;
};

// Extend the session type
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      image?: string | null;
      uid?: number;
      username?: string;
      partner_name?: string;
      access_token?: string;
    };
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    uid?: number;
    username?: string;
    partner_name?: string;
    access_token?: string;
  }
}

export const { handlers, signIn, auth } = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const publicPaths = [
        "/login",
        "/admin/login",
        "/signup",
        "/",
        "/public-scope",
      ]; // add other public routes as needed
      const isPublicPath = publicPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
      );

      if (isPublicPath) {
        return true;
      }

      if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/api/scope-determination") ||
        pathname === "/favicon.ico" ||
        /\.[^/]+$/.test(pathname)
      ) {
        return true;
      }

      return isLoggedIn;
    },

    async jwt({ token, user }) {
      if (user) {
        const tsiUser = user as unknown as TSIUser;
        return {
          ...token,
          uid: tsiUser.uid,
          username: tsiUser.username,
          partner_name: tsiUser.partner_name,
          access_token: tsiUser.access_token,
        };
      }

      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          uid: token.uid,
          username: token.username,
          partner_name: token.partner_name,
          access_token: token.access_token,
        },
      };
    },
  },
});
