import React, { useEffect, useState } from "react";

type DogResponse = {
  message: string;
  status: string;
};

function App() {
  const [dogImage, setDogImage] = useState<string | null>(null);

  // APIから犬の画像を取得する関数
  const fetchDogImage = () => {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then((response) => response.json())
      .then((data: DogResponse) => setDogImage(data.message))
      .catch((error) => console.log("Error:", error));
  };

  // コンポーネントがマウントされたときに初めて画像を取得
  useEffect(fetchDogImage, []);

  // 画像がまだ読み込まれていない場合
  if (dogImage === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Random Dog Image</h1>
      <img src={dogImage} alt="A random dog" />
      <button onClick={fetchDogImage}>Dog</button>
    </div>
  );
}

export default App;
