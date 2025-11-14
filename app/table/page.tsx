"use client";

import Link from "next/link";
import { useDisplayMode, useIsChatGptApp, useMaxHeight, useRequestDisplayMode, useWidgetProps } from "../hooks";
import { useEffect } from "react";

export default function HomePage() {
  const toolOutput = useWidgetProps<{
    name?: string;
    result?: { structuredContent?: { name?: string } };
  }>();
  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();
  const requestDisplayMode = useRequestDisplayMode();
  const isChatGptApp = useIsChatGptApp();

  const name = toolOutput?.result?.structuredContent?.name || toolOutput?.name;

  useEffect(() => {
    console.log('genrated SQL Query:', name, toolOutput);
  }, [name, toolOutput]);
  
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-black tracking-tight">Welcome</h1>
        <p className="font-mono text-sm/6 text-center sm:text-left tracking-[-.01em] max-w-xl">
          This is a client-side rendered page demonstrating navigation in your ChatGPT app.
        </p>
        <Link 
          href="/"
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        >
          Go to the main page
        </Link>
        this is the generated SQL Query:<br />
        {name && <pre className="font-mono text-sm text-center sm:text-left max-w-xl">{name}</pre>}
      </main>
    </div>
  );
}
