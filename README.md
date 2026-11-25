# Gestura

Translates speech and typed text into Indian Sign Language, rendering each word
as a sign animation. Built as an installable PWA so it works on a phone held up
in conversation.

The gap it addresses is one-directional: plenty of tools caption speech for a
deaf user, but a hearing person with no signing ability still cannot *produce*
sign. Gestura covers that direction — you speak or type, and the screen signs it.

## How it works

```
speech  ──► Web Speech API ──┐
                             ├──► tokenise ──► lookup in gif_sentences.csv
text    ──► text input ──────┘                      │
                                                    ▼
                                   sequence 574 word-level sign GIFs
```

- **`SpeechToSign`** — captures live speech, transcribes it, and plays the
  matching sign sequence
- **`TextToSign`** — same path from typed input, for noisy environments or
  when speech recognition misfires
- **574 word-level GIFs** in `public/gifs`, keyed by word (`accountant.gif`,
  `aeroplane.gif`, …), with `sentences.csv` and `gif_sentences.csv` providing
  example phrases and their sign sequences, parsed client-side with papaparse

Word-level signing rather than fingerspelling: a sign per word reads at
conversational speed, where spelling each letter does not.

## Layout

```
src/components/
  SpeechToSign.jsx   speech capture -> sign sequence
  TextToSign.jsx     text input -> sign sequence
  Home.jsx           landing
  Login.jsx          auth against the backend
  Signup.jsx         registration
  Dashboard.jsx      signed-in view
public/
  gifs/              574 word-level sign animations
  sentences.csv      example phrases
  gif_sentences.csv  phrase -> GIF sequence mapping
  service-worker.js  offline/PWA support
```

## Backend

Authentication is a separate Flask service:
[**gestbackend**](https://github.com/mahesh062003/gestbackend). Its account
store is in-memory and does not survive a restart — a demonstration auth layer
rather than a production one.

## Running it

```bash
npm install
npm run dev
```

Speech recognition uses the Web Speech API, which needs a Chromium-based
browser and microphone permission. The text path works everywhere.

## Stack

React 19 · Vite · React Router · Bootstrap · papaparse · axios · lucide-react

---

## Use

© 2026 Mahesh Veeraiah R. All rights reserved.

Published for review and assessment. Not licensed for reuse, redistribution or
modification — please get in touch about any other use.

Datasets referenced above are **not included and are not mine**. Each remains
the property of its provider and is subject to that provider's own licence and
terms. Obtain them from the sources named, and comply with those terms.
