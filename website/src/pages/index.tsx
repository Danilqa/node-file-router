import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { Features } from '@site/src/components/features/features';
import { Demo } from '@site/src/components/demo/demo';

import './index.styles.scss';

function HomepageHeader() {
  return (
    <header className="hero">
      <div className="container">
        <img alt="logo" src={require('@site/static/img/logo.png').default} width={200}/>
        <h1 className="hero__title">Node File Router</h1>
        <p className="hero__subtitle">A file-based routing for Node.js</p>
        <div className="actions">
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="A file-based routing for Node.js">
      <HomepageHeader/>
      <main>
        <Demo/>
        <Features/>
      </main>
    </Layout>
  );
}
