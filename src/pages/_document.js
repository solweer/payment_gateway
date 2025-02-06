import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased flex flex-col w-screen h-dvh bg-slate-200 p-6">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
