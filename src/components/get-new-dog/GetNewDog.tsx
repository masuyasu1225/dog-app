import { useEffect, useState } from "react";
import { DogResponse } from "../../types";
import { db, auth, onAuthStateChanged } from "../../firebase";
import { User } from "firebase/auth";
import { collection, doc, addDoc, serverTimestamp } from "firebase/firestore";
import "./GetNewDog.css";
import Logout from "../logout/Logout";
import { Link } from "react-router-dom";
import doghouse from "../picture/doghouse.png"; // 画像をimport

function GetNewDog() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const maxFeed: number = 20;
  const maxTimer: number = 10;
  const initialFeed = Number(localStorage.getItem("feed") || maxFeed);
  const initialTimer = Number(localStorage.getItem("timer") || maxTimer);
  const [dogImage, setDogImage] = useState<string | null>(doghouse);
  const [feed, setFeed] = useState(initialFeed);
  const [timer, setTimer] = useState(initialTimer);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // ユーザーのログイン状態の変更を監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const fetchDogImage = () => {
    setFadeIn(false); // 画像取得前にフェードインをオフにする

    fetch("https://dog.ceo/api/breeds/image/random")
      .then((response) => response.json())
      .then((data: DogResponse) => {
        setDogImage(data.message);
        setFadeIn(true); // 画像取得後にフェードインをオンにする

        if (feed > 0) {
          setFeed(feed - 1);
        }

        // ユーザーがログインしている場合のみ、画像のURLをFirestoreに保存
        if (currentUser) {
          const usersCollection = collection(db, "users");
          const userDoc = doc(usersCollection, currentUser.uid);
          const dogImagesCollection = collection(userDoc, "dogImages");
          addDoc(dogImagesCollection, {
            url: data.message,
            timestamp: serverTimestamp(),
          });
        }
      })
      .catch((error) => console.log("Error:", error));
  };

  useEffect(() => {
    const timerDecreaseId = setInterval(() => {
      if (feed < maxFeed) {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            setFeed((prevFeed) => prevFeed + 1);
            return maxTimer;
          } else {
            return prevTimer - 1;
          }
        });
      }
    }, 1000);

    localStorage.setItem("feed", String(feed));

    return () => {
      clearInterval(timerDecreaseId);
    };
  }, [feed]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("timer", String(timer));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [timer]);

  if (dogImage === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Random Dog Image</h1>
      <img
        className={`dog-image ${fadeIn ? "fade-in" : ""}`}
        src={dogImage}
        alt="A random dog"
      />
      <p>
        Feed: {feed}/{maxFeed}
      </p>
      {feed < 20 && <p>Timer: {timer} Seconds</p>}
      <button onClick={fetchDogImage} disabled={feed <= 0}>
        Get New Dog
      </button>
      <Logout />
      <Link to="/all-my-dogs">
        <button>View All My Dogs</button>
      </Link>
    </div>
  );
}
export default GetNewDog;
