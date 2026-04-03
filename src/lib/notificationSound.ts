let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioContext) {
      audioContext = new AudioContext();
    }
    return audioContext;
  } catch {
    return null;
  }
}

export function playNotificationSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(880, now);
  osc1.frequency.setValueAtTime(1174.66, now + 0.1);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1174.66, now + 0.1);
  osc2.frequency.setValueAtTime(1318.51, now + 0.2);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.2);
  gain.gain.linearRampToValueAtTime(0, now + 0.35);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc1.stop(now + 0.15);
  osc2.start(now + 0.1);
  osc2.stop(now + 0.35);
}
