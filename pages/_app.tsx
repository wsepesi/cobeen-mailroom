import '@/styles/globals.css'

import { ThemeProvider, createTheme } from '@mui/material';

import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs';
import { MantineProvider } from '@mantine/core';

const theme = createTheme({
  typography: {
    // fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
    fontFamily: '"Tenor Sans", sans-serif',
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: 'light',
      }}
    >
      <ThemeProvider theme={theme}>
        <ClerkProvider {...pageProps}>
          <Component {...pageProps} />
        </ClerkProvider>
      </ThemeProvider>
    </MantineProvider>
      <Analytics />
    </>
  )
}
