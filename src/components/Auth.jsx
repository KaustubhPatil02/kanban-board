import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Auth({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
      }
    } catch (error) {
      console.error("Authentication Error: ", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md" onSubmit={handleAuth}>
        <h2 className="mb-4 text-2xl">{isLogin ? "Login" : "Sign Up"}</h2>
        <input
          type="email"
          className="w-full px-3 py-2 mb-4 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full px-3 py-2 mb-4 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          type="submit"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <button
          className="w-full px-4 py-2 mt-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
          type="button"
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </button>
        <p
          className="mt-4 text-blue-500 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Sign up." : "Already have an account? Login."}
        </p>
      </form>
    </div>
  );
}