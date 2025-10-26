import "@/utils/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProviderAuth } from "@/utils/provider/provider_auth";
import { ProviderLoading } from "@/utils/provider/provider_loading";
import { ProviderAlert } from "@/utils/provider/provider_alert";

const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ProviderLoading>
          <ProviderAlert>
            <ProviderAuth>
              <Component {...pageProps} />
              <div className="fixed opacity-50 p-5 flex justify-center items-center font-bold text-white h-[80px] rounded-3xl scale-80 bottom-1 left-2 bg-purple-800">
                APLICAÇÃO DEMO
              </div>
            </ProviderAuth>
          </ProviderAlert>
        </ProviderLoading>
      </QueryClientProvider>
    </>
  );
}
