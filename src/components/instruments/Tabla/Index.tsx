import { lazy } from "react";
import InstrumentPageLayout from '@/components/instruments/InstrumentPageLayout';

const LazyTablaComponent = lazy(() => import("./tabla1/TablaPage"));
const LazyTablaAdvancedComponent = lazy(() => import("../PlaceholderComponent"));

const Index = () => {
  const variants = [
    {
      id: 'design-1',
      label: 'Classic Design',
      component: LazyTablaComponent
    },
    {
      id: 'design-2',
      label: 'Advanced Design',
      component: LazyTablaAdvancedComponent,
      componentProps: { instrumentName: 'Tabla Advanced' }
    }
  ];

  return (
    <InstrumentPageLayout
      instrumentName="Tabla"
      instrumentId="tabla"
      variants={variants}
      defaultVariant="design-1"
      accentColor="from-red-500 to-orange-500"
      features={['Interactive', 'Indian Drums', 'Bayan', 'Dayan', 'Taals']}
    />
  );
};

export default Index;
