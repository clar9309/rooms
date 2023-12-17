import { getServerSession } from "next-auth";
import BaseLayout from "../_components/layout/BaseLayout";
import AuthProvider from "../_components/providers/AuthProvider";
import "../globals.css";
import localFont from "next/font/local";
import { authOptions } from "@/lib/auth";
import QueryProvider from "../_components/providers/QueryProvider";
import Head from "next/head";
import Favicon from "/public/favicon.svg";
import { Metadata } from "next";

const gotham = localFont({
  // src: "../_fonts/GothamBook.ttf",
  src: [
    {
      path: "../_fonts/GothamBook.ttf",
      weight: "400",
    },
    {
      path: "../_fonts/GothamMedium.ttf",
      weight: "500",
    },
  ],
  variable: "--body-font",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rooms",
  description: "Welcome to rooms",
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${gotham.variable}`}>
      <Head>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <body className={"font-body"}>
        <QueryProvider>
          <AuthProvider>
            <BaseLayout session={session ? true : false}>{children}</BaseLayout>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
