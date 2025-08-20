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
} from "drizzle-orm/pg-core";

export const tsiIso = pgTable("tsi_iso", {
  // Primary key and main attachment
  id: serial("id").primaryKey(),
  messageMainAttachmentId: integer("message_main_attachment_id"),

  // Security and document info
  accessToken: varchar("access_token"),
  doctype: varchar("doctype"),
  name: varchar("name"), // Document No

  // Company information
  customer: integer("customer"),
  alamat: varchar("alamat"),
  issueDate: date("issue_date"),
  multisite: text("multisite"),
  contactName: integer("contact_name"),
  companyName: varchar("company_name"),
  officeAddress: varchar("office_address"),
  invoicingAddress: varchar("invoicing_address"),
  contactPerson: varchar("contact_person"),
  jabatan: varchar("jabatan"), // Position
  telepon: varchar("telepon"),
  fax: varchar("fax"),
  email: varchar("email"),
  website: varchar("website"),
  cellular: varchar("cellular"),

  // Certification details
  certification: varchar("certification"),
  isoStandardOther: varchar("iso_standard_other"),
  outsourcedActivity: text("outsourced_activity"),
  isAssociate: boolean("is_associate"),
  associateId: integer("associate_id"),
  isoHazardOther: varchar("iso_hazard_other"),
  isoAspectOther: varchar("iso_aspect_other"),

  // EA codes and accreditation for different standards
  eaCode: integer("ea_code"),
  accreditation: integer("accreditation"),
  complexity: varchar("complexity"),

  // ISO 14001
  eaCode14001: integer("ea_code_14001"),
  accreditation14001: integer("accreditation_14001"),
  complexity14001: varchar("complexity_14001"),

  // ISO 27001
  eaCode27001: integer("ea_code_27001"),
  accreditation27001: integer("accreditation_27001"),
  complexity27001: varchar("complexity_27001"),

  // ISO 45001
  eaCode45001: integer("ea_code_45001"),
  accreditation45001: integer("accreditation_45001"),
  complexity45001: varchar("complexity_45001"),

  // ISO 22000
  eaCode22000: integer("ea_code_22000"),
  accreditation22000: integer("accreditation_22000"),
  complexity22000: varchar("complexity_22000"),

  // HACCP
  eaCodeHaccp: integer("ea_code_haccp"),
  accreditationHaccp: integer("accreditation_haccp"),
  complexityHaccp: varchar("complexity_haccp"),

  // Scope and boundaries
  scope: text("scope"),
  boundaries: text("boundaries"),
  cause: text("cause"),
  ismsDoc: text("isms_doc"),

  // Office and employee information
  headOffice: varchar("head_office"),
  siteOffice: varchar("site_office"),
  offLocation: varchar("off_location"),
  partTime: varchar("part_time"),
  subcon: varchar("subcon"),
  unskilled: varchar("unskilled"),
  seasonal: varchar("seasonal"),
  totalEmp: varchar("total_emp"),
  shiftNumber: varchar("shift_number"),
  numberSite: varchar("number_site"),
  outsourceProc: text("outsource_proc"),
  lastAudit: text("last_audit"),
  lastReview: text("last_review"),
  txSiteCount: integer("tx_site_count"),
  txRemarks: varchar("tx_remarks"),

  // Implementation and maturity
  startImplement: varchar("start_implement"),
  matConsultancy: varchar("mat_consultancy"),
  matCertified: varchar("mat_certified"),
  txtMatConsultancy: varchar("txt_mat_consultancy"),
  txtMatCertified: varchar("txt_mat_certified"),

  // Internal processes
  intReview: varchar("int_review"),
  intInternal: varchar("int_internal"),
  intPolicy: varchar("int_policy"),
  intSystem: varchar("int_system"),
  intInstruction: varchar("int_instruction"),
  intImprovement: varchar("int_improvement"),
  intPlanning: varchar("int_planning"),

  // ISO 14001 specific
  iso14001Environmental: text("iso_14001_environmental"),
  iso14001Legal: text("iso_14001_legal"),

  // ISO 45001 specific
  iso45001Ohs: text("iso_45001_ohs"),
  iso45001Legal: text("iso_45001_legal"),

  // ISO 27001 specific details
  iso27001TotalEmp: varchar("iso_27001_total_emp"),
  iso27001Bisnistype: varchar("iso_27001_bisnistype"),
  iso27001Process: varchar("iso_27001_process"),
  iso27001MgmtSystem: varchar("iso_27001_mgmt_system"),
  iso27001NumberProcess: varchar("iso_27001_number_process"),
  iso27001Infra: varchar("iso_27001_infra"),
  iso27001Sourcing: varchar("iso_27001_sourcing"),
  iso27001Itdevelopment: varchar("iso_27001_itdevelopment"),
  iso27001Itsecurity: varchar("iso_27001_itsecurity"),
  iso27001Asset: varchar("iso_27001_asset"),
  iso27001Drc: varchar("iso_27001_drc"),

  // ISO 22000 specific
  iso22000HazardNo: varchar("iso_22000_hazard_no"),
  iso22000HazardDesc: text("iso_22000_hazard_desc"),
  iso22000ProcessNo: varchar("iso_22000_process_no"),
  iso22000ProcessDesc: text("iso_22000_process_desc"),
  iso22000TechNo: varchar("iso_22000_tech_no"),
  iso22000TechDesc: text("iso_22000_tech_desc"),

  // Site information
  siteName: varchar("site_name"),
  siteAddress: text("site_address"),
  siteEmpTotal: varchar("site_emp_total"),
  siteActivity: text("site_activity"),

  // Status and audit information
  state: varchar("state"),
  auditStage: varchar("audit_stage"),
  auditSimilarities: varchar("audit_similarities"),
  lingkup: varchar("lingkup"),
  kepemilikan: varchar("kepemilikan"),

  // Counters
  countReview: integer("count_review"),
  countQuotation: integer("count_quotation"),
  countSales: integer("count_sales"),
  countInvoice: integer("count_invoice"),

  // Land and location specific (Indonesia specific fields)
  permohonan: varchar("permohonan"),
  tipeTanah: varchar("tipe_tanah"),
  sebaranTanah: varchar("sebaran_tanah"),
  tipeKegiatan: varchar("tipe_kegiatan"),
  topografi: varchar("topografi"),
  isKebunPabrik: boolean("is_kebun_pabrik"),

  // Legal permits
  legalLokasi: varchar("legal_lokasi"),
  legalIup: varchar("legal_iup"),
  legalSpup: varchar("legal_spup"),
  legalItubp: varchar("legal_itubp"),
  legalPrinsip: varchar("legal_prinsip"),
  legalMenteri: varchar("legal_menteri"),
  legalBkpm: varchar("legal_bkpm"),

  // Land acquisition
  perolehanA: varchar("perolehan_a"), // APL
  perolehanB: varchar("perolehan_b"), // HPK
  perolehanC: varchar("perolehan_c"), // Tanah Adat
  perolehanD: varchar("perolehan_d"), // Tanah Lain
  legalHgu: varchar("legal_hgu"),
  legalAmdal: varchar("legal_amdal"),
  isPlasmaSwa: boolean("is_plasma_swadaya"),

  // Garden/plantation certificates
  kebunSertifikat: varchar("kebun_sertifikat"),
  kebunPenetapan: varchar("kebun_penetapan"),
  kebunStd: varchar("kebun_std"),
  kebunPembentukan: varchar("kebun_pembentukan"),
  kebunKonversi: varchar("kebun_konversi"),
  kebunKesepakatan: varchar("kebun_kesepakatan"),
  sertifikatIspo: text("sertifikat_ispo"),

  // Farmer group information
  taniNama: varchar("tani_nama"),
  taniAdrt: varchar("tani_adrt"),
  taniPembentukan: varchar("tani_pembentukan"),
  taniRko: varchar("tani_rko"),
  taniKegiatan: varchar("tani_kegiatan"),
  taniJumlah: varchar("tani_jumlah"),
  taniArea: varchar("tani_area"),
  taniTertanam: varchar("tani_tertanam"),
  taniTbs: varchar("tani_tbs"),
  petaLokasi: varchar("peta_lokasi"),

  // Additional information
  addNamaPerusahaan: varchar("add_nama_perusahaan"),
  addSertifikasi: varchar("add_sertifikasi"),
  addPic: varchar("add_pic"),
  addKendali: boolean("add_kendali"),
  addKendaliJml: integer("add_kendali_jml"),
  addAuditor: boolean("add_auditor"),
  addAuditorJml: integer("add_auditor_jml"),

  // Display flags
  showSalesinfo: boolean("show_salesinfo"),
  show14001: boolean("show_14001"),
  iso14001EnvAspect: text("iso_14001_env_aspect"),
  iso14001Obligation: text("iso_14001_obligation"),
  show45001: boolean("show_45001"),
  iso45001KeyHazard: text("iso_45001_key_hazard"),
  iso45001Obligation: text("iso_45001_obligation"),
  show27001: boolean("show_27001"),
  showHaccp: boolean("show_haccp"),
  show22000: boolean("show_22000"),

  // Additional fields
  kategori: varchar("kategori"),
  declaration: text("declaration"),

  // System fields
  createUid: integer("create_uid"),
  createDate: timestamp("create_date"),
  writeUid: integer("write_uid"),
  writeDate: timestamp("write_date"),

  // Integration flags
  showIntegratedYes: boolean("show_integreted_yes"),
  showIntegratedNo: boolean("show_integreted_no"),
  integratedAudit: varchar("integreted_audit"),
  userId: integer("user_id"),
  companyId: integer("company_id").notNull(),
  otherSystem: varchar("other_system"),

  // Site-specific hazard information
  hazardNumberSite1: varchar("hazard_number_site1"),
  hazardNumberSite2: varchar("hazard_number_site2"),
  hazardNumberSite3: varchar("hazard_number_site3"),
  hazardDescribeSite1: varchar("hazard_describe_site1"),
  hazardDescribeSite2: varchar("hazard_describe_site2"),
  hazardDescribeSite3: varchar("hazard_describe_site3"),

  // Site-specific process information
  processNumberSite1: varchar("process_number_site1"),
  processNumberSite2: varchar("process_number_site2"),
  processNumberSite3: varchar("process_number_site3"),
  processDescribeSite1: varchar("process_describe_site1"),
  processDescribeSite2: varchar("process_describe_site2"),
  processDescribeSite3: varchar("process_describe_site3"),

  // Site-specific technology information
  techNumberSite1: varchar("tech_number_site1"),
  techNumberSite2: varchar("tech_number_site2"),
  techNumberSite3: varchar("tech_number_site3"),
  techDescribeSite1: varchar("tech_describe_site1"),
  techDescribeSite2: varchar("tech_describe_site2"),
  techDescribeSite3: varchar("tech_describe_site3"),

  // Sales and franchise information
  salesPerson: integer("sales_person"),
  isFranchise: boolean("is_franchise"),
  franchiseId: integer("franchise_id"),
  picId: integer("pic_id"),

  // Additional ISO standards
  show37001: boolean("show_37001"),
  accreditation37001: integer("accreditation_37001"),
  notes37001: varchar("notes_37001"),

  // ISO 13485
  show13485: boolean("show_13485"),
  eaCode13485: integer("ea_code_13485"),
  accreditation13485: integer("accreditation_13485"),
  complexity13485: varchar("complexity_13485"),
  cause13485: text("cause_13485"),

  // Legal type and documents
  legalitasType: varchar("legalitas_type"),
  hgu: varchar("hgu"),
  hgb: varchar("hgb"),
  iup: varchar("iup"),
  pup: varchar("pup"),
  izinLingkunganIntegrasi: varchar("izin_lingkungan_integrasi"),
  luasLahan: doublePrecision("luas_lahan"),
  kapasitasPabrik: doublePrecision("kapasitas_pabrik"),
  izinLokasi: varchar("izin_lokasi"),
  apl: varchar("apl"),
  risalahPanitia: varchar("risalah_panitia"),
  lahanGambut: varchar("lahan_gambut"),
  peta: varchar("peta"),

  // Garden specific permits
  hguKebun: varchar("hgu_kebun"),
  iupb: varchar("iupb"),
  izinLingkunganKebun: varchar("izin_lingkungan_kebun"),
  hgbPabrik: varchar("hgb_pabrik"),
  kapasitasPabrikPabrik: doublePrecision("kapasitas_pabrik_pabrik"),
  shm: varchar("shm"),
  stdb: varchar("stdb"),
  sppl: varchar("sppl"),
  aktaPendirian: varchar("akta_pendirian"),

  // Additional ISO standards flags
  show37301: boolean("show_37301"),

  // ISO 27001:2022 specific
  eaCode270012022: integer("ea_code_27001_2022"),
  accreditation270012022: integer("accreditation_27001_2022"),
  complexity270012022: varchar("complexity_27001_2022"),

  // ISO 27017
  eaCode27017: integer("ea_code_27017"),
  accreditation27017: integer("accreditation_27017"),
  complexity27017: varchar("complexity_27017"),

  // ISO 27018
  eaCode27018: integer("ea_code_27018"),
  accreditation27018: integer("accreditation_27018"),
  complexity27018: varchar("complexity_27018"),

  // ISO 27701
  eaCode27701: integer("ea_code_27701"),
  accreditation27701: integer("accreditation_27701"),
  complexity27701: varchar("complexity_27701"),

  // ISO 27001:2022 business details
  iso27001Bisnistype2022: varchar("iso_27001_bisnistype_2022"),
  iso27001Process2022: varchar("iso_27001_process_2022"),
  iso27001MgmtSystem2022: varchar("iso_27001_mgmt_system_2022"),
  iso27001NumberProcess2022: varchar("iso_27001_number_process_2022"),
  iso27001Infra2022: varchar("iso_27001_infra_2022"),
  iso27001Sourcing2022: varchar("iso_27001_sourcing_2022"),
  iso27001Itdevelopment2022: varchar("iso_27001_itdevelopment_2022"),
  iso27001Itsecurity2022: varchar("iso_27001_itsecurity_2022"),
  iso27001Asset2022: varchar("iso_27001_asset_2022"),
  iso27001Drc2022: varchar("iso_27001_drc_2022"),

  // ISO 27018 business details
  iso27001Bisnistype27018: varchar("iso_27001_bisnistype_27018"),
  iso27001Process27018: varchar("iso_27001_process_27018"),
  iso27001MgmtSystem27018: varchar("iso_27001_mgmt_system_27018"),
  iso27001NumberProcess27018: varchar("iso_27001_number_process_27018"),
  iso27001Infra27018: varchar("iso_27001_infra_27018"),
  iso27001Sourcing27018: varchar("iso_27001_sourcing_27018"),
  iso27001Itdevelopment27018: varchar("iso_27001_itdevelopment_27018"),
  iso27001Itsecurity27018: varchar("iso_27001_itsecurity_27018"),
  iso27001Asset27018: varchar("iso_27001_asset_27018"),
  iso27001Drc27018: varchar("iso_27001_drc_27018"),

  // ISO 27017 business details
  iso27001Bisnistype27017: varchar("iso_27001_bisnistype_27017"),
  iso27001Process27017: varchar("iso_27001_process_27017"),
  iso27001MgmtSystem27017: varchar("iso_27001_mgmt_system_27017"),
  iso27001NumberProcess27017: varchar("iso_27001_number_process_27017"),
  iso27001Infra27017: varchar("iso_27001_infra_27017"),
  iso27001Sourcing27017: varchar("iso_27001_sourcing_27017"),
  iso27001Itdevelopment27017: varchar("iso_27001_itdevelopment_27017"),
  iso27001Itsecurity27017: varchar("iso_27001_itsecurity_27017"),
  iso27001Asset27017: varchar("iso_27001_asset_27017"),
  iso27001Drc27017: varchar("iso_27001_drc_27017"),

  // ISO 27701 business details
  iso27001Bisnistype27701: varchar("iso_27001_bisnistype_27701"),
  iso27001Process27701: varchar("iso_27001_process_27701"),
  iso27001MgmtSystem27701: varchar("iso_27001_mgmt_system_27701"),
  iso27001NumberProcess27701: varchar("iso_27001_number_process_27701"),
  iso27001Infra27701: varchar("iso_27001_infra_27701"),
  iso27001Sourcing27701: varchar("iso_27001_sourcing_27701"),
  iso27001Itdevelopment27701: varchar("iso_27001_itdevelopment_27701"),
  iso27001Itsecurity27701: varchar("iso_27001_itsecurity_27701"),
  iso27001Asset27701: varchar("iso_27001_asset_27701"),
  iso27001Drc27701: varchar("iso_27001_drc_27701"),

  // Show flags for various standards
  show27701: boolean("show_27701"),
  show27017: boolean("show_27017"),
  show27018: boolean("show_27018"),
  show270012022: boolean("show_27001_2022"),
  show31000: boolean("show_31000"),
  show9994: boolean("show_9994"),
  showSmk: boolean("show_smk"),
  show21000: boolean("show_21000"),

  // Additional notes and requirements
  notes13485: text("notes_13485"),
  akre: integer("akre"),
  specific: varchar("specific"),
  additional: varchar("additional"),

  // ISO 22301
  show22301: boolean("show_22301"),
  accreditation22301: integer("accreditation_22301"),
  notes22301: varchar("notes_22301"),

  // File and status information
  fileName: varchar("file_name"),
  stateSales: varchar("state_sales"),
  auditStatus: varchar("audit_status"),

  // Contact information for associates and franchise
  emailAssociate: varchar("email_associate"),
  phoneAssociate: varchar("phone_associate"),
  emailFranchise: varchar("email_franchise"),
  phoneFranchise: varchar("phone_franchise"),

  // Sales order and contract information
  saleOrderId: integer("sale_order_id"),
  nomorKontrak: varchar("nomor_kontrak"),
  statusKlien: varchar("status_klien"),

  // Leads information
  isLeads: boolean("is_leads"),
  leadsSelection: varchar("leads_selection"),
  leadsDescription: text("leads_description"),
  globalStatus: varchar("global_status"),

  // Transport and accommodation
  transportBy: varchar("transport_by"),
  hotelBy: varchar("hotel_by"),

  // GDP and other standards
  showGdp: boolean("show_gdp"),
  accreditationGdp: integer("accreditation_gdp"),
  complexityGdp: varchar("complexity_gdp"),

  // ISO 56001
  show56001: boolean("show_56001"),
  accreditation56001: integer("accreditation_56001"),
  complexity56001: varchar("complexity_56001"),

  // Additional standards
  showFscc: boolean("show_fscc"),
  showCe: boolean("show_ce"),
  accreditationCe: integer("accreditation_ce"),
  notesCe: text("notes_ce"),

  // ISO 19650 series
  show19650: boolean("show_19650"),
  show196502: boolean("show_196502"),
  show196503: boolean("show_196503"),
  show196504: boolean("show_196504"),
  show196505: boolean("show_196505"),
  accreditation19650: integer("accreditation_19650"),
  accreditation196502: integer("accreditation_196502"),
  accreditation196503: integer("accreditation_196503"),
  accreditation196504: integer("accreditation_196504"),
  accreditation196505: integer("accreditation_196505"),
  notes19650: text("notes_19650"),
  notes196502: text("notes_196502"),
  notes196503: text("notes_196503"),
  notes196504: text("notes_196504"),
  notes196505: text("notes_196505"),

  // ISO 19649
  show19649: boolean("show_19649"),
  accreditation19649: integer("accreditation_19649"),
  notes19649: text("notes_19649"),

  // ISO 21001
  show21001: boolean("show_21001"),
  accreditation21001: integer("accreditation_21001"),
  notes21001: text("notes_21001"),

  // SMETA
  showSmeta: boolean("show_smeta"),
  accreditationSmeta: integer("accreditation_smeta"),
  notesSmeta: text("notes_smeta"),

  // Additional ISO standards
  show410012018: boolean("show_41001_2018"),
  show260012018: boolean("show_26001_2018"),
});

export type TsiIso = typeof tsiIso.$inferSelect;
export type NewTsiIso = typeof tsiIso.$inferInsert;
