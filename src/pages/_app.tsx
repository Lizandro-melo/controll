import { ProviderAuth } from "@/provider/provider_auth";
import "@/styles/globals.css";
import type { AppProps } from "next/app";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ProviderAuth>
        <Component {...pageProps} />
      </ProviderAuth>
    </>
  );
}
