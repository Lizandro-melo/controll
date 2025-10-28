import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head>
        <title>Controll</title>
        <meta charSet="UTF-8" />
        <meta name="robots" content="max-image-preview:large" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <link rel="apple-touch-startup-image" href="/assets/logo_192x192.jpg" />
        <meta name="apple-mobile-web-app-title" content="Controll" />
        <meta name="application-name" content="Controll" />
        <meta property="og:title" content="Controll" />
        <meta
          property="og:description"
          content="Controll é um sistema de controle de veículos alugados"
        />
        <meta property="og:image" content="/assets/logo_512x512.jpg" />
        <link rel="icon" type="image/png" href="/assets/logo_512x512.jpg" />
        <link rel="apple-touch-icon" href="/assets/logo_512x512.jpg" />
        <meta
          name="msapplication-TileImage"
          content="/assets/logo_512x512.jpg"
        />
      </Head>
      <body className="antialiased overscroll-none">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
