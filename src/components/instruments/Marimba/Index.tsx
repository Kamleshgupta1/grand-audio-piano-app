import { lazy } from "react";
import InstrumentPageLayout from '@/components/instruments/InstrumentPageLayout';

const LazyMarimbaComponent = lazy(() => import("./marimba1/MarimbaPage"));
const LazyMarimba2Component = lazy(() => import("./marimba2/MarimbaPage"));

const Index = () => {
  const variants = [
    {
      id: 'design-1',
      label: 'Classic Design',
      component: LazyMarimbaComponent
    },
    {
      id: 'design-2',
      label: 'Modern Design',
      component: LazyMarimba2Component
    }
  ];

  return (
    <InstrumentPageLayout
      instrumentName="Marimba"
      instrumentId="marimba"
      variants={variants}
      defaultVariant="design-2"
      accentColor="from-amber-500 to-orange-500"
      features={['Interactive', 'Wooden Bars', 'Mallet Techniques', 'Resonators']}
    />
  );
};

export default Index;
