import { ContextAuth } from "@/utils/front/provider/provider_auth";
import { ContextLoading } from "@/utils/front/provider/provider_loading";
import axios from "axios";
import Router from "next/router";
import { parseCookies } from "nookies";
import { useContext, useEffect, useLayoutEffect } from "react";

export default function Session() {
  const { startLoading } = useContext(ContextLoading);
  const { setAuth } = useContext(ContextAuth);

  useEffect(() => {
    const { session_uuid_controll: session } = parseCookies();
    if (session) {
      startLoading(
        axios
          .get(`/api/verify/session?session=${session}`)
          .then((response) => {
            Router.push(response.data.result);
            setAuth(true);
          })
          .catch((e) => {
            Router.push(e.response.data.result);
            setAuth(false);
          }),
      );
    }
  }, []);

  return <></>;
}
