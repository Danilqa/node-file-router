import React, { ReactElement } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  imageName: string,
  description: ReactElement;
};

const FeatureList: FeatureItem[] = [
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
        ES6 and ES modules ready. TypeScript support out of box.
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
          className={styles.featureImg}
          loading='lazy'
          src={require(`@site/static/img/${imageName}`).default}
          alt='feature image'
        />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
