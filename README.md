# Node File Router

A file-based routing for Node.js. 
Supports pure Node.js and Express.

* **0** dependencies
* **CommonJS** and **ES modules** support
* **TypeScript** support
* **100%** test coverage

```js
// file: /api/documents/[documentId]/drafts/[draftId].js

export default {
  get(req, res, routeParams) {
    const { documentId, draftId } = routeParams;
    res.end(`Requested document ${documentId} and his draft ${draftId}`);
  },
  post(req, res, routeParams) {
    const { documentId, draftId } = routeParams;
    res.end(`Created draft ${draftId} for document ${documentId}`);
  },
  patch(req, res, routeParams) {
  },
}
```

```js
// https://api-shop.com/summer/sneakers/nike
// file: /api/shop/[...categories].ts

export default function(req, res, { categories }) {
  // categories -> ['summer', 'sneakers', 'nike'];
}
```

##  Install

```
npm install node-file-router
```

```
yarn add node-file-router
```

```
pnpm add node-file-router
```

# Guide

