type NotificationSoundType = "default" | "alert";

let audioContext: AudioContext | null = null;

export async function unlockNotificationSound() {
  const context = getAudioContext();

  if (context.state === "suspended") {
    await context.resume();
  }

  playSilentTone(context);
}

export function playNotificationSound(soundType: NotificationSoundType) {
  const context = getAudioContext();

  if (context.state === "suspended") {
    throw new Error("Audio context is suspended.");
  }

  if (soundType === "alert") {
    playAlertSound(context);
    return;
  }

  playDefaultSound(context);
}

function getAudioContext() {
  if (audioContext) {
    return audioContext;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  audioContext = new AudioContextClass();

  return audioContext;
}

function playDefaultSound(context: AudioContext) {
  playTone(context, 660, 0);
  playTone(context, 880, 0.16);
}

function playAlertSound(context: AudioContext) {
  playTone(context, 880, 0);
  playTone(context, 660, 0.14);
  playTone(context, 880, 0.28);
}

function playSilentTone(context: AudioContext) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 440;

  gainNode.gain.setValueAtTime(0.0001, context.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.01);
}

function playTone(
  context: AudioContext,
  frequency: number,
  startDelay: number
) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(0.0001, context.currentTime + startDelay);
  gainNode.gain.exponentialRampToValueAtTime(
    0.18,
    context.currentTime + startDelay + 0.02
  );
  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime + startDelay + 0.14
  );

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(context.currentTime + startDelay);
  oscillator.stop(context.currentTime + startDelay + 0.16);
}