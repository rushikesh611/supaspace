import { useState } from "react";
import supabase from "../utils/supabaseClient";
import { useRouter } from "next/router";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const router = useRouter();

  async function signInWithEmail() {
    try {
      if (email && password) {
        const res = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (res.error) throw res.error;
        const userId = res.data.user?.id;
        console.log("User logged in", userId);
        router.push("/");
      }
    } catch {
      console.log("Error logging in");
    }
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="form-control w-full max-w-xs mt-4">
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
        onClick={signInWithEmail}
      >
        Login
      </button>
    </div>
  );
};

export default Login;
