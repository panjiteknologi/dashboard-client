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
      async authorize(credentials, req) {
        try {
          const response = await axios.post(
            "https://erp.tsicertification.com",
            {
              params: {
                username: credentials?.email,
                password: credentials?.password,
              },
            }
          );

          console.log("RES AUth : ", response.data);

          if (response.data && response.data.result) {
            return response.data.result;
          }

          // Return null if user data could not be retrieved
          return null;
        } catch (e: any) {
          const errorMessage = e?.response.data.message;
          throw new Error(errorMessage);
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
