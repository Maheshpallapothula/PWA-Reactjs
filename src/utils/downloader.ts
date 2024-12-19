export const fetchVideoFromProxy = async (videoUrl: string): Promise<Blob> => {
  const proxyUrl = `http://localhost:4000/download?url=${encodeURIComponent(
    videoUrl
  )}`;
  const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error("Failed to download video from proxy");
  }

  return response.blob();
};
