import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./AllMyDogs.css";
import { Link } from "react-router-dom";

function AllMyDogs() {
  const [dogImages, setDogImages] = useState<string[]>([]);

  useEffect(() => {
    // 認証状態の変化を監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ユーザーが認証されている場合のみデータを取得
        const userDogImagesRef = collection(db, "users", user.uid, "dogImages");

        getDocs(userDogImagesRef)
          .then((snapshot) => {
            const fetchedImages: string[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              fetchedImages.push(data.url);
            });
            setDogImages(fetchedImages);
          })
          .catch((error) => {
            console.error("Error fetching dog images:", error.message);
          });
      }
    });

    // コンポーネントのクリーンアップ時にリスナーを解除
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div>
        <h1>My Dogs</h1>
        {dogImages.map((image, index) => (
          <img className="my-dog" key={index} src={image} alt="My Dog" />
        ))}
      </div>
      <Link to="/get-new-dog">
        <button>Back to Home</button>
      </Link>
    </>
  );
}

export default AllMyDogs;
