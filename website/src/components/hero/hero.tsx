import Link from '@docusaurus/Link';
import React, { memo } from 'react';

export const Hero = memo(() => (
  <header className='hero'>
    <div className='container'>
      <img fetchpriority='high' alt='logo' src={require('@site/static/img/logo.png').default} width={200} height={200} />
      <h1 className='hero__title'>Node File Router</h1>
      <p className='hero__subtitle'>A file-based routing for Node.js</p>
      <div className='actions'>
        <Link
          className='button button--secondary button--lg'
          to='/docs/getting-started'>
          Get Started
        </Link>
      </div>
    </div>
  </header>
));

Hero.displayName = 'Hero';
