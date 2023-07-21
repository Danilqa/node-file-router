# Node File Router

<img align="right" width="92" height="92" title="Node File Router Logo"
src="./docs/images/logo.png" />

A file-based routing for Node.js.

* **Technology Agnostic**: 
  * Pure Node HTTP
  * Express
  * Sockets
  * ... whatever compatible with the interface
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

# Documentation

Visit [website](https://danilqa.github.io/node-file-router/docs/getting-started) to get started and view 
the full documentation.
