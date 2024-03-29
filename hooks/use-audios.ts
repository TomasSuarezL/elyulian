import { useEffect, useState } from "react";
import { databaseRef, storageRef } from "../components/firebase";
import { getDownloadURL, listAll } from "firebase/storage";
import { child, get, onValue, set } from "firebase/database";

interface AudioDB {
  [key: string]: Audio;
}
export interface Audio {
  name: string;
  url: string;
  downloads: string;
  reproductions: string;
}

export const useAudios = () => {
  const [audios, setAudios] = useState<Audio[]>([]);

  useEffect(() => {
    const getStorageAudios = async () => {
      let response = await listAll(storageRef);
      return response.items;
    };

    const getDatabaseAudios = async () => {
      const audiosDB = await get(databaseRef);
      return audiosDB.val() ?? {};
    };

    const syncAudios = async () => {
      let fromStorage = await getStorageAudios();
      const fromDB = await getDatabaseAudios();

      for (let audio of fromStorage) {
        if (!fromDB[audio.name.replace(".ogg", "")]) {
          const url = await getDownloadURL(audio);

          set(child(databaseRef, audio.name.replace(".ogg", "")), {
            name: audio.name,
            url,
            reproductions: 0,
            downloads: 0,
          });
        }
      }
    };

    syncAudios();

    onValue(databaseRef, (snapshot) => {
      const data: AudioDB = snapshot.val();
      const audioArray = Object.values(data).sort((a, b) => {
        const totalInteractionsOfA = a.downloads + a.reproductions;
        const totalInteractionsOfB = b.downloads + b.reproductions;

        if (totalInteractionsOfA < totalInteractionsOfB) {
          return 1;
        }
        if (totalInteractionsOfA > totalInteractionsOfB) {
          return -1;
        }
        return 0;
      });

      setAudios(audioArray);
    });
  }, []);

  return audios;
};
