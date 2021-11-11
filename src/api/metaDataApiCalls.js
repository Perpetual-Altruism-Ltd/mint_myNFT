import { getMetaDataUrI } from "../ui/js/myWeb3.js";

export const getAllMetaData = async (tokenId) => {
  const url = await getMetaDataUrI(tokenId);
  const respone = await fetch(url, {
    method: "GET",
  });

  const nftResult = await respone.json();

  return nftResult;
};

export const addMetaData = async (body) => {
  const response = await fetch(`http://localhost:3005/api/metadata/`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
  return response;
};
