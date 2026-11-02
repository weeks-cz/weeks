import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Čtení `registration_payments` a obsazenosti pro platební routy.
 *
 * Používá se jen serverově se service rolí (RLS tabulky nemá žádnou policy).
 * Pravidlo „kdo drží místo“ je stejné jako v `create_registration()` a v
 * `/api/term-capacity` (migrace 021) — když se změní, mění se na všech třech místech.
 */

/** Součet všech zaplacených plateb přihlášky v Kč. */
export async function zaplaceno(supabase: SupabaseClient, registrationId: string): Promise<number> {
  const { data, error } = await supabase
    .from('registration_payments')
    .select('amount_kc')
    .eq('registration_id', registrationId)
    .eq('status', 'paid')
  if (error) throw error
  return (data ?? []).reduce((sum, row) => sum + (row.amount_kc as number), 0)
}

/**
 * Kolik míst na turnusu drží jiné registrace než ta, která se právě platí.
 * Drží místo: zaplacená (`completed`), záloha (`partial`), nebo rozpracovaná
 * platba mladší než hodina.
 */
export async function obsazenaMista(
  supabase: SupabaseClient,
  termId: string,
  vynechaRegistraci: string
): Promise<number> {
  const { data, error } = await supabase
    .from('registrations')
    .select('id, payment_status, created_at')
    .eq('term_id', termId)
    .neq('status', 'cancelled')
    .neq('id', vynechaRegistraci)
  if (error) throw error
  const cutoff = Date.now() - 60 * 60 * 1000
  return (data ?? []).filter(
    (row) =>
      row.payment_status === 'completed' ||
      row.payment_status === 'partial' ||
      new Date(row.created_at as string).getTime() > cutoff
  ).length
}
