/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  await auth(request as any);

  /* Handle redirection for old URLs */
  if (request.nextUrl.pathname.startsWith("/application-form")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (request.nextUrl.pathname.startsWith("/mandays")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (request.nextUrl.pathname.startsWith("/price-simulation")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (request.nextUrl.pathname.startsWith("/quotation")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (
    request.nextUrl.pathname.startsWith("/tracking-certificate/label-maps")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (request.nextUrl.pathname.startsWith("/tracking-certificate/tsi")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (
    request.nextUrl.pathname.startsWith("/tracking-certificate/audit-status")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (
    request.nextUrl.pathname.startsWith("/tracking-certificate/certificate")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (request.nextUrl.pathname.startsWith("/audit-process/audit-plan")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (
    request.nextUrl.pathname.startsWith("/audit-process/audit-document-check")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (request.nextUrl.pathname.startsWith("/audit-history")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (request.nextUrl.pathname.startsWith("/finance")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (request.nextUrl.pathname.startsWith("/payments")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (request.nextUrl.pathname.startsWith("/auditor-schedule")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (request.nextUrl.pathname.startsWith("/library/webinars")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (request.nextUrl.pathname.startsWith("/library/standard-iso")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (
    request.nextUrl.pathname.startsWith("/perks-and-updates/benefit")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (
    request.nextUrl.pathname.startsWith("/perks-and-updates/rewards")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (
    request.nextUrl.pathname.startsWith("/perks-and-updates/membership")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (request.nextUrl.pathname.startsWith("/crm")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
