"use client";

import { useState, useEffect } from "react";
import { getGeneratedWords } from "./api/generate/route";

export default function Home() {
  const [words, setWords] = useState<string[]>([]);

  const handleClick = async () => {
    const response = await getGeneratedWords("hello");
    setWords([response.object.word]);
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        Here you will see stunning starting page<br/>
        <button onClick={handleClick}>click</button>
        <h1>{words}</h1>
      </div>
    </div>
  );
}
