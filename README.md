# Node File Router

<img align="right" width="92" height="92" title="Node File Router Logo"
src="./static/images/logo.png" />

[![product of the week](./static/images/devhunt-badge.svg)](https://devhunt.org/tool/node-file-router)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f0e2838a1ddf48a89bec571a0f692834)](https://app.codacy.com/gh/Danilqa/node-file-router?utm_source=github.com&utm_medium=referral&utm_content=Danilqa/node-file-router&utm_campaign=Badge_Grade)
[![ci Status](https://github.com/danilqa/node-file-router/actions/workflows/deploy.yml/badge.svg)](https://github.com/Danilqa/node-file-router/actions)
[![npm downloads](https://snyk.io/test/github/danilqa/node-file-router/badge.svg)](https://snyk.io/test/github/danilqa/node-file-router)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/danilqa/node-file-router/blob/main/LICENSE)

A powerful file-based routing for Node.js. 

It simplifies the creation and organization of API services.
You can effortlessly map your project's file structure to your API endpoints, enabling a clear and maintainable codebase.

* **Technology Agnostic**: 
  * Express
  * Pure Node HTTP
  * Bun
  * Sockets
  * ... whatever compatible with the interface
* **0** dependencies
* **CommonJS** and **ES modules** support
* **TypeScript** support
* **100%** test coverage
* **Middlewares** support

# Overview

Imagine you have a project with the following structure:
```
api/
├── profile/
│   ├── middlware.ts - middleware for profile
│   └── orders.[post].ts - methods in any filenames
├── catalog/
│   └── [[...tags]].ts - several segments
├── collection/
│   └── [cid]/ - slugs in folders
│       └── products/
│           └── [pid].ts - slugs in files
├── index.ts - root
├── middleware.ts - middleware for all routes
└── _404.ts - not found response    
```

Node File Router will automatically map it to your API endpoints:
* [POST]: /profile/orders → `/api/profile/orders.[post].ts`
* /catalog/men/black/denim → `/api/catalog/[[...tags]].ts`
* /collection/77/products/13 → `/api/collection/[cid]/products/[pid].ts`
* / → `index.ts`

Some examples of how your file handlers can be written:

Methods in a file
```js
export default {
  get(req, res, routeParams) {},
  post(req, res, routeParams) {},
  patch(req, res, routeParams) {},
}
```

Single response function
```js
export default function (req, res, routeParams) {}
```

Middlewares chain
```js
export default [
  useErrorHandler,
  useLogger,
  useAuthGuard,
];
```

# Documentation

```bash
npm i node-file-router
```

Visit [website](https://node-file-router.js.org/) to get started and view 
the full documentation.

Usage:
* [Getting started](https://node-file-router.js.org/docs/getting-started)
* [Usage guide](https://node-file-router.js.org/docs/usage-guide)
  * [Configuration](https://node-file-router.js.org/docs/usage-guide#configuration)
* [Usage with Bun](https://node-file-router.js.org/docs/use-with-bun)

Methods routing:
* [Any method](https://node-file-router.js.org/docs/usage-guide#any-method)
* [Object with methods](https://node-file-router.js.org/docs/usage-guide#object-with-methods)
* [Methods in filenames](https://node-file-router.js.org/docs/usage-guide#methods-in-filenames)

Route matching:
* [Plain match](https://node-file-router.js.org/docs/route-matching#direct-matching) - /plain/route/
* [Exact slug](https://node-file-router.js.org/docs/route-matching#exact-matching) - /[id]/
* [Catching all](https://node-file-router.js.org/docs/route-matching#catching-all) - /[id1]/[id2]/[idn]/
* [Optional catching all](https://node-file-router.js.org/docs/route-matching#optional-catching-all) - ?/[id1]/[id2]/[idn]/

Support other protocols and frameworks:
* [Custom adapter](https://node-file-router.js.org/docs/custom-adapter)

Middlewares:
* [Usage and examples](https://node-file-router.js.org/docs/middlewares)

# Examples

Visit [examples folder](https://github.com/Danilqa/node-file-router/tree/main/examples) to see samples with 
different module systems, adapters, and use cases.

# Support

I usually respond within 24 hours. Fixes typically take 1-3 days. Additionally, I provide time estimations for 
new features and fixes. Feel free to ask questions, voice ideas, and share your projects on [Github Discussion](https://github.com/Danilqa/node-file-router/discussions).

# Developing

To begin development and contribution, read [this guide](/contributing/developing.md).