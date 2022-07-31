import { useEffect, useRef, useState } from "react";
function TrackingScreen() {
  const [tracking, setTracking] = useState<boolean>();
  const [screenshots, setScreenShots] = useState<
    { createdAt: number; screenshot: string }[]
  >([]);
  const screenshotRef = useRef(screenshots);
  const timer = useRef<number>();
  const toggleTracking = () => {
    setTracking(!tracking);
  };
  useEffect(() => {
    console.log("in effect =", tracking);
    let destroyed = false;
    if (!destroyed && tracking !== undefined) {
      tracking ? startSharing() : stopSharing();
    }
    return () => {
      destroyed = true;
    };
  }, [tracking]);
  const startSharing = async () => {
    const video: any = document.getElementById("screenvideo");
    var displayMediaOptions = {
      video: {},
      audio: false,
    };
    try {
      video.srcObject = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );
      startCapturingRandomly();
    } catch (error) {
      console.log(error);
      setTracking(undefined);
    }
  };
  const stopSharing = () => {
    const video: any = document.getElementById("screenvideo");
    let tracks = video.srcObject.getTracks();
    tracks.forEach((track: { stop: () => any }) => track.stop());
    video.srcObject = null;
    if (timer.current !== null) {
      clearTimeout(timer.current);
    }
  };

  const startCapturingRandomly = () => {
    timer.current = setTimeout(function () {
      takeScreenCapture();
    }, Math.floor(Math.random() * 5000));
  };

  const takeScreenCapture = () => {
    if (!tracking) {
      if (timer.current) clearTimeout(timer.current);
      return;
    }
    const video: any = document.getElementById("screenvideo");
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURI = canvas.toDataURL("image/png");
      const scrObj = {
        createdAt: new Date().getTime(),
        screenshot: dataURI,
      };
      screenshotRef.current = [...screenshotRef.current, scrObj];
      setScreenShots(screenshotRef.current);
      timer.current = setTimeout(function () {
        takeScreenCapture();
      }, Math.floor(Math.random() * 5000));
    }
  };

  return (
    <div className="card auth-btns">
      <div>
        <button onClick={toggleTracking}>
          {!tracking ? "Start" : "Stop "} Tracking
        </button>
      </div>

      <h2>Screenshots</h2>
      <div className="screenshot-container">
        {screenshots.map((srcObj) => (
          <div className="screenshot-item" key={srcObj.createdAt}>
            <img src={srcObj.screenshot} />
            <p className="time">{new Date(srcObj.createdAt).toUTCString()}</p>
          </div>
        ))}
      </div>
      <div className="video-container">
        <video id="screenvideo" width="800" height="680" autoPlay></video>
      </div>
    </div>
  );
}

export default TrackingScreen;
