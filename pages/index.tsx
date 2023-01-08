import type { NextPage } from "next";
import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import Head from "next/head";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Image from "next/image";

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
  const [images, setImages] = useState<ImageListType>([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState<
    string | undefined
  >();

  const onChange = (imageList: ImageListType) => {
    // data for submit
    console.log(imageList);
    setImages(imageList);
  };

  const uploadProfilePicture = async () => {
    try {
      if (images.length > 0) {
        const image = images[0];
        if (image.file && userId) {
          const { data, error } = await supabase.storage
            .from("public")
            .upload(`${userId}/${image.file.name}`, image.file, {
              upsert: true,
            });
          if (error) throw error;
          const res = supabase.storage.from("public").getPublicUrl(data.path);
          const publicUrl = res.data.publicUrl;
          const updateUserResponse = await supabase
            .from("users")
            .update({ profile_picture_url: publicUrl })
            .eq("id", userId);

          if (updateUserResponse.error) throw error;
        }
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

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

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("profile_picture_url")
          .eq("id", userId);
        if (error) throw error;
        const profilePictureUrl = data[0]["profile_picture_url"];
        setProfilePictureUrl(profilePictureUrl);
      } catch (error) {
        console.log("error:", error);
      }
    };

    if (userId) {
      getUser();
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
        {profilePictureUrl && (
          <Image
            src={profilePictureUrl}
            alt="profile-picture"
            height={100}
            width={100}
            className="rounded-full"
          />
        )}
        {links?.map((link: Link, index: number) => (
          <div
            className="shadow-xl w-96 bg-primary-content mt-4 p-4 rounded-lg text-center text-white"
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
            <div>
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
                className="btn btn-secondary btn-wide mt-4"
                onClick={addNewLink}
              >
                Add new link
              </button>
            </div>

            <div className="mt-4">
              <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={1}
                dataURLKey="data_url"
              >
                {({
                  imageList,
                  onImageUpload,
                  onImageRemoveAll,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps,
                }) => (
                  // write your building UI
                  <div className="upload__image-wrapper flex flex-col items-center">
                    {images.length === 0 ? (
                      <button
                        style={isDragging ? { color: "red" } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                        className="btn btn-ghost"
                      >
                        Click or Drop here
                      </button>
                    ) : (
                      <button
                        className="btn btn-ghost"
                        onClick={onImageRemoveAll}
                      >
                        Remove all images
                      </button>
                    )}

                    {imageList.map((image, index) => (
                      <div
                        key={index}
                        className="image-item flex flex-col items-center"
                      >
                        <Image
                          src={image["data_url"]}
                          alt="profile picture"
                          width="100"
                          height="100"
                          className="my-2"
                        />
                        <div className="image-item__btn-wrapper flex flex-row">
                          <button
                            onClick={() => onImageUpdate(index)}
                            className="btn btn-ghost"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => onImageRemove(index)}
                            className="btn btn-ghost"
                          >
                            Remove
                          </button>
                        </div>
                        <button
                          className="btn btn-secondary my-2"
                          type="button"
                          onClick={uploadProfilePicture}
                        >
                          Upload Profile Picture
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </ImageUploading>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
