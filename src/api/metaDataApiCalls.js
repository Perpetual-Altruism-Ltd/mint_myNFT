export const getAllMetaData = async () => {
  const respone = await fetch(`http://localhost:3005/api/metadata/`, {
    method: "GET",
  });

  const nftResult = await respone.json();

  return nftResult;
};
