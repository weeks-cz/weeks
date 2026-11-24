import { llmsFullTxt } from '@/lib/llms'

// Plné znění k `/llms.txt`, generuje se při buildu z dat webu (`src/lib/llms.ts`).
export const dynamic = 'force-static'

export function GET() {
  return new Response(llmsFullTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
