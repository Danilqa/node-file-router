import React, { memo } from 'react';

import './browser-content.styles.scss';

export const ProductPage = memo(() => {
  return (
    <div className="browser-content product-page">
      <div>
        <div className="product-page__image"></div>
      </div>
      <div>
        <div className="product-page__title"></div>
        <div className="product-page__description-primary"></div>
        <div className="product-page__description-secondary"></div>
      </div>
    </div>
  )
});

export const CatalogPage = memo(() => {
  return (
    <div className="browser-content catalog-page">
      <div className="catalog-page__product"></div>
      <div className="catalog-page__product"></div>
      <div className="catalog-page__product"></div>
      <div className="catalog-page__product"></div>
      <div className="catalog-page__product"></div>
      <div className="catalog-page__product"></div>
    </div>
  )
});