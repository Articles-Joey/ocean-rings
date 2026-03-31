// import { Geist, Geist_Mono } from "next/font/google";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';

import "bootstrap/dist/css/bootstrap.min.css";

import "@/styles/index.scss";

import "@articles-media/articles-dev-box/dist/style.css";

import "@articles-media/articles-gamepad-helper/dist/articles-gamepad-helper.css";

import SocketLogicHandler from "@/components/SocketLogicHandler";
import { Suspense } from 'react';

import LayoutClient from './layoutClient'
import GlobalClientModals from '@/components/UI/GlobalClientModals';
import dynamic from 'next/dynamic';

export const metadata = {
  title: "Ocean Rings",
  description: "Try to knock each other off a platform by breaking the blocks beneath their feet.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <head>
        
        {/* <link
          rel="stylesheet"
          href={`${process.env.NEXT_PUBLIC_CDN}fonts/fontawesome/css/all.min.css`}
        /> */}

      </head>

      <body
      // className={`${geistSans.variable} ${geistMono.variable}`}
      >

        <SocketLogicHandler />
        <LayoutClient />

        <Suspense>
          <GlobalClientModals />
          {/* <DarkModeHandler /> */}
        </Suspense>

        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
