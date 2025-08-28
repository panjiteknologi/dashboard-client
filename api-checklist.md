# API Checklist

## Implementation Status

### 1. Tracking Certificate ✅ DONE
- **Endpoints:** 
  - `/api/chart_list_standards`
  - `/api/get_date_customer`
- **Status:** Completed

### 2. Audit Process ✅ DONE
- **Module:** `ops.report`
- **Endpoints:**
  - `/api/client/audit_reports`
  - `/api/client/audit_reports/:id`
- **Status:** Completed

### 3. Scope Library ✅ DONE
- **Implementation:** Static/hard coded
- **Status:** Completed

### 4. Our Auditor ❌ NOT STARTED
- **Module:** `ops.plan` (auditor_lead, etc)
- **Status:** Not started

### 5. Quotation ❌ NOT STARTED
- **Module:** `sale.order` (quotations)
- **Status:** Not started

### 6. Standard ❌ NOT STARTED
- **Module:** `tsi.iso.standard`
- **Status:** Not started

### 7. Reminder Surveillance ❌ NOT STARTED
- **Module:** `res.partner > ops.sertifikat`
- **Status:** Not started

### 8. Payments ❌ NOT STARTED
- **Module:** `sale.order` (orders)
- **Status:** Not started

---

## Summary
- **Completed:** 3/8 items (37.5%)
- **Remaining:** 5/8 items (62.5%)