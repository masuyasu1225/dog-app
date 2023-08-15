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

  return (
    <>
      <h1>Dog Gacha</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </>
  );
}

export default Login;
