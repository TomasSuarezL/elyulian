import { useEffect, useState } from "react";
import { storage, database } from "../components/firebase";

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

  const storageRef = storage.ref();
  const databaseRef = database.ref("audios");

  useEffect(() => {
    const getStorageAudios = async () => {
      let response = await storageRef.listAll();
      return response.items;
    };

    const getDatabaseAudios = async () => {
      const audiosDB = await databaseRef.once("value");
      return audiosDB.val() ?? {};
    };

    const syncAudios = async () => {
      let fromStorage = await getStorageAudios();
      const fromDB = await getDatabaseAudios();

      for (let audio of fromStorage) {
        if (!fromDB[audio.name.replace(".ogg", "")]) {
          const url = await audio.getDownloadURL();
          database.ref("audios/" + audio.name.replace(".ogg", "")).set({
            name: audio.name,
            url,
            reproductions: 0,
            downloads: 0,
          });
        }
      }
    };

    syncAudios();

    databaseRef.on("value", (snapshot) => {
      const data: AudioDB = snapshot.val();
      console.log("data: ", data);
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
