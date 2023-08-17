import React from "react";

type DogImageProps = {
  src: string;
  fadeIn: boolean;
};

const DogImage: React.FC<DogImageProps> = ({ src, fadeIn }) => {
  return (
    <img
      className={`dog-image ${fadeIn ? "fade-in" : ""}`}
      src={src}
      alt="A random dog"
    />
  );
};

export default DogImage;
