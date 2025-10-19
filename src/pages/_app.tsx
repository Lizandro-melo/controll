import { ProviderAuth } from "@/provider/provider_auth";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ProviderAuth>
          <Component {...pageProps} />
          <div className="fixed p-5 flex justify-center items-center font-bold text-white h-[80px] rounded-3xl scale-80 bottom-1 left-2 bg-purple-800">
            APLICAÇÃO DEMO
          </div>
        </ProviderAuth>
      </QueryClientProvider>
    </>
  );
}
