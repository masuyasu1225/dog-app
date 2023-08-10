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
  const [dogImage, setDogImage] = useState<string | null>(doghouse);
  const [feed, setFeed] = useState(20);
  const [timer, setTimer] = useState(10);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const maxFeed: number = 20;

  useEffect(() => {
    // ユーザーのログイン状態の変更を監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const fetchDogImage = () => {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then((response) => response.json())
      .then((data: DogResponse) => {
        setDogImage(data.message);
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
    const timerId = setInterval(() => {
      setFeed((prevFeed) => (prevFeed < 20 ? prevFeed + 1 : prevFeed));
      setTimer(10); // feedを増やした後にtimerをリセット
    }, 10000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  // 1秒ごとにtimerを減らす
  useEffect(() => {
    const countdownId = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(countdownId);
    };
  }, []);

  if (dogImage === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Random Dog Image</h1>
      <img className="dog-image" src={dogImage} alt="A random dog" />
      <p>
        Feed: {feed}/{maxFeed}
      </p>
      <p>Timer: {timer} Seconds</p> {/* timerの値を表示 */}
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
