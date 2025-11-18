import "@/presentation/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProviderLoading } from "@/presentation/provider/provider_loading";
import { ProviderAlert } from "@/presentation/provider/provider_alert";
import { ProviderAuth } from "@/presentation/provider/provider_auth";

const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ProviderLoading>
        <ProviderAlert>
          <ProviderAuth>
            <Component {...pageProps} />
          </ProviderAuth>
        </ProviderAlert>
      </ProviderLoading>
    </QueryClientProvider>
  );
}
