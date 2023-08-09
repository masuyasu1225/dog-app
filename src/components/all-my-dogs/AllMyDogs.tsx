import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function AllMyDogs() {
  const [dogImages, setDogImages] = useState<string[]>([]);

  useEffect(() => {
    // 現在のユーザーIDを取得
    const currentUserId = auth.currentUser?.uid;

    if (currentUserId) {
      // Firestoreからユーザーの犬の画像を取得
      const userDogImagesRef = collection(
        db,
        "users",
        currentUserId,
        "dogImages"
      );

      getDocs(userDogImagesRef)
        .then((snapshot) => {
          const fetchedImages: string[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            fetchedImages.push(data.url);
            console.log(data);
          });
          setDogImages(fetchedImages);
        })
        .catch((error) => {
          console.error("Error fetching dog images:", error.message);
        });
    }
  }, []);

  console.log(dogImages);

  return (
    <div>
      <h1>My Dogs</h1>
      {dogImages.map((image, index) => (
        <img key={index} src={image} alt="My Dog" />
      ))}
    </div>
  );
}

export default AllMyDogs;
