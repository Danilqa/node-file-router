import React, { memo, ReactElement } from 'react';
import Link from '@docusaurus/Link';

import './features.styles.scss';

interface FeatureItem {
  title: string;
  imageUrl: string,
  description: ReactElement;
}

const FEATURES: FeatureItem[] = [
  {
    title: 'Technology Agnostic',
    imageUrl: 'https://ucarecdn.com/b0a21a09-e725-4369-8044-a40f51aca7a4',
    description: (
      <>
        Works well with <Link href='/docs/usage-guide'>pure Node.js</Link>,{' '}
        <Link href='/docs/use-with-bun'>Bun</Link>,{' '}
        <Link href='/docs/usage-guide'>Express.js</Link>,{' '}
        <Link href='https://github.com/Danilqa/node-file-router/tree/main/examples/web-socket/src'>WebSockets</Link>, and even more!
      </>
    ),
  },
  {
    title: 'Works Everywhere',
    imageUrl: 'https://ucarecdn.com/8db22162-ba55-4aa6-ae8b-ac04118f271e',
    description: (
      <>
        Common JS and ES modules ready. TypeScript support out of box.
      </>
    ),
  },
  {
    title: 'Powerful',
    imageUrl: 'https://ucarecdn.com/18fc8087-3813-4482-b9f7-9d2b1f2d7170',
    description: (
      <>
        Inspired by Next.js and Nuxt, it has a similar interface. It supports dynamic routes with wildcard parameters.
      </>
    ),
  },
  {
    title: 'High Quality',
    imageUrl: 'https://ucarecdn.com/9ac1eae1-2d12-4813-9b61-be84fb1382f5',
    description: (
      <>
        0 dependencies and 100% test coverage.
      </>
    ),
  },
];

const Feature = memo<FeatureItem>( ({ title, imageUrl, description }) =>
  (
    <div className="col col--3">
      <div className="text--center">
        <img
          className="features-list__image"
          loading="lazy"
          src={`${imageUrl}/-/preview/400x400/-/quality/smart_retina/-/format/auto/`}
          alt="feature image"
        />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
);

export const Features = memo(() => {
  return (
    <section className="features-list">
      <div className="container">
        <div className="row">
          {FEATURES.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
});

Features.displayName = 'Features';
