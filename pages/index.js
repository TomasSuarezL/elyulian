import React, { useState } from "react";
import Head from "next/head";
import { useAudios } from "../hooks/use-audios";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export default function Home() {
  const audios = useAudios();
  const [selectedAudio, setSelectedAudio] = useState(null);

  return (
    <div className="h-screen home">
      <Head>
        <title>Yulify</title>
        <link rel="icon" href="/yulify.png" />
      </Head>

      <div className="fixed bottom-0 left-0 w-full">
        <AudioPlayer
          src={selectedAudio?.url}
          header={
            <div>
              <h3 className="p-2 break-words">{selectedAudio?.name ?? " - "}</h3>
            </div>
          }
        />
      </div>
      <main className="flex flex-col items-center h-full p-4 overflow-auto bg-green-200 md:p-6 bg-opacity-40">
        <h5 className="text-3xl font-black text-green-900 md:text-6xl">Yulify</h5>
        <h3 className="text-lg text-green-900 md:text-xl">Contala como quieras</h3>
        {audios.length ? (
          <div className="flex flex-col w-full m-2 md:flex-row md:flex-wrap md:m-4">
            {audios.map((a) => (
              <div
                key={a.name}
                className="flex-1 p-4 m-2 break-words bg-green-200 cursor-pointer hover:bg-green-400"
                onClick={async () => {
                  let url = await a.getDownloadURL();
                  setSelectedAudio({ name: a.name.split(".")[0], url });
                }}
              >
                {a.name.split(".")[0]}
              </div>
            ))}
          </div>
        ) : (
          <div>Cargando...</div>
        )}
      </main>

      <footer className=""></footer>
    </div>
  );
}
