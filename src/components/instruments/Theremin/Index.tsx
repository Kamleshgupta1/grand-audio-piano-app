import { lazy } from "react";
import InstrumentPageLayout from '@/components/instruments/InstrumentPageLayout';

const LazyThereminComponent = lazy(() => import("./theremin1/ThereminPage"));
const LazyThereminAdvancedComponent = lazy(() => import("../PlaceholderComponent"));

const Index = () => {
  const variants = [
    {
      id: 'design-1',
      label: 'Classic Design',
      component: LazyThereminComponent
    },
    {
      id: 'design-2',
      label: 'Advanced Design',
      component: LazyThereminAdvancedComponent,
      componentProps: { instrumentName: 'Theremin Advanced' }
    }
  ];

  return (
    <InstrumentPageLayout
      instrumentName="Theremin"
      instrumentId="theremin"
      variants={variants}
      defaultVariant="design-1"
      accentColor="from-purple-500 to-cyan-500"
      features={['Interactive', 'Contactless', 'Antenna Control', 'Pitch Bend']}
    />
  );
};

export default Index;
