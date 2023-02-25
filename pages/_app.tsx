import '@/styles/globals.css'

import { ThemeProvider, createTheme } from '@mui/material';

import type { AppProps } from 'next/app'

const theme = createTheme({
  typography: {
    // fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
    fontFamily: '"Tenor Sans", sans-serif',
  },
  // setbackground color of whole app to brown
  // palette: {
  //   primary: {
  //     main: '#8B4513',
  //   },
  //   secondary: {
  //     main: '#8B4513',
  //   },
  // }
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
