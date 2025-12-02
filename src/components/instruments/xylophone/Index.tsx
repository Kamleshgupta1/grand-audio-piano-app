import { lazy } from "react";
import InstrumentPageLayout from '@/components/instruments/InstrumentPageLayout';

const LazyXylophoneComponent = lazy(() => import("./xylophone1/XylophonePage"));
const LazyXylophoneAdvancedComponent = lazy(() => import("../PlaceholderComponent"));

const Index = () => {
  const variants = [
    {
      id: 'design-1',
      label: 'Classic Design',
      component: LazyXylophoneComponent
    },
    {
      id: 'design-2',
      label: 'Advanced Design',
      component: LazyXylophoneAdvancedComponent,
      componentProps: { instrumentName: 'Xylophone Advanced' }
    }
  ];

  return (
    <InstrumentPageLayout
      instrumentName="Xylophone"
      instrumentId="xylophone"
      variants={variants}
      defaultVariant="design-1"
      accentColor="from-red-500 to-orange-500"
      features={['Interactive', 'Mallet Sounds', 'Wooden Bars', 'Resonators']}
    />
  );
};

export default Index;
