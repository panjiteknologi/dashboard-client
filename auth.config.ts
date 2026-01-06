/* eslint-disable @typescript-eslint/no-explicit-any */
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
        pathname: { label: "Pathname", type: "text" },
      },
      async authorize(credentials) {
        try {
          const pathname = (credentials?.pathname as string) || "";
          const isAdmin = pathname.startsWith("/admin");

          const endpoint = isAdmin
            ? "https://erp.tsicertification.com/session/authenticate"
            : "https://erp.tsicertification.com/client/authenticate";

          const params = isAdmin
            ? {
                db: "Odoo_Tsi_Production",
                login: credentials?.email,
                password: credentials?.password,
              }
            : {
                username: credentials?.email,
                password: credentials?.password,
              };

          const response = await axios.post(
            endpoint,
            {
              params,
            },
            {
              headers: {
                "x-vercel-protection": "secret-kode-tsi-2026",
              },
            }
          );

          if (!response.data || !response.data.result) {
            return null;
          }

          const result = response.data.result;

          // Handle different response structures for admin vs client
          if (isAdmin) {
            // Admin response structure
            if (result.result === "success") {
              return {
                id: String(result.user_id),
                uid: result.user_id,
                username: result.user_name,
                partner_name: result.user_name, // Using user_name as fallback for partner_name
                access_token: result.access_token,
              };
            }
          } else {
            // Client response structure
            if (
              result.status === "success" &&
              result.data &&
              result.data !== "error"
            ) {
              return {
                id: String(result.data.user_id),
                uid: result.data.user_id,
                username: result.data.username,
                partner_name: result.data.name,
                access_token: result.data.access_token,
              };
            }
          }

          return null;
        } catch (e: any) {
          console.log("error auth : ", {
            message: e?.message,
            code: e?.code,
            response: e?.response?.data,
          });

          const errorMessage =
            e?.response?.data?.message || "Authentication failed";
          throw new Error(errorMessage);
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
