import React, { memo } from 'react';
import { Item } from '@site/src/components/demo/file-explorer/item/item';
import { Folder, JsFile } from '@site/src/components/demo/file-explorer/file-explorer.types';

import './file-explorer.styles.scss';

interface Props {
  data: JsFile | Folder;
}

export const FileExplorer = memo<Props>(({ data }) => {
  return (
    <div className="file-explorer">
      <div className="file-explorer__title">shop-2077</div>
      <Item data={data} />
    </div>
  )
});

FileExplorer.className = 'FileExplorer';