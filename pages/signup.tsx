import { useState } from "react";
import supabase from "../utils/supabaseClient";

interface signupProps {}

const Signup: React.FC<signupProps> = ({}) => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();

  async function signUpWithEmail() {
    try {
      if (email && password) {
        const res = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (res.error) throw res.error;
        const userId = res.data.user?.id;
        if (userId) {
          await createUser(userId);
          console.log("User created", userId);
        }
      }
    } catch {
      console.log("Error creating user");
    }
  }

  async function createUser(userId: any) {
    try {
      const { error } = await supabase
        .from("users")
        .insert({ id: userId, username: username });
      if (error) throw error;
    } catch (error) {
      console.log("error:", error);
    }
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="form-control w-full max-w-xs mt-4">
        <label className="label" htmlFor="username">
          <span className="label-text">Username</span>
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="sushi6911"
          className="input input-bordered w-full max-w-xs input-md"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label" htmlFor="email">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="you@example.com"
          className="input input-bordered w-full max-w-xs input-md"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label" htmlFor="password">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="password"
          className="input input-bordered w-full max-w-xs input-md"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="btn btn-secondary btn-wide mt-4"
        onClick={signUpWithEmail}
      >
        Sign Up
      </button>
    </div>
  );
};

export default Signup;
