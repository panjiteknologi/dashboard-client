import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";

export const resUsers = pgTable("res_users", {
  id: serial("id").primaryKey(),
  active: boolean("active").notNull().default(true),
  login: varchar("login"),
  password: varchar("password"),
  companyId: integer("company_id"),
  partnerId: integer("partner_id"),
  createDate: timestamp("create_date"),
  signature: varchar("signature"), // Email Signature
  actionId: integer("action_id"), // Home Action
  share: boolean("share"),
  createUid: integer("create_uid"), // Created by
  writeUid: integer("write_uid"), // Last Updated by
  writeDate: timestamp("write_date"), // Last Updated on
  totpSecret: varchar("totp_secret"), // Totp Secret
  notificationType: varchar("notification_type"), // Notification
  odoobotState: varchar("odoobot_state"), // OdooBot Status
  odoobotFailed: boolean("odoobot_failed"), // OdooBot Failed
  saleTeamId: integer("sale_team_id"), // User Sales Team
  sidebarType: varchar("sidebar_type"), // Sidebar Type
  chatterPosition: varchar("chatter_position"), // Chatter Position
  websiteId: integer("website_id"), // Website
  karma: integer("karma"), // Karma
  rankId: integer("rank_id"), // Rank
  nextRankId: integer("next_rank_id"), // Next Rank
  providerId: integer("provider_id"), // Provider
  accessToken: varchar("access_token"), // Access Token
});

export const selectResUserSchema = createSelectSchema(resUsers);
export const insertResUserSchema = createInsertSchema(resUsers);
