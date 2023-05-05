// import { Head, Html, Main, NextScript } from 'next/document'

import Document, { Head, Html, Main, NextScript } from 'next/document';

// export default function Document() {
//   return (
//     <Html lang="en">
//       <Head title="Cobeen Mailroom"/>
//       <body>
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   )
// }
import { createGetInitialProps } from '@mantine/next';

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}