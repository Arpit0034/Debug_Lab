export interface RecordedAudio {
  base64: string;
  mimeType: string;
  durationMs: number;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private startedAt = 0;

  static isSupported(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      typeof navigator.mediaDevices !== 'undefined' &&
      typeof MediaRecorder !== 'undefined'
    );
  }

  async start(): Promise<void> {
    if (!AudioRecorder.isSupported()) {
      throw new Error('Audio recording is not supported in this browser.');
    }
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg',
    ];
    const mimeType = candidates.find((t) => MediaRecorder.isTypeSupported(t)) || '';
    this.mediaRecorder = new MediaRecorder(
      this.stream,
      mimeType ? { mimeType } : undefined,
    );
    this.chunks = [];
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    this.startedAt = Date.now();
    this.mediaRecorder.start();
  }

  async stop(): Promise<RecordedAudio> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Not recording'));
        return;
      }
      const durationMs = Date.now() - this.startedAt;
      const rec = this.mediaRecorder;
      rec.onstop = async () => {
        try {
          const blob = new Blob(this.chunks, {
            type: rec.mimeType || 'audio/webm',
          });
          const buffer = await blob.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          let binary = '';
          const step = 0x8000;
          for (let i = 0; i < bytes.length; i += step) {
            binary += String.fromCharCode.apply(
              null,
              Array.from(bytes.subarray(i, i + step)),
            );
          }
          const base64 = btoa(binary);
          this.stream?.getTracks().forEach((t) => t.stop());
          this.mediaRecorder = null;
          this.stream = null;
          this.chunks = [];
          resolve({
            base64,
            mimeType: blob.type || 'audio/webm',
            durationMs,
          });
        } catch (err) {
          reject(err);
        }
      };
      rec.stop();
    });
  }

  abort(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
    this.stream?.getTracks().forEach((t) => t.stop());
    this.mediaRecorder = null;
    this.stream = null;
    this.chunks = [];
  }
}
