import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

function Logout() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // ログアウト成功
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error.message);
      });
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Logout</button>

      {showModal && (
        <div className="modal">
          <p>ログアウトしますか？</p>
          <button onClick={handleLogout}>はい</button>
          <button onClick={() => setShowModal(false)}>いいえ</button>
        </div>
      )}
    </div>
  );
}

export default Logout;
