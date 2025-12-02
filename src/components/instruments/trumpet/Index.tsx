import { lazy } from "react";
import InstrumentPageLayout from '@/components/instruments/InstrumentPageLayout';

const LazyTrumpetComponent = lazy(() => import("./trumpet1/TrumpetPage"));
const LazyTrumpetAdvancedComponent = lazy(() => import("../PlaceholderComponent"));

const Index = () => {
  const variants = [
    {
      id: 'design-1',
      label: 'Classic Design',
      component: LazyTrumpetComponent
    },
    {
      id: 'design-2',
      label: 'Advanced Design',
      component: LazyTrumpetAdvancedComponent,
      componentProps: { instrumentName: 'Trumpet Advanced' }
    }
  ];

  return (
    <InstrumentPageLayout
      instrumentName="Trumpet"
      instrumentId="trumpet"
      variants={variants}
      defaultVariant="design-1"
      accentColor="from-amber-500 to-yellow-500"
      features={['Interactive', 'Brass Sound', 'Mute Options', 'Valve Control']}
    />
  );
};

export default Index;
