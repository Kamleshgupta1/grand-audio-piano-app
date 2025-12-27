import React from 'react';
import { Helmet } from 'react-helmet-async';

interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration format e.g., "PT30M" for 30 minutes
  estimatedCost?: {
    currency: string;
    value: string;
  };
  image?: string;
  supply?: string[];
  tool?: string[];
}

const HowToSchema: React.FC<HowToSchemaProps> = ({
  name,
  description,
  steps,
  totalTime,
  estimatedCost,
  image,
  supply,
  tool,
}) => {
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    ...(estimatedCost && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: estimatedCost.currency,
        value: estimatedCost.value,
      },
    }),
    ...(image && { image }),
    ...(supply && {
      supply: supply.map((item) => ({
        '@type': 'HowToSupply',
        name: item,
      })),
    }),
    ...(tool && {
      tool: tool.map((item) => ({
        '@type': 'HowToTool',
        name: item,
      })),
    }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url }),
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(howToSchema)}
      </script>
    </Helmet>
  );
};

export default HowToSchema;
