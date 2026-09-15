/**
 * Stránka turnusu si metadata řeší sama v `page.tsx` (`generateMetadata`),
 * protože se liší turnus od turnusu — layout tu je jen proto, aby existovala
 * segmentová hranice, a nic navíc nedělá.
 */
export default function TurnusLayout({ children }: { children: React.ReactNode }) {
  return children
}
