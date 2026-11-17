// Vercel function: POST /api/stt (multipart field "audio") → { transcript } via Sarvam saaras:v4.
// The key stays server-side (Vercel env SARVAM_API_KEY).
import { handleStt, sarvamKey } from '../server/sarvam.js';

export const config = { maxDuration: 30 };

export function POST(request: Request): Promise<Response> {
  return handleStt(request, sarvamKey());
}
