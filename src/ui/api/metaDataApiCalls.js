export const getUserNFTs = async (userAddress) => {
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

export const transferNFT = async (ID, body) => {
  const response = await axios.post(
    `https://mathomhouse.mynft.com/api/nfts/transferNFT/${ID}`,
    body,
    { headers: { "Content-Type": "application/json" } }
  );

  return response;
};
