import { DeltaSection } from "./_components/delta-section";
import { HarvestBrandTrust } from "./_components/harvest-trust";
import { HomeHeader } from "./_components/homeHeader";
import { ProductSection } from "./_components/product-section";


export default function Home() {
  return (
    <div className="min-h-screen w-full pt-16">
      <HomeHeader />
      <ProductSection />
      <DeltaSection />
      <HarvestBrandTrust />
    </div>
  );
}
