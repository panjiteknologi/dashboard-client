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
              id: String(response.data.result.data.user_id),
              uid: response.data.result.data.user_id,
              username: response.data.result.data.username,
              partner_name: response.data.result.data.name,
              access_token: response.data.result.data.access_token,
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
