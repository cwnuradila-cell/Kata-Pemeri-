// Text-to-Speech utility for Cikgu Eva with synchronized speech animation callbacks

export interface SpeechCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

class TextToSpeechManager {
  private synth: SpeechSynthesis | null = null;
  private isVoiceEnabled: boolean = true;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public toggleVoice(enabled?: boolean): boolean {
    this.isVoiceEnabled = enabled !== undefined ? enabled : !this.isVoiceEnabled;
    if (!this.isVoiceEnabled) {
      this.stop();
    }
    return this.isVoiceEnabled;
  }

  public isEnabled(): boolean {
    return this.isVoiceEnabled;
  }

  public speak(text: string, callbacks?: SpeechCallbacks) {
    if (!this.synth || !this.isVoiceEnabled) {
      callbacks?.onStart?.();
      // Simulate speaking duration based on length if speech synth disabled or unavailable
      const duration = Math.min(Math.max(text.length * 45, 1200), 5000);
      setTimeout(() => {
        callbacks?.onEnd?.();
      }, duration);
      return;
    }

    try {
      this.synth.cancel(); // Stop any ongoing speech

      // Clean markdown stars, hashtags, or bracket notes for clearer audio
      const cleanText = text
        .replace(/[*_#`~]/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\(.*?\)/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;

      // Select best voice: Malay (ms-MY) -> Indonesian (id-ID) -> Default
      const voices = this.synth.getVoices();
      const malayVoice = voices.find((v) => v.lang.startsWith('ms') || v.lang.includes('MY'));
      const indoVoice = voices.find((v) => v.lang.startsWith('id') || v.lang.includes('ID'));

      if (malayVoice) {
        utterance.voice = malayVoice;
        utterance.lang = 'ms-MY';
      } else if (indoVoice) {
        utterance.voice = indoVoice;
        utterance.lang = 'id-ID';
      } else {
        utterance.lang = 'ms-MY';
      }

      // Friendly cute robot pitch & rate
      utterance.pitch = 1.15;
      utterance.rate = 0.95;

      utterance.onstart = () => {
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        callbacks?.onEnd?.();
      };

      utterance.onerror = () => {
        callbacks?.onError?.();
        callbacks?.onEnd?.();
      };

      this.synth.speak(utterance);
    } catch {
      callbacks?.onEnd?.();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const ttsManager = new TextToSpeechManager();
