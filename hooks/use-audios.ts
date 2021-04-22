import { useEffect, useState } from "react";
import { storage } from "../components/firebase";

export const useAudios = () => {
  const [audios, setAudios] = useState([]);

  const storageRef = storage.ref();

  useEffect(() => {
    const getDownloadURLs = async () => {
      let response = await storageRef.listAll();
      let audioUrls = [];

      // for (let item of response.items) {
      //   console.log("downloading: ", item.name);
      //   // let url = await item.getDownloadURL();
      //   audioUrls.push({ url, nombre: item.name.split(".")[0] });
      // }
      setAudios(response.items);
    };

    audios.length == 0 && getDownloadURLs();
  }, []);

  return audios;
};
