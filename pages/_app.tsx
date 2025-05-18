import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from 'next/dynamic';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}
