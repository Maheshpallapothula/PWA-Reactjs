import React, { useEffect, useState } from "react";
import { saveVideo, getVideo, videoExists } from "../utils/db";
import { fetchVideoFromProxy } from "../utils/downloader";
import "./VideoPlayer.css"; // Add a CSS file for styling

interface VideoPlayerProps {
  videoUrl: string;
  videoId: string;
  hideDownload?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  videoId,
  hideDownload = false,
}) => {
  const [videoSrc, setVideoSrc] = useState<string>(videoUrl);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);

  useEffect(() => {
    const loadDownloadedVideo = async () => {
      if (await videoExists(videoId)) {
        const savedVideo = await getVideo(videoId);
        if (savedVideo) {
          const blobUrl = URL.createObjectURL(savedVideo);
          setVideoSrc(blobUrl);
          setIsDownloaded(true);
        }
      }
    };

    loadDownloadedVideo();
  }, [videoId]);

  const downloadVideo = async () => {
    try {
      const videoBlob = await fetchVideoFromProxy(videoUrl);
      await saveVideo(videoId, videoBlob);
      const blobUrl = URL.createObjectURL(videoBlob);
      setVideoSrc(blobUrl);
      setIsDownloaded(true);
    } catch (error) {
      console.error("Error downloading the video:", error);
    }
  };

  return (
    <div className="video-card">
      <video
        src={videoSrc}
        controls
        className="video-player"
        onError={() => console.error("Error loading video.")}
      />
      <div className="video-details">
        {!hideDownload && !isDownloaded && (
          <button className="download-button" onClick={downloadVideo}>
            Download Video
          </button>
        )}
        {isDownloaded && (
          <p className="download-status">Downloaded for offline use</p>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
