const startPlayback = async () => {
  const video = document.getElementById("video");

  const mp4Uri = "./BigBuckBunny.mp4";
  const mimeCodec = 'video/mp4; codecs="avc1.4d4032"';

  if (!MediaSource.isTypeSupported(mimeCodec)) {
    console.error("Unsupported media format");
    return;
  }

  const mediaSource = new MediaSource(); // mediaSource.readyState === 'closed'
  const url = window.URL.createObjectURL(mediaSource);
  video.src = url;

  async function onSourceOpen() {
    const mediaSource = this;
    URL.revokeObjectURL(video.src); // Revoke Object URL for garbage collection

    const mp4Response = await fetch(mp4Uri);
    const mp4VideoData = await mp4Response.arrayBuffer();

    const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    sourceBuffer.addEventListener("updateend", function () {
      if (mediaSource.readyState === "open") {
        mediaSource.endOfStream();
      }
    });

    sourceBuffer.appendBuffer(mp4VideoData);
  }

  mediaSource.addEventListener("sourceopen", onSourceOpen.bind(mediaSource));
};

startPlayback();
