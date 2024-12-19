import React, { useEffect, useState } from "react";
import { getVideo, videoExists } from "./utils/db";
import VideoPlayer from "./components/VideoPlayer";
import "./App.css"; // Add a CSS file for styling

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [downloadedVideos, setDownloadedVideos] = useState<
    { id: string; blobUrl: string }[]
  >([]);
  const onlineVideos = [
    { id: "video1", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: "video2", url: "https://www.w3schools.com/html/movie.mp4" },
  ];

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const loadDownloadedVideos = async () => {
      const availableVideos = [];

      for (const video of onlineVideos) {
        if (await videoExists(video.id)) {
          const savedVideo = await getVideo(video.id);
          if (savedVideo) {
            const blobUrl = URL.createObjectURL(savedVideo);
            availableVideos.push({ id: video.id, blobUrl });
          }
        }
      }

      setDownloadedVideos(availableVideos);
    };

    loadDownloadedVideos();
  }, [isOnline]);

  return (
    <div className="app-container">
      <h1 className="app-title">PWA Video Downloader</h1>
      {isOnline ? (
        <div className="video-grid">
          {onlineVideos.map((video) => (
            <VideoPlayer
              key={video.id}
              videoUrl={video.url}
              videoId={video.id}
              hideDownload={downloadedVideos.some((v) => v.id === video.id)}
            />
          ))}
        </div>
      ) : (
        <div className="video-grid">
          {downloadedVideos.length > 0 ? (
            downloadedVideos.map((video) => (
              <VideoPlayer
                key={video.id}
                videoUrl={video.blobUrl}
                videoId={video.id}
                hideDownload={true}
              />
            ))
          ) : (
            <p className="no-videos-message">
              No videos available offline. Please download videos while online.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
