import "react-h5-audio-player/lib/styles.css";
import React, { useState, useRef } from "react";
import Head from "next/head";
import AudioPlayer from "react-h5-audio-player";
import { HiDownload } from "react-icons/hi";
import { useAudios } from "../hooks/use-audios";
import { database, databaseRef } from "../components/firebase";
import fileDownload from "js-file-download";
import { child, update } from "firebase/database";

export default function Home() {
  const player = useRef();
  const audios = useAudios();
  const [selectedAudio, setSelectedAudio] = useState(null);

  return (
    <div className="h-screen home">
      <Head>
        <title>Yulify</title>
        <link rel="icon" href="/yulify.png" />
      </Head>

      <div className="fixed bottom-0 left-0 w-full h-1/5">
        <AudioPlayer
          src={selectedAudio?.url}
          ref={player}
          className="h-full"
          onPlay={() =>
            update(child(databaseRef, selectedAudio.name.replace(".ogg", "")), {
              ...selectedAudio,
              reproductions: selectedAudio.reproductions + 1,
            })
          }
          header={
            <div>
              <h3 className="p-2 break-words">{selectedAudio?.name ?? " - "}</h3>
            </div>
          }
        />
      </div>
      <main className="flex flex-col items-center p-4 overflow-auto bg-green-200 h-4/5 md:p-6 bg-opacity-40">
        <h5 className="text-3xl font-black text-green-900 md:text-6xl">Yulify</h5>
        <h3 className="text-lg text-green-900 md:text-xl">Contala como quieras</h3>
        {audios.length > 0 ? (
          <div className="flex flex-col w-full m-2 md:flex-row md:flex-wrap md:m-4">
            {audios.map((a) => {
              const { name, url, reproductions, downloads } = a;
              const nameWithoutExtension = name.replace(".ogg", "");
              return (
                <div
                  key={nameWithoutExtension}
                  className="flex-1 p-4 m-2 text-green-100 transition-colors bg-green-600 cursor-pointer md:min-w-max hover:bg-green-400"
                  onClick={async () => {
                    if (a.name === selectedAudio?.name) {
                      setSelectedAudio(a);
                      player.current.audio.current.play();
                    } else {
                      setSelectedAudio(a);
                    }
                  }}
                >
                  <div className="flex flex-row items-center justify-between">
                    <p className="break-words" style={{ wordBreak: "break-word" }}>
                      {nameWithoutExtension}
                    </p>
                    <button
                      className="p-2 ml-2 text-lg transition-colors bg-green-800 rounded hover:bg-green-600"
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const response = await fetch(url);
                          let blob = await response.blob();
                          fileDownload(blob, name);
                          update(child(databaseRef, nameWithoutExtension), {
                            ...a,
                            downloads: downloads + 1,
                          });
                        } catch (e) {
                          console.error(e.message);
                        }
                        console.log(name);
                      }}
                    >
                      <HiDownload />
                    </button>
                  </div>
                  <div className="flex flex-col mt-2 sm:flex-row">
                    <p className="text-sm font-light  sm:mr-2">Reproducciones: {reproductions}</p>
                    <p className="text-sm font-light">Descargas: {downloads}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>Cargando...</div>
        )}
      </main>

      <footer className=""></footer>
    </div>
  );
}
