import { useState } from "react";

function ImageWithSpinner({ imageUrl }: { imageUrl?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden border-y-2 border-black">
      {/* Spinner */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
        </div>
      )}

      {/* Image */}
      <img
        src={imageUrl || "https://via.placeholder.com/150"}
        alt="Card Image"
        className={`aspect-4/3 w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)} // avoid infinite spinner on error
      />
    </div>
  );
}

export default ImageWithSpinner;