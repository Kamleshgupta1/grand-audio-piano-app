import { lazy } from "react";
import InstrumentPageLayout from '@/components/instruments/InstrumentPageLayout';

const LazyHarmonicaComponent = lazy(() => import("./harmonica1/HarmonicaPage"));
const LazyHarmonicaAdvancedComponent = lazy(() => import("../PlaceholderComponent"));

const Index = () => {
  const variants = [
    {
      id: 'design-1',
      label: 'Classic Design',
      component: LazyHarmonicaComponent
    },
    {
      id: 'design-2',
      label: 'Advanced Design',
      component: LazyHarmonicaAdvancedComponent,
      componentProps: { instrumentName: 'Harmonica Advanced' }
    }
  ];

  return (
    <InstrumentPageLayout
      instrumentName="Harmonica"
      instrumentId="harmonica"
      variants={variants}
      defaultVariant="design-1"
      accentColor="from-blue-500 to-indigo-500"
      features={['Interactive', 'Diatonic', 'Blues Harp', 'Bending']}
    />
  );
};

export default Index;
