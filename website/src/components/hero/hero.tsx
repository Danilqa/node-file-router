import Link from '@docusaurus/Link';
import React, { memo } from 'react';

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
