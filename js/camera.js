/* =========================================================================
   camera.js — Captura fotográfica exclusivamente en vivo (getUserMedia).
   Deliberadamente NO se usa <input type="file"> para impedir que el
   usuario adjunte una imagen desde la galería: solo puede fotografiar
   en el momento, como exige el registro de novedades ML.
   ========================================================================= */
const Cam = {
  stream: null,

  async start(videoEl, facingMode = 'environment') {
    this.stop();
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: facingMode } },
      audio: false
    });
    videoEl.srcObject = this.stream;
    await videoEl.play();
  },

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  },

  /* Toma el cuadro actual del <video>, lo reescala (máx. 1280px) y
     lo comprime a JPEG para no saturar IndexedDB en jornadas largas. */
  snapshot(videoEl, maxDim = 1280, quality = 0.62) {
    const vw = videoEl.videoWidth, vh = videoEl.videoHeight;
    const scale = Math.min(1, maxDim / Math.max(vw, vh));
    const cw = Math.round(vw * scale), ch = Math.round(vh * scale);
    const canvas = document.createElement('canvas');
    canvas.width = cw; canvas.height = ch;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoEl, 0, 0, cw, ch);
    return canvas.toDataURL('image/jpeg', quality);
  }
};
