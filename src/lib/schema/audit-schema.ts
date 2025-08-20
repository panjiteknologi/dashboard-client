import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

export const auditNotification = pgTable("audit_notification", {
  id: serial("id").primaryKey(),
  name: varchar("name"), // Document No
  isoReference: integer("iso_reference"), // Reference
  salesOrderId: integer("sales_order_id"), // Sales Order
  tipePembayaran: varchar("tipe_pembayaran"), // Tipe Pembayaran
  createUid: integer("create_uid"), // Created by
  createDate: timestamp("create_date"), // Created on
  writeUid: integer("write_uid"), // Last Updated by
  writeDate: timestamp("write_date"), // Last Updated on
  auditState: varchar("audit_state"), // Audit Status
  messageMainAttachmentId: integer("message_main_attachment_id"), // Main Attachment
  accessToken: varchar("access_token"), // Security Token
  customer: integer("customer"), // Customer
  auditRequestId: integer("audit_request_id"), // Audit Request
  globalStatus: varchar("global_status"), // Status Project
  tglPerkiraanSelesai: date("tgl_perkiraan_selesai"), // Plan of audit date
});
