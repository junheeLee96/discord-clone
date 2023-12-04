const getGainNode = (stream, audioCtx) => {
  if (!stream) return;
  const audioContext = audioCtx;
  // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.5;
  var gainConnected = source.connect(gainNode);
  gainConnected.connect(audioContext.destination);

  return { gainNode };
};

export default getGainNode;
