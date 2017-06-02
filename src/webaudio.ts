export default class WebAudio {
  public audioContext: any;

  public constructor() {

    try {
      this.audioContext = new AudioContext();
    } catch (_) {}
  }

  public writeInt(samples) {
    // takes the Array of integers from papu.ts
    if (this.audioContext) {
      const source = this.audioContext.createBufferSource();
      source.loop = false;
      source.buffer = this.audioContext.createBuffer(1, samples.length, samples.length * 4);
      let aux = source.buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++) {
        aux[i] = samples[i] / 32768;
      }
      source.connect(this.audioContext.destination);
      source.start(0);
    }
  }
}
