import React, { ReactElement } from 'react';
import clsx from 'clsx';

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
        Works well with pure Node.js, Express.js, WebSockets, and even more!
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
        Inspired by Next.js and has similar interface. Supports dynamic routes with wildcard params.
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

function Feature({ title, imageName, description }: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
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
  );
}

export function Features() {
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
}
