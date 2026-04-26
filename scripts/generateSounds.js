#!/usr/bin/env node
/**
 * Generates minimal WAV sound effects for the game.
 * Run once: node scripts/generateSounds.js
 * Output: assets/sounds/{tap,correct,wrong,token,key}.wav
 */

const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 22050;
const BITS = 16;
const CHANNELS = 1;
const MAX_AMP = 32767;

function makeSine(freq, duration, volume = 1, envelope = null) {
  const samples = Math.floor(SAMPLE_RATE * duration);
  const data = new Int16Array(samples);
  for (let i = 0; i < samples; i++) {
    const t = i / SAMPLE_RATE;
    let amp = Math.sin(2 * Math.PI * freq * t);
    // default ADSR-like decay
    const envVal = envelope ? envelope(t, duration) : Math.max(0, 1 - t / duration);
    data[i] = Math.round(amp * envVal * volume * MAX_AMP);
  }
  return data;
}

function makeChirp(freqStart, freqEnd, duration, volume = 1) {
  const samples = Math.floor(SAMPLE_RATE * duration);
  const data = new Int16Array(samples);
  for (let i = 0; i < samples; i++) {
    const t = i / SAMPLE_RATE;
    const freq = freqStart + (freqEnd - freqStart) * (t / duration);
    const amp = Math.sin(2 * Math.PI * freq * t);
    const env = Math.max(0, 1 - t / duration);
    data[i] = Math.round(amp * env * volume * MAX_AMP);
  }
  return data;
}

function concat(...arrays) {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const out = new Int16Array(total);
  let offset = 0;
  for (const a of arrays) { out.set(a, offset); offset += a.length; }
  return out;
}

function silence(duration) {
  return new Int16Array(Math.floor(SAMPLE_RATE * duration));
}

function writeWav(filePath, samples) {
  const dataBytes = samples.length * 2;
  const buf = Buffer.allocUnsafe(44 + dataBytes);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataBytes, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);           // PCM
  buf.writeUInt16LE(CHANNELS, 22);
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * CHANNELS * BITS / 8, 28);
  buf.writeUInt16LE(CHANNELS * BITS / 8, 32);
  buf.writeUInt16LE(BITS, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(dataBytes, 40);
  for (let i = 0; i < samples.length; i++) {
    buf.writeInt16LE(samples[i], 44 + i * 2);
  }
  fs.writeFileSync(filePath, buf);
  console.log(`Wrote ${filePath} (${samples.length} samples, ${(dataBytes / 1024).toFixed(1)} KB)`);
}

const outDir = path.join(__dirname, '../assets/sounds');
fs.mkdirSync(outDir, { recursive: true });

// tap — short high click
writeWav(path.join(outDir, 'tap.wav'),
  makeSine(880, 0.06, 0.6));

// correct — two ascending notes
writeWav(path.join(outDir, 'correct.wav'),
  concat(
    makeSine(523, 0.18, 0.8),   // C5
    silence(0.04),
    makeSine(659, 0.18, 0.8),   // E5
    silence(0.04),
    makeSine(784, 0.28, 0.9),   // G5
  ));

// wrong — descending chirp buzz
writeWav(path.join(outDir, 'wrong.wav'),
  concat(
    makeChirp(300, 180, 0.22, 0.9),
    silence(0.04),
    makeChirp(260, 150, 0.18, 0.7),
  ));

// token — bright coin chime
writeWav(path.join(outDir, 'token.wav'),
  concat(
    makeSine(1047, 0.12, 0.7),  // C6
    silence(0.03),
    makeSine(1319, 0.22, 0.8),  // E6
  ));

// key — triumphant jingle
writeWav(path.join(outDir, 'key.wav'),
  concat(
    makeSine(523, 0.12, 0.8),
    silence(0.02),
    makeSine(659, 0.12, 0.8),
    silence(0.02),
    makeSine(784, 0.12, 0.8),
    silence(0.02),
    makeSine(1047, 0.35, 0.9),
  ));

console.log('Done! All sounds generated in assets/sounds/');
