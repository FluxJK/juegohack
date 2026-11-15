const fs = require('node:fs');
const path = require('node:path');

// La plaza. A soft electric-piano loop with sustained chords and a light bass.
const rate = 24000;
const beat = 60 / 74;
const progression = [
  [48, [55,59,62,64], [76,74,72,0,67,0]],
  [45, [55,59,60,64], [72,0,71,69,67,0]],
  [41, [53,57,60,64], [69,72,0,76,74,0]],
  [43, [55,57,59,62], [71,0,74,76,72,0]],
  [48, [55,59,62,64], [79,0,76,74,72,76]],
  [40, [55,59,62,67], [74,71,0,67,69,0]],
  [41, [53,57,60,64], [72,0,76,77,76,72]],
  [43, [55,57,60,62], [74,71,0,67,0,0]],
  [45, [55,59,60,64], [76,79,0,81,79,76]],
  [40, [55,59,62,67], [74,0,71,67,0,71]],
  [41, [53,57,60,64], [72,76,0,77,76,0]],
  [48, [55,59,62,64], [79,0,76,72,0,0]],
  [50, [53,57,60,64], [72,0,69,72,76,0]],
  [43, [53,57,59,62], [74,71,0,69,67,0]],
  [48, [55,59,62,64], [72,76,0,74,72,67]],
  [43, [55,57,60,62], [69,0,67,0,0,0]]
];
const frames = Math.round(progression.length * 4 * beat * rate);
const left = new Float32Array(frames);
const right = new Float32Array(frames);
const timeOffsets = [0, .7, 1.5, 2.3, 3, 3.55];

function note(pitch, start, length, amplitude, pan, instrument) {
  const phase = 2 * Math.PI * 440 * 2 ** ((pitch - 69) / 12);
  const offset = Math.round(start * rate);
  const attack = instrument === 'pad' ? .32 : .023;
  const release = instrument === 'pad' ? .58 : .86;
  const samples = Math.ceil((length + release) * rate);
  for (let sample = 0; sample < samples; sample++) {
    const time = sample / rate;
    const gain = Math.min(1,time / attack) * Math.exp(-Math.max(0,time-length) * 4.2);
    const angle = phase * time;
    let signal = Math.sin(angle);
    if (instrument === 'keys') {
      signal = Math.sin(angle + .38 * Math.sin(angle * 2.004) * Math.exp(-time * 3.8))
        + .17 * Math.sin(angle * 1.998) * Math.exp(-time * 2.9);
    }
    if (instrument === 'pad') signal = .76 * signal + .24 * Math.sin(angle * 1.0025);
    const value = gain * signal * amplitude;
    const position = (offset + sample) % frames;
    left[position] += value * (1 - pan) * .64;
    right[position] += value * (1 + pan) * .64;
    if (instrument === 'keys') {
      const echo = (position + Math.floor(rate * .28)) % frames;
      left[echo] += value * .085;
      right[echo] += value * .14;
    }
  }
}

progression.forEach(([bass, chord, lead], bar) => {
  const start = bar * 4 * beat;
  note(bass, start, 1.5 * beat, .13, -.13, 'bass');
  note(bass + 12, start + 2.5 * beat, .65 * beat, .075, -.08, 'bass');
  chord.forEach((pitch,index) => {
    note(pitch, start + index * .024, 3.33 * beat, .028, (index - 1.5) * .25, 'pad');
    note(pitch, start + (.15 + index * .35) * beat, .70 * beat, .05, -.3 + index * .18, 'keys');
  });
  lead.forEach((pitch,index) => {
    if (pitch) note(pitch, start + timeOffsets[index] * beat, .49 * beat, .128 - index * .008, .12, 'keys');
  });
});

const output = Buffer.alloc(44 + frames * 4);
output.write('RIFF');
output.writeUInt32LE(output.length - 8, 4);
output.write('WAVEfmt ', 8);
output.writeUInt32LE(16, 16);
output.writeUInt16LE(1, 20);
output.writeUInt16LE(2, 22);
output.writeUInt32LE(rate, 24);
output.writeUInt32LE(rate * 4, 28);
output.writeUInt16LE(4, 32);
output.writeUInt16LE(16, 34);
output.write('data', 36);
output.writeUInt32LE(frames * 4, 40);
for (let i = 0; i < frames; i++) {
  output.writeInt16LE(Math.round(Math.tanh(left[i] * 1.8) * 32767),44 + i * 4);
  output.writeInt16LE(Math.round(Math.tanh(right[i] * 1.8) * 32767),46 + i * 4);
}
const directory = path.resolve(__dirname, '../assets/audio');
fs.mkdirSync(directory,{recursive:true});
fs.writeFileSync(path.join(directory,'la-plaza.wav'),output);
