import { lazy } from "react";
import InstrumentPageLayout from '@/components/instruments/InstrumentPageLayout';

const LazySitarComponent = lazy(() => import("./Sitar1/SitarPage"));
const LazySitarAdvancedComponent = lazy(() => import("../PlaceholderComponent"));

const Index = () => {
  const variants = [
    {
      id: 'design-1',
      label: 'Classic Design',
      component: LazySitarComponent
    },
    {
      id: 'design-2',
      label: 'Advanced Design',
      component: LazySitarAdvancedComponent,
      componentProps: { instrumentName: 'Sitar Advanced' }
    }
  ];

  return (
    <InstrumentPageLayout
      instrumentName="Sitar"
      instrumentId="sitar"
      variants={variants}
      defaultVariant="design-1"
      accentColor="from-orange-500 to-red-500"
      features={['Interactive', 'Indian Classical', 'Meend', 'Sympathetic Strings']}
    />
  );
};

export default Index;
