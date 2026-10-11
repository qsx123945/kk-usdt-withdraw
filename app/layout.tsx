import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import WalletProvider from "./WalletProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {

  title: "KK USDT",

  description: "TRON USDT Service",

};



export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {


  return (

    <html

      lang="zh-CN"

      className={`${geistSans.variable} ${geistMono.variable} antialiased`}

    >


      <body>


        <WalletProvider>


          {children}


        </WalletProvider>


      </body>


    </html>

  );


}