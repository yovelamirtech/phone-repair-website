import { buildLocalBusiness } from '../lib/structuredData';

/** LocalBusiness JSON-LD (built from src/data/business.ts). */
export function StructuredData() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusiness()) }} />;
}
