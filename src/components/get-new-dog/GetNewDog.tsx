import React, { useEffect, useState } from "react";
import { DogResponse } from "../../types";
import { db, auth, onAuthStateChanged } from "../../firebase";
import { User } from "firebase/auth";
import { collection, doc, addDoc, serverTimestamp } from "firebase/firestore";
import "./GetNewDog.css";
import Logout from "../logout/Logout";
import { Link } from "react-router-dom";
import doghouse from "../picture/doghouse.png";

import {
  calculateElapsedTimeInSeconds,
  updateFeedAndTimer,
} from "../utils/timeHelpers";
import DogImage from "./DogImage";

const MAX_FEED = 20;
const MAX_TIMER = 10;

const GetNewDog: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [fadeIn, setFadeIn] = useState<boolean>(false);

  // Calculate elapsed time
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(
    Number(localStorage.getItem("lastUpdateTime") || Date.now())
  );
  const elapsedSeconds = calculateElapsedTimeInSeconds(lastUpdateTime);

  // Get initial feed and timer values
  const initialFeed = Number(localStorage.getItem("feed") || MAX_FEED);
  const initialTimer = Number(localStorage.getItem("timer") || MAX_TIMER);

  const { updatedFeed, updatedTimer } = updateFeedAndTimer(
    initialFeed,
    initialTimer,
    elapsedSeconds,
    MAX_FEED,
    MAX_TIMER
  );

  const [dogImage, setDogImage] = useState<string | null>(doghouse);
  const [feed, setFeed] = useState<number>(updatedFeed);
  const [timer, setTimer] = useState<number>(updatedTimer);

  const saveToFirestore = (imageUrl: string) => {
    if (currentUser) {
      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, currentUser.uid);
      const dogImagesCollection = collection(userDoc, "dogImages");
      addDoc(dogImagesCollection, {
        url: imageUrl,
        timestamp: serverTimestamp(),
      });
    }
  };

  const fetchDogImage = () => {
    setFadeIn(false);

    fetch("https://dog.ceo/api/breeds/image/random")
      .then((response) => response.json())
      .then((data: DogResponse) => {
        setDogImage(data.message);
        setFadeIn(true);
        if (feed > 0) {
          setFeed((prevFeed) => prevFeed - 1);
        }
        saveToFirestore(data.message);
      })
      .catch((error) => console.log("Error:", error));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("lastUpdateTime", String(Date.now()));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    setLastUpdateTime(Date.now());
    localStorage.setItem("feed", String(feed));
    localStorage.setItem("timer", String(Math.floor(timer)));
  }, [feed, timer]);

  useEffect(() => {
    const timerDecreaseId = setInterval(() => {
      if (feed < MAX_FEED) {
        setTimer((prevTimer) => (prevTimer <= 0 ? MAX_TIMER : prevTimer - 1));
        if (timer <= 0) {
          setFeed((prevFeed) => prevFeed + 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(timerDecreaseId);
    };
  }, [feed, timer]);

  return (
    <div>
      <h1>Random Dog Image</h1>
      {dogImage && <DogImage src={dogImage} fadeIn={fadeIn} />}
      <p>Feed: {feed}/20</p>
      {feed < MAX_FEED && <p>Timer: {timer} Seconds</p>}
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
