import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { Features } from '@site/src/components/features/features';
import { Demo } from '@site/src/components/demo/demo';
import { Hero } from '@site/src/components/hero/hero';

import './index.styles.scss';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="A file-based routing for Node.js">
      <Hero/>
      <main>
        <Demo/>
        <Features/>
      </main>
    </Layout>
  );
}
