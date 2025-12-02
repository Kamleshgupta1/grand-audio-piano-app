import { lazy } from "react";
import InstrumentPageLayout from '@/components/instruments/InstrumentPageLayout';

const LazyHarpComponent = lazy(() => import("./harp1/HarpPage"));
const LazyHarpAdvancedComponent = lazy(() => import("../PlaceholderComponent"));

const Index = () => {
  const variants = [
    {
      id: 'design-1',
      label: 'Classic Design',
      component: LazyHarpComponent
    },
    {
      id: 'design-2',
      label: 'Advanced Design',
      component: LazyHarpAdvancedComponent,
      componentProps: { instrumentName: 'Harp Advanced' }
    }
  ];

  return (
    <InstrumentPageLayout
      instrumentName="Harp"
      instrumentId="harp"
      variants={variants}
      defaultVariant="design-1"
      accentColor="from-purple-500 to-pink-500"
      features={['Interactive', 'Pedal Harp', 'Glissando', 'Arpeggios']}
    />
  );
};

export default Index;
