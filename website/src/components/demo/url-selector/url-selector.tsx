import React, { memo, ReactNode } from 'react';
import clsx from 'clsx';

import './url-selector.styles.scss';

interface Props {
  data: (string | ReactNode)[]
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const UrlSelector = memo<Props>(({ selectedIndex, data, onSelect }) => {
  return (
    <div className="urls-selector">
      {data.map((content, i) => (
        <div
          key={i}
          className={clsx('url-bar', i === selectedIndex && 'url-bar--selected')}
          onClick={() => onSelect(i)}
        >
          <div className="url-bar--icon"/>
          {content}
        </div>)
      )}
    </div>
  )
});

UrlSelector.displayName = 'UrlSelector';