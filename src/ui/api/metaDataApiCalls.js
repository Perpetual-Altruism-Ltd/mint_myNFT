export const getUserNFTs = async (userAddress) => {
  const respone = await axios.get(
    `https://api.mynft.com/mathomhouse/publicKey/${userAddress}`
  );

  return respone;
};

export const addMetaData = async (body) => {
  const response = await axios.post(
    `https://api.mynft.com/mathomhouse/addMetadata/uploadFile`,
    body
  );

  return response;
};

export const addMetaDataCloudkit = async () => {
  const response = await axios.get(`http://localhost:4000/addNFTCloudkit`);

  return response;
};
