export const getUserNFTs = async (userAddress) => {
  const respone = await axios.get(
    `https://api.mynft.com/mathomhouse/ERC721/owner/${userAddress}`
  );

  return respone;
};

export const addMetaData = async (body) => {
  const response = await axios.post(
    `https://api.mynft.com/mathomhouse/ERC721/uploadERC721MetadataToIPFS`,
    body
  );

  return response;
};
