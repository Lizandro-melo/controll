import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
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
import axios from "axios";
import { ContextLoading } from "./provider_loading";
import { ContextAlert } from "./provider_alert";
import { NAME_COOKIE_SESSION } from "@/infra/constants";
import Central from "../components/ui/central";
import Nav from "../components/ui/nav";
import { response } from "@/utils/types";

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
  setAuth: Dispatch<SetStateAction<boolean>>;
  headers: {
    Authorization: string;
  };
};

export const ContextAuth = createContext({} as ContextAuthType);

export function ProviderAuth({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<boolean>(false);
  const { session_uuid_controll: session } = parseCookies();
  const [flashLogo, setFlashLogo] = useState(true);
  const AnimeLogoTimer = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setFlashLogo(false);
  }, []);
  const { startLoading } = useContext(ContextLoading);
  const { drop_alert } = useContext(ContextAlert);
  const headers = {
    Authorization: `Bearer ${session}`,
  };

  useEffect(() => {
    AnimeLogoTimer();
  }, [AnimeLogoTimer]);

  useLayoutEffect(() => {
    if (Router.asPath.split("?")[0] === "/register") {
      return;
    } else {
      const { session_uuid_controll: session } = parseCookies();
      if (session) {
        Router.push("/session");
      } else {
        Router.push("/");
      }
    }
  }, []);

  const loginIn = (data: LoginData) => {
    startLoading(
      axios
        .post("/api/auth/login", data)
        .then((response) => {
          const session: string = response.data.result;
          setCookie(undefined, NAME_COOKIE_SESSION, session);
          setAuth(true);
          Router.push("/session");
        })
        .catch((e) => {
          const response: response = e.response.data;
          drop_alert(response.type, response.m);
        }),
    );
  };

  const loginOff = () => {
    destroyCookie(undefined, NAME_COOKIE_SESSION);
    setAuth(false);
    Router.push("/");
  };

  return (
    <ContextAuth.Provider
      value={{
        auth,
        loginIn,
        loginOff,
        setAuth,
        headers,
      }}
    >
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
