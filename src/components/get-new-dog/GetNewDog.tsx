import React, { useEffect, useState } from "react";
import { DogResponse } from "../../types";
import { db, auth, onAuthStateChanged } from "../../firebase";
import { User } from "firebase/auth";
import { collection, doc, addDoc, serverTimestamp } from "firebase/firestore";
import "./GetNewDog.css";
import Logout from "../logout/Logout";
import { Link } from "react-router-dom";
import doghouse from "../picture/doghouse.png"; // 画像をimport

// 追加: timeHelpersとDogImageのインポート
import {
  calculateElapsedTimeInSeconds,
  updateFeedAndTimer,
} from "../utils/timeHelpers";
import DogImage from "./DogImage";

const GetNewDog: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [fadeIn, setFadeIn] = useState<boolean>(false);

  const maxFeed = 20;
  const maxTimer = 10;

  // 前回の更新時間からの経過時間を計算
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(
    Number(localStorage.getItem("lastUpdateTime") || Date.now())
  );
  const elapsedSeconds = calculateElapsedTimeInSeconds(lastUpdateTime);

  // localStorageからfeedとtimerの初期値を取得
  const initialFeed = Number(localStorage.getItem("feed") || maxFeed);
  const initialTimer = Number(localStorage.getItem("timer") || maxTimer);

  // 経過時間を考慮してfeedとtimerを更新
  const { updatedFeed, updatedTimer } = updateFeedAndTimer(
    initialFeed,
    initialTimer,
    elapsedSeconds,
    maxFeed,
    maxTimer
  );

  const [dogImage, setDogImage] = useState<string | null>(doghouse);
  const [feed, setFeed] = useState<number>(updatedFeed);
  const [timer, setTimer] = useState<number>(updatedTimer);
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
    // ページを閉じる前に現在の時刻を保存
    const handleBeforeUnload = () => {
      setLastUpdateTime(Date.now());
      localStorage.setItem("lastUpdateTime", String(Date.now()));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // feedやtimerが変わるたびに、lastUpdateTimeも更新
    setLastUpdateTime(Date.now());
  }, [feed, timer]);

  useEffect(() => {
    // lastUpdateTimeが変わるたびにlocalStorageに保存
    localStorage.setItem("lastUpdateTime", String(lastUpdateTime));
  }, [lastUpdateTime]);

  useEffect(() => {
    const timerDecreaseId = setInterval(() => {
      if (feed < 20) {
        setTimer((prevTimer) => {
          if (prevTimer <= 0) {
            setFeed((prevFeed) => prevFeed + 1);
            return 10;
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
    localStorage.setItem("timer", String(Math.floor(timer)));
  }, [timer]);

  if (dogImage === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Random Dog Image</h1>
      <DogImage src={dogImage} fadeIn={fadeIn} />
      <p>Feed: {feed}/20</p>
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
};

export default GetNewDog;
