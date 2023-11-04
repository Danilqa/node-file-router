import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { UrlSelector } from '@site/src/components/demo/url-selector/url-selector';
import { FileExplorer } from '@site/src/components/demo/file-explorer/file-explorer';
import { CatalogPage, FavouritesPage, ProductPage } from '@site/src/components/demo/browser-content/browser-content';

import './demo.styles.scss';

const CONTENT = [
  {
    url: [
      '/collections/',
      <span key="slug-1" className="url-bar__slug url-bar__slug--color-2">12</span>,
      '/products/',
      <span key="slug-2" className="url-bar__slug url-bar__slug--color-4">25</span>,
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
      <span key="slug-1" className="url-bar__slug url-bar__slug--color-1">women</span>,
      '/',
      <span key="slug-2" className="url-bar__slug url-bar__slug--color-2">denim</span>,
      '/',
      <span key="slug-3" className="url-bar__slug url-bar__slug--color-3">black</span>,
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
  },
  {
    url: [
      '/profile/favourites/'
    ],
    fileCatalog: {
      name: 'api', children: [
        {
          name: 'profile', children: [
            { name: 'favourites.[get].js', isJsFile: true, isSelected: true },
            { name: 'favourites.[post].js', isJsFile: true },
          ],
        },
        {
          name: 'brands', children: [
            { name: '[id].[get].js', isJsFile: true },
          ],
        }
      ]
    },
    content: <FavouritesPage/>,
  },
];

const DELAY_BEFORE_SWITCH_URL_MS = 5000;

export const Demo = memo(() => {
  const [urlIndex, setUrlIndex] = useState(0);
  const [isInteracted, setIsInteracted] = useState(false);

  const urls = useMemo(() => CONTENT.map(item => item.url), []);

  useEffect(() => {
    if (isInteracted) return;

    const intervalId = setInterval(
      () => setUrlIndex(prevIndex => ((prevIndex + 1) % CONTENT.length)),
      DELAY_BEFORE_SWITCH_URL_MS
    );
    return () => clearInterval(intervalId);
  }, [isInteracted]);

  const onSelected = useCallback((index: number) => {
    setIsInteracted(true);
    setUrlIndex(index);
  }, []);

  return (
    <div className="demo-container">
      <UrlSelector selectedIndex={urlIndex} data={urls} onSelect={onSelected}/>
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
});

Demo.displayName = 'Demo';
