import React, { useEffect, useState } from "react";
import "./App.css";

type DogResponse = {
  message: string;
  status: string;
};

function App() {
  const [dogImage, setDogImage] = useState<string | null>(null);
  const [feed, setFeed] = useState(10); // feed stateを追加

  // APIから犬の画像を取得する関数
  const fetchDogImage = () => {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then((response) => response.json())
      .then((data: DogResponse) => {
        setDogImage(data.message);
        setFeed(feed - 1); // feedを1つ減らす
      })
      .catch((error) => console.log("Error:", error));
  };

  // コンポーネントがマウントされたときに初めて画像を取得
  useEffect(fetchDogImage, []);

  // 画像がまだ読み込まれていない場合
  if (dogImage === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dog">
      <h1>Random Dog Image</h1>
      <img className="dog-image" src={dogImage} alt="A random dog" />
      <p>Feed: {feed}</p> {/* feedの値を表示 */}
      <button onClick={fetchDogImage} disabled={feed <= 0}>
        {" "}
        {/* feedが0のときボタンを無効化 */}
        Dog
      </button>
    </div>
  );
}

export default App;
