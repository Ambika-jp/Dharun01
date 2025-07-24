const video = document.getElementById('videoElement');
const canvas = document.getElementById('canvasElement');
const ctx = canvas.getContext('2d');
const framesDiv = document.getElementById('frames');
let frameImages = [];

async function extractFrames() {
  const file = document.getElementById('videoInput').files[0];
  const fps = parseInt(document.getElementById('fps').value) || 1;
  if (!file) return alert("Please select a video.");

  video.src = URL.createObjectURL(file);
  await video.play();  // Trigger load
  video.pause();

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const duration = video.duration;
  const totalFrames = Math.floor(duration * fps);
  frameImages = [];

  for (let i = 0; i < totalFrames; i++) {
    video.currentTime = i / fps;
    await new Promise(res => video.onseeked = res);

    ctx.drawImage(video, 0, 0);
    const imgData = canvas.toDataURL('image/jpeg');

    frameImages.push(imgData);
    displayFrame(imgData, i + 1);

    document.getElementById('progressBar').value = ((i + 1) / totalFrames) * 100;
  }
}

function displayFrame(data, index) {
  const container = document.createElement('div');
  const img = new Image();
  img.src = data;

  const link = document.createElement('a');
  link.href = data;
  link.download = `frame_${index}.jpg`;
  link.textContent = "Download";
  link.style.display = "block";

  container.appendChild(img);
  container.appendChild(link);
  framesDiv.appendChild(container);
}

async function downloadAll() {
  const zip = new JSZip();
  frameImages.forEach((data, i) => {
    zip.file(`frame_${i + 1}.jpg`, data.split(',')[1], { base64: true });
  });
  const blob = await zip.generateAsync({ type: "blob" });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'frames.zip';
  link.click();
}
