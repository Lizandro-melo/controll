import {
  createContext,
  ReactNode,
  useCallback,
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

const montFont = Montserrat({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type LoginData = {
  CPF: string;
  Senha: string;
};

type ContextAuthType = {
  auth: boolean;
  loginIn: (data: LoginData) => void;
  loginOff: () => void;
};

export const user_dev = {
  cpf: "admin",
  senha: "admin",
  uuid: "0398e405-d74b-455d-a288-942f5ae93692",
};

export const ContextAuth = createContext({} as ContextAuthType);

export function ProviderAuth({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<boolean>(false);
  const [flashLogo, setFlashLogo] = useState(true);

  const AnimeLogoTimer = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setFlashLogo(false);
  }, []);

  useEffect(() => {
    AnimeLogoTimer();
  }, [AnimeLogoTimer]); // <- agora não precisa do disable

  useLayoutEffect(() => {
    const { uuid_user } = parseCookies();

    if (uuid_user === user_dev.uuid) {
      Router.push("/dash");
      setAuth(true);
    } else {
      Router.push("/");
    }
  }, []);

  const loginIn = (data: LoginData) => {
    if (data.CPF === user_dev.cpf && data.Senha === user_dev.senha) {
      setCookie(undefined, "uuid_user", user_dev.uuid);
      setAuth(true);
      Router.push("/dash");
    } else {
      Router.push("/");
    }
  };

  const loginOff = () => {
    destroyCookie(undefined, "uuid_user");
    setAuth(false);
    Router.push("/");
  };

  return (
    <ContextAuth.Provider
      value={{
        auth,
        loginIn,
        loginOff,
      }}
    >
      <main className={`${montFont.className} h-full w-full`}>
        <main className="bg-white h-screen w-full relative overscroll-none overflow-x-hidden">
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
              {!auth ? (
                <div className="flex w-full h-full max-sm:flex-col relative">
                  <Nav>{children}</Nav>
                </div>
              ) : (
                <Central>{children}</Central>
              )}
            </div>
          )}
        </main>
      </main>
    </ContextAuth.Provider>
  );
}
