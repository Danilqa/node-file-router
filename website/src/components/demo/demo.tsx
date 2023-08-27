import React from 'react';
import './demo.styles.scss';

export function Demo() {
  return (
    <div className="container">
      <div className="urls-selector">
        <div className="url-bar">
          /collections/
          <span className="url-bar__slug">12</span>
          /products/
          <span>25</span>
          /
        </div>
      </div>
    </div>
  )
}
