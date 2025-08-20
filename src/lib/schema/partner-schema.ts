import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  date,
  timestamp,
  boolean,
  doublePrecision,
  numeric,
} from "drizzle-orm/pg-core";

export const partners = pgTable("res_partner", {
  // Primary key
  id: serial("id").primaryKey(),

  // Basic information
  name: varchar("name"),
  companyId: integer("company_id"),
  createDate: timestamp("create_date"),
  displayName: varchar("display_name"),
  date: date("date"),
  title: integer("title"),
  parentId: integer("parent_id"), // Related Company
  ref: varchar("ref"), // Reference
  lang: varchar("lang"), // Language
  tz: varchar("tz"), // Timezone
  userId: integer("user_id"), // Salesperson
  vat: varchar("vat"), // Tax ID
  website: varchar("website"), // Website Link
  comment: text("comment"), // Notes
  creditLimit: doublePrecision("credit_limit"),
  active: boolean("active"),
  employee: boolean("employee"),
  function: varchar("function"), // Job Position

  // Address information
  type: varchar("type"), // Address Type
  street: varchar("street"),
  street2: varchar("street2"),
  zip: varchar("zip"),
  city: varchar("city"),
  stateId: integer("state_id"),
  countryId: integer("country_id"),
  partnerLatitude: numeric("partner_latitude"), // Geo Latitude
  partnerLongitude: numeric("partner_longitude"), // Geo Longitude

  // Contact information
  email: varchar("email"),
  phone: varchar("phone"),
  mobile: varchar("mobile"),

  // Company and business information
  isCompany: boolean("is_company"),
  industryId: integer("industry_id"),
  color: integer("color"), // Color Index
  partnerShare: boolean("partner_share"),
  commercialPartnerId: integer("commercial_partner_id"), // Commercial Entity
  commercialCompanyName: varchar("commercial_company_name"), // Company Name Entity
  companyName: varchar("company_name"),

  // System fields
  createUid: integer("create_uid"), // Created by
  writeUid: integer("write_uid"), // Last Updated by
  writeDate: timestamp("write_date"), // Last Updated on
  messageMainAttachmentId: integer("message_main_attachment_id"), // Main Attachment

  // Email and signup related
  emailNormalized: varchar("email_normalized"),
  messageBounce: integer("message_bounce"),
  signupToken: varchar("signup_token"),
  signupType: varchar("signup_type"),
  signupExpiration: timestamp("signup_expiration"),

  // Sales and team information
  teamId: integer("team_id"), // Sales Team
  partnerGid: integer("partner_gid"), // Company database ID
  additionalInfo: varchar("additional_info"),
  phoneSanitized: varchar("phone_sanitized"),

  // Calendar and notifications
  calendarLastNotifAck: timestamp("calendar_last_notif_ack"), // Last notification marked as read from base Calendar

  // Stock and picking warnings
  pickingWarn: varchar("picking_warn"),
  pickingWarnMsg: text("picking_warn_msg"),

  // Website related
  websiteId: integer("website_id"),
  isPublished: boolean("is_published"),

  // Financial information
  debitLimit: numeric("debit_limit"), // Payable Limit
  lastTimeEntriesChecked: timestamp("last_time_entries_checked"), // Latest Invoices & Payments Matching Date

  // Invoice warnings
  invoiceWarn: varchar("invoice_warn"),
  invoiceWarnMsg: text("invoice_warn_msg"),

  // Customer and supplier ranking
  supplierRank: integer("supplier_rank"),
  customerRank: integer("customer_rank"),

  // Indonesian localization fields
  l10nIdPkp: boolean("l10n_id_pkp"), // ID PKP
  l10nIdNik: varchar("l10n_id_nik"), // NIK
  l10nIdTaxAddress: varchar("l10n_id_tax_address"), // Tax Address
  l10nIdTaxName: varchar("l10n_id_tax_name"), // Tax Name
  l10nIdKodeTransaksi: varchar("l10n_id_kode_transaksi"), // Kode Transaksi

  // Sales warnings
  saleWarn: varchar("sale_warn"),
  saleWarnMsg: text("sale_warn_msg"),

  // Associate and franchise information
  isAssociate: boolean("is_associate"),
  code: varchar("code"),
  scope: varchar("scope"),
  boundaries: varchar("boundaries"),
  numberSite: varchar("number_site"), // Number of Site
  totalEmpMoved0: varchar("total_emp_moved0"), // Total Employee

  // Certificate and date information
  tglSertifikat: date("tgl_sertifikat"), // Tanggal Sertifikat
  tahunMasuk: varchar("tahun_masuk"), // Tahun Masuk

  // Additional address fields
  invoiceAddress: varchar("invoice_address"),
  officeAddress: varchar("office_address"),
  kategori: varchar("kategori"),

  // Payment and follow-up information
  paymentResponsibleId: integer("payment_responsible_id"), // Follow-up Responsible
  paymentNote: text("payment_note"), // Customer Payment Promise
  paymentNextAction: text("payment_next_action"), // Next Action
  paymentNextActionDate: date("payment_next_action_date"), // Next Action Date
  latestFollowupSequence: integer("latest_followup_sequence"), // Sequence
  latestFollowupLevelIdWithoutLit: integer(
    "latest_followup_level_id_without_lit"
  ), // Latest Follow-up Level without litigation
  amountCreditLimit: numeric("amount_credit_limit"), // Internal Credit Limit

  // Purchase warnings
  purchaseWarn: varchar("purchase_warn"),
  purchaseWarnMsg: text("purchase_warn_msg"),

  // Contact and customer information
  contactPerson: varchar("contact_person"),
  nomorCustomer: varchar("nomor_customer"), // Customer ID
  state: varchar("state"),

  // Franchise related fields
  isFranchise: boolean("is_franchise"),
  showInternalNotes: boolean("show_internal_notes"),
  contactClient: boolean("contact_client"), // Franchise
  hideContactFranchisess: boolean("hide_contact_franchisess"),
  hideContactFr: boolean("hide_contact_fr"),
  showInternalNotess: boolean("show_internal_notess"),

  // Additional contact and employee information
  picId: integer("pic_id"), // Contact Person Tes
  totalEmp: integer("total_emp"), // Total Employee
  state2: varchar("state_2"), // Status Certificate Klien
  statusKlien: varchar("status_klien"), // State

  // Communication preferences
  isWhatsappNumber: boolean("is_whatsapp_number"),
  sendTemplateReq: boolean("send_template_req"), // Send Template Require

  // Authentication information
  username: varchar("username"),
  password: varchar("password"),
  accessToken: varchar("access_token"), // Akses Token
});

export type Partner = typeof partners.$inferSelect;
export type NewPartner = typeof partners.$inferInsert;
