import { lazy } from "react";
import InstrumentPageLayout from '@/components/instruments/InstrumentPageLayout';

const LazyKalimbaComponent = lazy(() => import("./kalimba1/KalimbaPage"));
const LazyKalimba2Component = lazy(() => import("./kalimba2/KalimbaPage"));

const Index = () => {
  const variants = [
    {
      id: 'design-1',
      label: 'Classic Design',
      component: LazyKalimbaComponent
    },
    {
      id: 'design-2',
      label: 'Modern Design',
      component: LazyKalimba2Component
    }
  ];

  return (
    <InstrumentPageLayout
      instrumentName="Kalimba"
      instrumentId="kalimba"
      variants={variants}
      defaultVariant="design-1"
      accentColor="from-teal-500 to-emerald-500"
      features={['Interactive', 'Thumb Piano', 'Metal Tines', 'Mbira']}
    />
  );
};

export default Index;
