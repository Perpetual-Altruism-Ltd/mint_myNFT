// import { getMetaDataUrI } from "../js/myWeb3.js";

export const getUserMetadata = async (userAddress) => {
  const respone = await axios.get(
    `https://mathomhouse.mynft.com/api/nfts/publicKey/${userAddress}`
  );
  return respone;
};

export const addMetaData = async (body) => {
  const response = await axios.post(
    `https://mathomhouse.mynft.com/api/nfts/addMetadata/uploadFile`,
    body
  );
  return response;
};
