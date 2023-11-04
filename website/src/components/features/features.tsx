import React, { memo, ReactElement } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

import './features.styles.scss';

interface FeatureItem {
  title: string;
  imageName: string,
  description: ReactElement;
}

const FEATURES: FeatureItem[] = [
  {
    title: 'Technology Agnostic',
    imageName: 'feature-one.png',
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
    imageName: 'feature-two.png',
    description: (
      <>
        Common JS and ES modules ready. TypeScript support out of box.
      </>
    ),
  },
  {
    title: 'Powerful',
    imageName: 'feature-three.png',
    description: (
      <>
        Inspired by Next.js and Nuxt, it has a similar interface. It supports dynamic routes with wildcard parameters.
      </>
    ),
  },
  {
    title: 'High Quality',
    imageName: 'feature-four.png',
    description: (
      <>
        0 dependencies and 100% test coverage.
      </>
    ),
  },
];

const Feature = memo<FeatureItem>( ({ title, imageName, description }) =>
  (
    <div className="col col--3">
      <div className="text--center">
        <img
          className="features-list__image"
          loading="lazy"
          src={require(`@site/static/img/${imageName}`).default}
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
