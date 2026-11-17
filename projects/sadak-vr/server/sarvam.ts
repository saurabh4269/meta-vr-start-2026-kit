/**
 * Server-only Sarvam AI calls (never bundled into the client).
 * Request shapes follow SADAK's lib/sarvam.ts (saaras:v4 STT, bulbul:v3 TTS).
 */

const BASE = 'https://api.sarvam.ai';

export function sarvamKey(env: Record<string, string | undefined> = process.env): string | null {
  return env.SARVAM_API_KEY?.trim() || null;
}

/** Transcribe a short recorded reply (webm/opus or wav) in Hindi, keeping Devanagari. */
export async function transcribe(audio: Blob, key: string, language = 'hi-IN'): Promise<string> {
  const form = new FormData();
  form.append('file', audio, audio.type.includes('wav') ? 'speech.wav' : 'speech.webm');
  form.append('model', 'saaras:v4');
  form.append('mode', 'transcribe');
  form.append('language_code', language);
  form.append('keyterms', JSON.stringify(['कचौड़ी', 'कटिंग चाय', 'गेंदे की माला', 'नई दिल्ली रेलवे स्टेशन', 'डेढ़ सौ']));
  const res = await fetch(`${BASE}/speech-to-text`, {
    method: 'POST',
    headers: { 'api-subscription-key': key },
    body: form,
  });
  if (!res.ok) throw new Error(`Sarvam STT ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { transcript?: string };
  return json.transcript ?? '';
}

/** Synthesize one line; returns raw audio bytes (mp3). */
export async function synthesize(text: string, speaker: string, key: string, language = 'hi-IN'): Promise<Uint8Array> {
  const res = await fetch(`${BASE}/text-to-speech`, {
    method: 'POST',
    headers: { 'api-subscription-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model: 'bulbul:v3',
      target_language_code: language,
      speaker,
      pace: 0.92,
      temperature: 0.6,
      output_audio_codec: 'mp3',
      speech_sample_rate: 24000,
    }),
  });
  if (!res.ok) throw new Error(`Sarvam TTS ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { audios?: string[] };
  const b64 = (json.audios ?? []).join('');
  if (!b64) throw new Error('Sarvam TTS returned no audio');
  return Uint8Array.from(Buffer.from(b64, 'base64'));
}

const MAX_BYTES = 1_500_000; // ~15 s of opus; replies are one short sentence

/** Shared request handler for POST /api/stt (Vercel function and the Vite dev server). */
export async function handleStt(req: Request, key: string | null): Promise<Response> {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  if (!key) return json({ error: 'Speech scoring is not configured on this server.' }, 503);
  let audio: Blob | null = null;
  try {
    const form = await req.formData();
    const f = form.get('audio');
    if (f instanceof Blob) audio = f;
  } catch {
    /* fall through */
  }
  if (!audio || audio.size < 800) return json({ error: 'No audio.' }, 400);
  if (audio.size > MAX_BYTES) return json({ error: 'Recording too long.' }, 413);
  try {
    return json({ transcript: await transcribe(audio, key) });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Transcription failed.' }, 502);
  }
}
