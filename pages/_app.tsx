import '@/styles/globals.css'

import { ThemeProvider, createTheme } from '@mui/material';

import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'

const theme = createTheme({
  typography: {
    // fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
    fontFamily: '"Tenor Sans", sans-serif',
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
      <Analytics />
    </>
  )
}
