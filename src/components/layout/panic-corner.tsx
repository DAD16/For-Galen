"use client";

const ESCAPE_SITES = [
  "https://en.wikipedia.org/wiki/Cat",
  "https://www.boredpanda.com/cute-cats/",
  "https://www.artoftea.com/blogs/tea-101",
  "https://en.wikipedia.org/wiki/History_of_tea",
  "https://www.weather.com/",
  "https://www.allrecipes.com/recipe/23891/grilled-cheese-sandwich/",
  "https://en.wikipedia.org/wiki/List_of_reportedly_haunted_locations",
  "https://www.google.com/maps/@27.1751,-78.0421,17z",
  "https://en.wikipedia.org/wiki/Rubber_duck_debugging",
  "https://www.youtube.com/watch?v=J---aiyznGQ",
];

function getRandomSite() {
  return ESCAPE_SITES[Math.floor(Math.random() * ESCAPE_SITES.length)];
}

export function PanicCorner() {
  return (
    <div
      className="fixed right-0 top-0 z-[9999] h-3 w-12 cursor-default"
      onMouseEnter={() => {
        window.location.href = getRandomSite();
      }}
      aria-hidden="true"
    />
  );
}
