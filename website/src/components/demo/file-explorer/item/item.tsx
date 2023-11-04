import React, { memo } from 'react';
import clsx from 'clsx';
import { Folder, JsFile } from '@site/src/components/demo/file-explorer/file-explorer.types';

import './item.styles.scss';

interface Props {
  data: (JsFile | Folder)[];
}

export const Item = memo<Props>(({ data, level = 0 }) => {
  return (
    <>
      <div
        className={clsx('catalog-item', `catalog-item--level-${level}`, data.isSelected && 'catalog-item--selected')}>
        {data.children && (
          <div className={clsx('catalog-item__arrow', data.closed && 'catalog-item__arrow--closed')}/>
        )}
        {data.isJsFile && <div className="catalog-item__js-file"/>}
        <div className="catalog-item__name">{data.name}</div>
      </div>
      {(data.children || []).map(child => <Item level={level + 1} key={child.name} data={child}/>)}
    </>
  )
});

Item.displayName = 'Item';
