import React, { useEffect, useState } from "react";
import "./App.css";

type DogResponse = {
  message: string;
  status: string;
};

function App() {
  const [dogImage, setDogImage] = useState<string | null>(null);
  const [feed, setFeed] = useState(20);
  const [timer, setTimer] = useState(10);

  const fetchDogImage = () => {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then((response) => response.json())
      .then((data: DogResponse) => {
        setDogImage(data.message);
        if (feed > 0) {
          setFeed(feed - 1);
        }
      })
      .catch((error) => console.log("Error:", error));
  };

  useEffect(fetchDogImage, []);

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
      <p>Feed: {feed}</p>
      <p>Timer: {timer} seconds</p> {/* timerの値を表示 */}
      <button onClick={fetchDogImage} disabled={feed <= 0}>
        Get new dog
      </button>
    </div>
  );
}

export default App;
