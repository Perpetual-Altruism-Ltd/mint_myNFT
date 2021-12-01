// import { getMetaDataUrI } from "../js/myWeb3.js";

export const getUserMetadata = async (userAddress) => {
  const respone = await fetch(
    `https://mathomhouse.mynft.com/api/nfts/publicKey/${userAddress}`,
    {
      method: "GET",
    }
  );
  return respone;
};

export const addMetaData = async (body) => {
  const response = await fetch(
    `https://mathomhouse.mynft.com/api/nfts/addMetadata/uploadFile`,
    {
      method: "POST",
      body: body,
    }
  );
  return response;
};
