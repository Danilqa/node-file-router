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

ProductPage.displayName = 'ProductPage';

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

CatalogPage.displayName = 'CatalogPage';

export const FavouritesPage = memo(() => {
  return (
    <div className="browser-content favourites-page">
      <div className="favourites-page__item"></div>
      <div className="favourites-page__item"></div>
      <div className="favourites-page__item"></div>
      <div className="favourites-page__item"></div>
    </div>
  )
});

FavouritesPage.displayName = 'FavouritesPage';