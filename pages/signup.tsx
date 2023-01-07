import { useState } from "react";
import supabase from "../utils/supabaseClient";

interface signupProps {}

const Signup: React.FC<signupProps> = ({}) => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();

  async function signUpWithEmail() {
    try {
      if (email && password) {
        const res = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (res.error) throw res.error;
        const userId = res.data.user?.id;
        console.log("User created", userId);
      }
    } catch {
      console.log("Error creating user");
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
        onClick={signUpWithEmail}
      >
        Sign Up
      </button>
    </div>
  );
};

export default Signup;
