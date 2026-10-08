import { AssetBrowser } from '@/core/docs/AssetBrowser';

export default function ImageryPage() {
  return <AssetBrowser kinds={['illustration', 'infographic', 'photo']} />;
}
