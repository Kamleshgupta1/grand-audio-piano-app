import { lazy } from "react";
import InstrumentPageLayout from '@/components/instruments/InstrumentPageLayout';

const LazySaxophoneComponent = lazy(() => import("./saxophone1/SaxophonePage"));
const LazySaxophoneAdvancedComponent = lazy(() => import("../PlaceholderComponent"));

const Index = () => {
  const variants = [
    {
      id: 'design-1',
      label: 'Classic Design',
      component: LazySaxophoneComponent
    },
    {
      id: 'design-2',
      label: 'Advanced Design',
      component: LazySaxophoneAdvancedComponent,
      componentProps: { instrumentName: 'Saxophone Advanced' }
    }
  ];

  return (
    <InstrumentPageLayout
      instrumentName="Saxophone"
      instrumentId="saxophone"
      variants={variants}
      defaultVariant="design-1"
      accentColor="from-yellow-500 to-amber-500"
      features={['Interactive', 'Alto Sax', 'Jazz Tones', 'Breath Control']}
    />
  );
};

export default Index;
