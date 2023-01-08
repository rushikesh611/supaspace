import type { NextPage } from "next";
import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import Head from "next/head";

type Link = {
  title: string;
  url: string;
};

const Home: NextPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [url, setUrl] = useState<string | undefined>();
  const [links, setLinks] = useState<Link[]>();

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

  useEffect(() => {
    const getLinks = async () => {
      try {
        const { data, error } = await supabase
          .from("links")
          .select("title, url")
          .eq("user_id", userId);
        if (error) throw error;
        setLinks(data);
      } catch (error) {
        console.log("error:", error);
      }
    };
    if (userId) {
      getLinks();
    }
  }, [userId]);

  const addNewLink = async () => {
    try {
      if (title && url && userId) {
        const { data, error } = await supabase
          .from("links")
          .insert({
            title: title,
            url: url,
            user_id: userId,
          })
          .select();
        if (error) throw error;
        console.log("data:", data);
        if (links) {
          setLinks([...data, ...links]);
        }
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <div>
      <Head>
        <title>SupaSpace</title>
      </Head>
      <div className="flex flex-col w-full justify-center items-center mt-4">
        {links?.map((link: Link, index: number) => (
          <div
            className="shadow-xl w-96 bg-red-700 mt-4 p-4 rounded-lg text-center text-white"
            key={index}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = link.url;
            }}
          >
            {link.title}
          </div>
        ))}
        {isAuthenticated && (
          <>
            <div className="form-control w-full max-w-xs mt-4">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="my portfolio"
                className="input input-bordered w-full max-w-xs input-md"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-control w-full max-w-xs mt-4">
              <label className="label">
                <span className="label-text">URL</span>
              </label>
              <input
                type="text"
                name="url"
                id="url"
                placeholder="www.example.com/myusername"
                className="input input-bordered w-full max-w-xs input-md"
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-wide mt-4"
              onClick={addNewLink}
            >
              Add new link
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
