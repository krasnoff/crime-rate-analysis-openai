"use client";

import Link from "next/link";
import { useDisplayMode, useIsChatGptApp, useMaxHeight, useRequestDisplayMode, useWidgetProps } from "../hooks";
import { useEffect } from "react";
import { Forcast } from "../components/forcast";

export default function HomePage() {
  const toolOutput = useWidgetProps<{
    userQuery: string,
    forcast: any,
    timestamp: string,
  }>();
  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();
  const requestDisplayMode = useRequestDisplayMode();
  const isChatGptApp = useIsChatGptApp();

  const name = toolOutput?.forcast?.list || null;

  useEffect(() => {
    console.log('genrated SQL Query:', toolOutput?.forcast);
  }, [toolOutput]);
  
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      {name ? (<div>
        <h1 className="text-2xl font-bold mb-4">Weather Forecast Data</h1>
        <Forcast {...toolOutput?.forcast} />
      </div>) : (
        <div>No forcast data available.</div>
      )}
    </div>
  );
}
