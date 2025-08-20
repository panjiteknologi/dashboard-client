import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            "https://erp.tsicertification.com/client/authenticate",
            {
              params: {
                username: credentials?.email,
                password: credentials?.password,
              },
            }
          );

          if (
            response.data &&
            response.data.result &&
            response.data.result !== "error"
          ) {
            return {
              id: String(response.data.result.user_id),
              uid: response.data.result.uid,
              username: response.data.result.user_name,
              partner_name: response.data.result.partner_name,
              access_token: response.data.result.access_token,
            };
          }

          return null;
        } catch (e: any) {
          const errorMessage =
            e?.response?.data?.message || "Authentication failed";
          throw new Error(errorMessage);
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
