type NotificationSoundType = "default" | "alert";

export function playNotificationSound(soundType: NotificationSoundType) {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  const audioContext = new AudioContextClass();

  if (soundType === "alert") {
    playAlertSound(audioContext);
    return;
  }

  playDefaultSound(audioContext);
}

function playDefaultSound(audioContext: AudioContext) {
  playTone(audioContext, 660, 0);
  playTone(audioContext, 880, 0.16);
}

function playAlertSound(audioContext: AudioContext) {
  playTone(audioContext, 880, 0);
  playTone(audioContext, 660, 0.14);
  playTone(audioContext, 880, 0.28);
}

function playTone(
  audioContext: AudioContext,
  frequency: number,
  startDelay: number
) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime + startDelay);
  gainNode.gain.exponentialRampToValueAtTime(
    0.18,
    audioContext.currentTime + startDelay + 0.02
  );
  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    audioContext.currentTime + startDelay + 0.14
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(audioContext.currentTime + startDelay);
  oscillator.stop(audioContext.currentTime + startDelay + 0.16);
}