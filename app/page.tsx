import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";

// import { ThemeSupa } from "@supabase/auth-ui-shared";

import { Analytics } from "@vercel/analytics/react";

import { useState, useEffect } from "react";

import { Home } from "./components/home";

import { getServerSideConfig } from "./config/server";

const serverConfig = getServerSideConfig();

const supabase = createClient('https://<project>.supabase.co', '<your-anon-key>');



export default async function App() {
  const [session, setSession] = useState(null)

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    }, [])

    if (!session) {
      return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
    }
    else {
      return (<div>Logged in!</div>)
    }
  return (
    <>
      <Home />
      {serverConfig?.isVercel && <Analytics />}
    </>
  );
}

