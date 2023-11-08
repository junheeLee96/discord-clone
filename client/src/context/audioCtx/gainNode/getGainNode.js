const getGainNode = (stream, audioCtx) => {
  if (!stream) return;
  const audioContext = audioCtx;
  // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);
  const gainNode = audioContext.createGain();
  var gainConnected = source.connect(gainNode);
  gainConnected.connect(audioContext.destination);

  return { gainNode };
};

export default getGainNode;
