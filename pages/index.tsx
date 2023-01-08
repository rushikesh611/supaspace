import type { NextPage } from "next";
import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import Head from "next/head";

const Home: NextPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      console.log("user:", user);
      if (user) {
        const userId = user.data.user?.id;
        setIsAuthenticated(true);
        setUserId(userId);
      }
    };

    getUser();
  }, []);
  return (
    <div>
      <Head>
        <title>SupaSpace</title>
      </Head>
      <h1 className="text-red-500">supaspace</h1>
    </div>
  );
};

export default Home;
