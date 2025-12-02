import { lazy } from "react";
import InstrumentPageLayout from '@/components/instruments/InstrumentPageLayout';

const LazyBanjoComponent = lazy(() => import("./banjo1/BanjoPage"));
const LazyBanjo2Component = lazy(() => import("../PlaceholderComponent"));

const Index = () => {
  const variants = [
    {
      id: 'design-1',
      label: 'Classic Design',
      component: LazyBanjoComponent
    },
    {
      id: 'design-2',
      label: 'Advanced Design',
      component: LazyBanjo2Component,
      componentProps: { instrumentName: 'Banjo Advanced' }
    }
  ];

  return (
    <InstrumentPageLayout
      instrumentName="Banjo"
      instrumentId="banjo"
      variants={variants}
      defaultVariant="design-1"
      accentColor="from-amber-500 to-orange-500"
      features={['Interactive', '5 Strings', 'Clawhammer', 'Bluegrass']}
    />
  );
};

export default Index;
