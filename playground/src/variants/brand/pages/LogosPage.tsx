import { AssetBrowser } from '@/core/docs/AssetBrowser';

export default function LogosPage() {
  return <AssetBrowser kinds={['logo', 'symbol', 'label', 'lockup']} />;
}
