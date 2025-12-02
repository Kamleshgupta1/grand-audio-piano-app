import { lazy } from "react";
import InstrumentPageLayout from '@/components/instruments/InstrumentPageLayout';

const LazyVirtualViolinComponent = lazy(() => import("./violin1/ViolinComponent"));
const LazyVirtualViolin2Component = lazy(() => import("./violin2/ViolinPage"));

const Index = () => {
  const variants = [
    {
      id: 'design-1',
      label: 'Classic Design',
      component: LazyVirtualViolinComponent
    },
    {
      id: 'design-2',
      label: 'Modern Design',
      component: LazyVirtualViolin2Component
    }
  ];

  return (
    <InstrumentPageLayout
      instrumentName="Violin"
      instrumentId="violin"
      variants={variants}
      defaultVariant="design-2"
      accentColor="from-amber-500 to-orange-500"
      features={['Interactive', 'Multiple Violin Types', 'Realistic Bow Simulation', 'Recording']}
    />
  );
};

export default Index;
