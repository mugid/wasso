"use client";

import { getGeneratedWords } from "./api/generate/route";

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        Here you will see stunning starting page<br/>
        <button onClick={getGeneratedWords}>click</button>
      </div>
    </div>
  );
}
