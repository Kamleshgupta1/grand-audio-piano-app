import { lazy } from "react";
import InstrumentPageLayout from '@/components/instruments/InstrumentPageLayout';

const FluteMaster1Component = lazy(() => import("./FluteMasterComponent"));
const FluteMaster2Component = lazy(() => import("./flute2/FlutePage"));

const Index = () => {
  const variants = [
    {
      id: 'design-1',
      label: 'Classic Design',
      component: FluteMaster1Component
    },
    {
      id: 'design-2',
      label: 'Modern Design',
      component: FluteMaster2Component
    }
  ];

  return (
    <InstrumentPageLayout
      instrumentName="Flute"
      instrumentId="flute"
      variants={variants}
      defaultVariant="design-2"
      accentColor="from-blue-500 to-cyan-500"
      features={['Interactive', 'Multiple Flute Types', 'Bansuri', 'Pan Flute', 'Native Flute']}
    />
  );
};

export default Index;
