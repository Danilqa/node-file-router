import Link from '@docusaurus/Link';
import React, { memo } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export const Hero = memo(() => (
  <header className='hero'>
    <div className='container'>
      <img
        fetchpriority='high'
        alt='logo'
        src='https://ucarecdn.com/48783714-a5ed-4e16-9d2c-89c6b974309d/-/preview/400x400/-/quality/smart_retina/-/format/auto/'
        width={200}
        height={200}
      />
      <h1 className='hero__title'>Node File Router</h1>
      <p className='hero__subtitle'>A file-based routing for Node.js</p>
      <div className='hero__actions'>
        <Link
          className='button button--secondary button--lg'
          to='/docs/getting-started'>
          Get Started
        </Link>
      </div>
      <div className='hero__badges'>
        <a href='https://devhunt.org/tool/node-file-router' target='_blank'>
          <img
            src={useBaseUrl('/img/devhunt-site-badge.svg')}
            width={243}
            height={54}
            alt='2-nd place on DevHunt | Product of the Week'
          />
        </a>
      </div>
    </div>
  </header>
));

Hero.displayName = 'Hero';
