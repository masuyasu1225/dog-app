import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../../firebase";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // ログイン成功
        navigate("/get-new-dog"); // ここでリダイレクトを行います
      })
      .catch((error) => {
        // エラー処理
        console.error("Error logging in with Google:", error.message);
      });
  };

  return <button onClick={handleLogin}>Sign in with Google</button>;
}

export default Login;
