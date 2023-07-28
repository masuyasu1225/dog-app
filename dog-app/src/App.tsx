import React, { useEffect, useState } from "react";

type DogResponse = {
  message: string;
  status: string;
};

function App() {
  const [dogImage, setDogImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then((response) => response.json())
      .then((data: DogResponse) => setDogImage(data.message))
      .catch((error) => console.log("Error:", error));
  }, []);

  if (dogImage === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Random Dog Image</h1>
      <img src={dogImage} alt="A random dog" />
    </div>
  );
}

export default App;
