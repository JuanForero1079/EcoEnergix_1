import { useState } from "react";
import { MagicMotion, MagicCard } from "react-magic-motion";
import "react-magic-motion/card.css";

const products = [
  {
    id: 1,
    title: "Panel Solar A",
    imgSrc:
      "https://react-magic-motion.nyc3.cdn.digitaloceanspaces.com/examples/search/song-of-ice-and-fire.jpeg",
    description: "Alta eficiencia y durabilidad."
  },
  {
    id: 2,
    title: "Panel Solar B",
    imgSrc:
      "https://react-magic-motion.nyc3.cdn.digitaloceanspaces.com/examples/search/the-name-of-the-wind.jpeg",
    description: "Ideal para hogares pequeños."
  },
  {
    id: 3,
    title: "Inversor Solar",
    imgSrc:
      "https://react-magic-motion.nyc3.cdn.digitaloceanspaces.com/examples/search/the-way-of-kings.png",
    description: "Convierte la energía solar en electricidad utilizable."
  }
];

export default function Catalog() {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold text-center mb-6">Catálogo</h2>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-4 py-2 rounded-lg w-80 text-black"
        />
      </div>

      <MagicMotion>
        <div className="flex flex-wrap gap-6 justify-center">
          {products
            .filter(({ title }) =>
              title.toLowerCase().includes(searchText.toLowerCase())
            )
            .map(({ id, title, imgSrc, description }) => (
              <MagicCard
                key={id}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-64 bg-white/20 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden"
              >
                <img
                  src={imgSrc}
                  alt={title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="text-sm text-white/80">{description}</p>
                </div>
              </MagicCard>
            ))}
        </div>
      </MagicMotion>
    </div>
  );
}

