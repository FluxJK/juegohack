(() => {
  'use strict';

  const voices = {
    mateo: 172, vargas: 112, elena: 295, julian: 203, marcos: 139,
    sofia: 430, sicario: 151, guard: 128, narrador: 95
  };

  // Gain and filter cutoff by location for rain and air, followed by electrical hum.
  const locations = {
    bridge:     { rain: [.24, 2600], air: [.23, 300], hum: 0,     event: 'radio', score: 'street' },
    kitchen:    { rain: [.07, 680],  air: [.04, 280], hum: .014,  event: 'clock', score: 'home' },
    minimarket: { rain: [.05, 560],  air: [.06, 720], hum: .03,   event: 'register', score: 'street' },
    office:     { rain: [.06, 620],  air: [.08, 360], hum: .012,  event: 'radio', score: 'investigation' },
    archive:    { rain: [.03, 370],  air: [.09, 290], hum: .023,  event: 'cabinet', score: 'investigation' },
    garage:     { rain: [.12, 1250], air: [.15, 530], hum: .034,  event: 'metal', score: 'investigation' },
    school:     { rain: [.13, 1810], air: [.21, 520], hum: 0,     event: 'wind', score: 'street' },
    warehouse:  { rain: [.16, 1800], air: [.24, 260], hum: .027,  event: 'horn', score: 'investigation' },
    cafe:       { rain: [.07, 750],  air: [.16, 800], hum: .009,  event: 'cup', score: 'home' }
  };

  // Each bar contains a bass note, a chord and eight eighth-note positions.
  // Zero marks a rest. Notes are MIDI pitches.
  const scores = {
    street: { bpm: 76, voice: 'triangle', bars: [
      [45, [57, 60, 64, 71], [0, 76, 0, 72, 0, 71, 69, 0]],
      [41, [53, 57, 60, 64], [0, 72, 0, 69, 0, 67, 0, 0]],
      [48, [55, 60, 64, 67], [0, 76, 79, 0, 74, 0, 72, 0]],
      [40, [56, 59, 62, 64], [0, 71, 0, 68, 0, 64, 0, 0]]
    ] },
    home: { bpm: 70, voice: 'sine', bars: [
      [48, [55, 60, 64, 67], [72, 0, 76, 0, 79, 76, 0, 74]],
      [43, [55, 59, 62, 67], [71, 0, 74, 0, 76, 0, 74, 0]],
      [45, [57, 60, 64, 67], [72, 76, 0, 81, 79, 0, 76, 0]],
      [41, [53, 57, 60, 65], [77, 0, 76, 74, 72, 0, 0, 0]]
    ] },
    investigation: { bpm: 64, voice: 'triangle', bars: [
      [47, [54, 59, 62, 66], [0, 66, 0, 0, 62, 0, 61, 0]],
      [43, [55, 59, 62, 66], [0, 67, 0, 66, 0, 0, 0, 0]],
      [40, [52, 55, 59, 66], [0, 71, 0, 0, 67, 66, 0, 0]],
      [42, [54, 58, 61, 64], [0, 70, 0, 64, 61, 0, 0, 0]]
    ] },
    stealth: { bpm: 86, voice: 'sine', pulse: .025, bars: [
      [38, [50, 53, 57], [0, 0, 65, 0, 0, 64, 0, 0]],
      [39, [51, 54, 58], [0, 0, 66, 0, 0, 0, 61, 0]],
      [38, [50, 53, 57], [0, 0, 65, 0, 0, 64, 0, 0]],
      [33, [52, 55, 61], [0, 0, 67, 0, 64, 0, 0, 0]]
    ] },
    combat: { bpm: 112, voice: 'triangle', pulse: .068, bars: [
      [38, [50, 53, 57], [62, 0, 65, 0, 62, 0, 69, 65]],
      [34, [46, 53, 58], [65, 0, 62, 0, 58, 62, 65, 0]],
      [36, [48, 55, 60], [67, 0, 60, 67, 0, 65, 0, 64]],
      [33, [45, 52, 55, 61], [69, 0, 67, 0, 64, 61, 0, 0]]
    ] },
    escape: { bpm: 132, voice: 'triangle', pulse: .057, bars: [
      [40, [52, 55, 59], [64, 67, 71, 0, 67, 64, 0, 71]],
      [36, [48, 52, 55], [72, 71, 67, 0, 64, 67, 0, 0]],
      [38, [50, 54, 57], [66, 69, 74, 0, 69, 66, 0, 0]],
      [35, [47, 54, 57, 63], [71, 66, 63, 66, 69, 0, 63, 0]]
    ] },
    hope: { bpm: 76, voice: 'sine', bars: [
      [48, [55, 60, 64, 67], [72, 76, 79, 0, 84, 0, 83, 0]],
      [45, [57, 60, 64, 67], [81, 0, 79, 76, 72, 0, 76, 0]],
      [41, [53, 57, 60, 64], [77, 0, 76, 74, 72, 0, 69, 0]],
      [43, [55, 59, 62, 67], [71, 0, 74, 0, 72, 0, 0, 0]]
    ] },
    loss: { bpm: 56, voice: 'triangle', bars: [
      [45, [57, 60, 64], [72, 0, 71, 0, 69, 0, 0, 0]],
      [41, [53, 57, 60], [67, 0, 65, 0, 64, 0, 0, 0]],
      [38, [50, 53, 57], [65, 0, 64, 0, 62, 0, 0, 0]],
      [40, [52, 56, 59], [64, 0, 59, 0, 57, 0, 0, 0]]
    ] }
  };

  let ctx, master, rain, air, hum, noise;
  let scene = 'bridge';
  let mood = 'title';
  let track, musicBus, step, nextNote, nextEvent;
  let paused = true;
  let muted = false;
  const calm = document.getElementById('calm-music');
  const calmScene = () => ['explore','vn','inspect'].includes(mood);
  let musicUnlocked = false;
  let unlockingMusic = false;

  const audible = () => ctx?.state === 'running' && !paused && !muted && !document.hidden;
  const frequency = midi => 440 * 2 ** ((midi - 69) / 12);

  function syncCalm() {
    if (!calm || !musicUnlocked) return;
    if (!paused && !muted && !document.hidden && calmScene()) {
      calm.volume = .55;
      if (calm.paused) calm.play().catch(() => {});
    } else {
      calm.pause();
    }
  }

  function tuneVolume() {
    if (master) master.gain.setTargetAtTime(paused || muted ? 0 : .77, ctx.currentTime, .025);
    syncCalm();
  }

  function noiseLoop(type, offset) {
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const level = ctx.createGain();
    source.buffer = noise;
    source.loop = true;
    filter.type = type;
    filter.Q.value = .4;
    level.gain.value = 0;
    source.connect(filter);
    filter.connect(level);
    level.connect(master);
    source.start(0, offset);
    return { filter, level };
  }

  function tuneAmbience() {
    if (!ctx) return;
    const profile = locations[scene];
    const time = ctx.currentTime;
    for (const [layer, [volume, cutoff]] of [[rain, profile.rain], [air, profile.air]]) {
      layer.level.gain.setTargetAtTime(volume, time, .45);
      layer.filter.frequency.setTargetAtTime(cutoff, time, .45);
    }
    hum.gain.setTargetAtTime(profile.hum, time, .45);
    nextEvent = time + 3.5;
  }

  function tuneMusic() {
    syncCalm();
    if (!ctx) return;
    const next = calmScene() && musicUnlocked ? null : scores[mood] || scores[locations[scene].score];
    if (next === track) return;
    const time = ctx.currentTime;
    if (musicBus) {
      const previous = musicBus;
      previous.gain.setTargetAtTime(0, time, .09);
      setTimeout(() => previous.disconnect(), 480);
    }
    track = next;
    musicBus = null;
    if (!track) return;
    musicBus = ctx.createGain();
    musicBus.gain.value = 0;
    musicBus.gain.setTargetAtTime(.63, time, .13);
    musicBus.connect(master);
    step = 0;
    nextNote = time;
  }

  function init() {
    if (ctx) return;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    ctx = new Context();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    noise = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const samples = noise.getChannelData(0);
    let averaged = 0;
    for (let i = 0; i < samples.length; i++) {
      const sample = Math.random() * 2 - 1;
      averaged = averaged * .84 + sample * .16;
      samples[i] = (sample * .55 + averaged * .45) * .83;
    }
    rain = noiseLoop('bandpass', .1);
    air = noiseLoop('lowpass', 1.6);

    hum = ctx.createGain();
    hum.gain.value = 0;
    const current = ctx.createOscillator();
    current.type = 'triangle';
    current.frequency.value = 60;
    current.connect(hum);
    hum.connect(master);
    current.start();

    tuneAmbience();
    tuneMusic();
    tuneVolume();
    setInterval(schedule, 65);
  }

  function envelope(level, at, volume, attack, length) {
    level.gain.setValueAtTime(.0001, at);
    level.gain.exponentialRampToValueAtTime(volume, at + attack);
    level.gain.exponentialRampToValueAtTime(.0001, at + length);
  }

  function tone(hz, length, volume, type = 'sine', options = {}) {
    const { at = ctx.currentTime, bus = master, attack = .012, end = hz } = options;
    const oscillator = ctx.createOscillator();
    const level = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(hz, at);
    oscillator.frequency.exponentialRampToValueAtTime(end, at + length);
    envelope(level, at, volume, attack, length);
    oscillator.connect(level);
    level.connect(bus);
    oscillator.start(at);
    oscillator.stop(at + length + .02);
    oscillator.onended = () => { oscillator.disconnect(); level.disconnect(); };
  }

  function burst(cutoff, length, volume, at = ctx.currentTime, bus = master) {
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const level = ctx.createGain();
    source.buffer = noise;
    filter.type = 'bandpass';
    filter.frequency.value = cutoff;
    filter.Q.value = .65;
    envelope(level, at, volume, .008, length);
    source.connect(filter);
    filter.connect(level);
    level.connect(bus);
    source.start(at, Math.random() * .55, length);
    source.onended = () => { source.disconnect(); filter.disconnect(); level.disconnect(); };
  }

  function playStep(at, length) {
    const position = step % 8;
    const [bass, chord, melody] = track.bars[Math.floor(step / 8) % track.bars.length];
    const bus = musicBus;
    if (position === 0) {
      for (const note of chord) tone(frequency(note), length * 7.8, .029, 'sine', { at, bus, attack: .19 });
    }
    if (position === 0 || position === 4) {
      const note = position === 0 ? bass : bass + 12;
      tone(frequency(note), length * 3.6, position === 0 ? .13 : .078, 'triangle', { at, bus });
    }
    if (melody[position]) {
      const hz = frequency(melody[position]);
      tone(hz, length * 2.2, .096, track.voice, { at, bus });
      tone(hz * 2, length * .9, .021, 'sine', { at, bus });
    }
    if (track.pulse && position % 2 === 0) {
      tone(92, .18, track.pulse, 'sine', { at, bus, end: 42 });
      if (position % 4 === 2) burst(2700, .075, track.pulse, at, bus);
    }
  }

  function sceneSound(kind) {
    switch (kind) {
      case 'radio': burst(1800, .29, .13); tone(510, .20, .025, 'triangle'); break;
      case 'clock': tone(1350, .035, .031); break;
      case 'register': tone(820, .14, .037, 'triangle'); break;
      case 'cabinet': burst(310, .33, .13); break;
      case 'metal': tone(1040, .37, .029, 'triangle', { end: 1000 }); break;
      case 'wind': burst(460, 1.6, .16); break;
      case 'horn': tone(100, 1.5, .047, 'triangle', { attack: .25, end: 91 }); break;
      case 'cup': tone(1790, .22, .033); tone(2330, .17, .023); break;
    }
  }

  function schedule() {
    if (!audible()) return;
    const time = ctx.currentTime;
    if (track) {
      const eighth = 30 / track.bpm;
      nextNote = Math.max(nextNote, time);
      while (nextNote < time + .11) {
        playStep(nextNote, eighth);
        nextNote += eighth;
        step++;
      }
    }
    if (time >= nextEvent) {
      sceneSound(locations[scene].event);
      nextEvent = time + 6 + Math.random() * 8;
    }
  }

  function playEffect(kind) {
    if (!audible()) return;
    const time = ctx.currentTime;
    switch (kind) {
      case 'step': burst(scene === 'bridge' || scene === 'school' ? 670 : 370, .055, .14); break;
      case 'paper': burst(1850, .17, .19); break;
      case 'key': tone(1440, .15, .052); tone(1980, .21, .035, 'sine', { at: time + .035 }); break;
      case 'switch': burst(1200, .05, .17); break;
      case 'success': tone(392, .24, .075); tone(587.3, .4, .073, 'triangle', { at: time + .11 }); break;
      case 'shot': burst(800, .22, .32); tone(140, .17, .14, 'triangle', { end: 38 }); break;
      case 'alert': tone(466, .25, .11, 'triangle', { end: 294 }); break;
      case 'radio': burst(1550, .62, .26); tone(740, .12, .05, 'triangle', { at: time + .18 }); break;
      case 'camera': burst(2350, .065, .22); burst(1500, .05, .13, time + .08); break;
      default: tone(370, .11, .055);
    }
  }

  window.GameAudio = {
    start() {
      init();
      if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
      if (calm && !musicUnlocked && !unlockingMusic) {
        unlockingMusic = true;
        calm.volume = 0;
        calm.play().then(() => {
          musicUnlocked = true;
          tuneMusic();
        }).catch(() => {}).finally(() => { unlockingMusic = false; });
      }
    },
    pause(value) { paused = value; tuneVolume(); },
    mood(value) { mood = value; tuneMusic(); },
    ambience(value) {
      if (!locations[value] || value === scene) return;
      scene = value;
      tuneAmbience();
      tuneMusic();
    },
    toggle() { muted = !muted; tuneVolume(); return muted; },
    voice(id, index) {
      if (audible()) tone((voices[id] || 170) + index % 3 * 12, .052, .025, id === 'sofia' ? 'sine' : 'triangle');
    },
    effect: playEffect
  };
})();
