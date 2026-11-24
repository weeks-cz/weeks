import { llmsTxt } from '@/lib/llms'

// Generuje se při buildu z dat webu (`src/lib/llms.ts`); deploy ho obnoví.
export const dynamic = 'force-static'

export function GET() {
  return new Response(llmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
