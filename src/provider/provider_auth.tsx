import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import Router from "next/router";
import { Montserrat } from "next/font/google";
import { setCookie, parseCookies, destroyCookie } from "nookies";

import Image from "next/image";
import Central from "@/components/ui/central";
import Nav from "@/components/ui/nav";
import ResponseAlert from "@/components/ui/response-alert";
import { useSearchParams } from "next/navigation";

const montFont = Montserrat({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export type LoginData = {
  login: string;
  senha: string;
};

type ContextAuthType = {
  auth: boolean;
  loginIn: (data: LoginData) => void;
  loginOff: () => void;
};

export const user_dev = {
  login: "demo",
  senha: "admin",
  uuid: "0398e405-d74b-455d-a288-942f5ae93692",
};

export const ContextAuth = createContext({} as ContextAuthType);

export function ProviderAuth({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<boolean>(false);
  const [flashLogo, setFlashLogo] = useState(true);
  const searchParams = useSearchParams();
  const AnimeLogoTimer = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setFlashLogo(false);
  }, []);

  useEffect(() => {
    AnimeLogoTimer();
  }, [AnimeLogoTimer]);

  useLayoutEffect(() => {
    const { uuid_user } = parseCookies();

    if (uuid_user === user_dev.uuid) {
      Router.push("/");
      setAuth(true);
    } else {
      Router.push("/auth");
    }
  }, []);

  const loginIn = (data: LoginData) => {
    let login = data.login.replaceAll(".", "");
    login = login.replace("-", "");
    if (login === user_dev.login && data.senha === user_dev.senha) {
      setCookie(undefined, "uuid_user", user_dev.uuid);
      setAuth(true);
      Router.push("/");
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("alertStatus", `${true}`);
      params.set("alertType", `error`);
      params.set("alertMensagem", `Login ou senha incorretos`);
      Router.push(`?${params.toString()}`);
    }
  };

  const loginOff = () => {
    destroyCookie(undefined, "uuid_user");
    setAuth(false);
    Router.push("/auth");
  };

  return (
    <ContextAuth.Provider
      value={{
        auth,
        loginIn,
        loginOff,
      }}
    >
      <ResponseAlert />
      <main
        className={`${montFont.className} bg-white h-screen w-full relative overscroll-none overflow-x-hidden`}
      >
        {flashLogo ? (
          <Central>
            <Image
              className="animate-pulse"
              src={"/assets/logo.png"}
              width={250}
              height={200}
              alt="Logo"
            />
          </Central>
        ) : (
          <div className={`relative w-full h-full`}>
            {auth ? (
              <div className="flex w-full h-full max-lg:flex-col relative">
                <Nav>{children}</Nav>
              </div>
            ) : (
              <Central>{children}</Central>
            )}
          </div>
        )}
      </main>
    </ContextAuth.Provider>
  );
}
