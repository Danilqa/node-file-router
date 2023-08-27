import React, { useState } from 'react';

import { UrlSelector } from '@site/src/components/demo/url-selector/url-selector';
import { FileExplorer } from '@site/src/components/demo/file-explorer/file-explorer';
import { CatalogPage, ProductPage } from '@site/src/components/demo/browser-content/browser-content';

import './demo.styles.scss';

const CONTENT = [
  {
    url: [
      '/collections/',
      <span className="url-bar__slug url-bar__slug--color-2">12</span>,
      '/products/',
      <span className="url-bar__slug url-bar__slug--color-4">25</span>,
      '/'
    ],
    fileCatalog: {
      name: 'api', children: [
        { name: 'catalog', children: [], closed: true },
        {
          name: 'collections', children: [
            {
              name: '[cid]', children: [
                {
                  name: 'products', children: [
                    { name: '[pid].js', isJsFile: true, isSelected: true }
                  ]
                }]
            }
          ]
        }
      ]
    },
    content: <ProductPage/>,
  },
  {
    url: [
      '/catalog/',
      <span className="url-bar__slug url-bar__slug--color-1">men</span>,
      '/',
      <span className="url-bar__slug url-bar__slug--color-2">denim</span>,
      '/',
      <span className="url-bar__slug url-bar__slug--color-3">black</span>,
      '/'
    ],
    fileCatalog: {
      name: 'api', children: [
        {
          name: 'catalog', children: [
            { name: '[[...categories]].js', isJsFile: true, isSelected: true }
          ]
        },
        {
          name: 'collections', closed: true, children: [],
        }
      ]
    },
    content: <CatalogPage/>,
  }
];

export function Demo() {
  const [urlIndex, setUrlIndex] = useState(0);

  const urls = CONTENT.map(item => item.url);

  return (
    <div className="demo-container">
      <UrlSelector selectedIndex={urlIndex} data={urls} onSelect={setUrlIndex}/>
      <div className="demo-container__gap">
        <div className="link-arrow"/>
      </div>
      <FileExplorer data={CONTENT[urlIndex].fileCatalog}/>
      <div className="demo-container__gap">
        <div className="link-arrow"/>
      </div>
      {CONTENT[urlIndex].content}
    </div>
  )
}
