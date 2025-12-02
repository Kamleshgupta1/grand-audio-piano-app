import { lazy } from "react";
import InstrumentPageLayout from '@/components/instruments/InstrumentPageLayout';

const LazyVeenaComponent = lazy(() => import("./Veena1/VeenaPage"));
const LazyVeenaAdvancedComponent = lazy(() => import("../PlaceholderComponent"));

const Index = () => {
  const variants = [
    {
      id: 'design-1',
      label: 'Classic Design',
      component: LazyVeenaComponent
    },
    {
      id: 'design-2',
      label: 'Advanced Design',
      component: LazyVeenaAdvancedComponent,
      componentProps: { instrumentName: 'Veena Advanced' }
    }
  ];

  return (
    <InstrumentPageLayout
      instrumentName="Veena"
      instrumentId="veena"
      variants={variants}
      defaultVariant="design-1"
      accentColor="from-orange-500 to-yellow-500"
      features={['Interactive', 'Carnatic', 'Gamakas', 'Frets']}
    />
  );
};

export default Index;
