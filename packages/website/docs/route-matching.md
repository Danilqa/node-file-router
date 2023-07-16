---
sidebar_position: 2
---

# Route Matching

## Direct Matching

A URL can precisely reflect the path to a specific file in your project's structure. For example, 
`/products/top-10` would invoke the file `/products/top-10.js`.

Use `index.js` when there is nesting in the path, but you also want it to be invoked. 
For instance, `/products/top-10` will map to either `/products/top-10.js` or `/products/top-10/index.js`.

| Route              | Example URL      | params |
|--------------------|------------------|------|
| /index.js          | /                |        |
| /products/index.js | /products        ||
| /products/top-10.js | /products/top-10 |              |

## Exact Matching

To catch exactly one parameter, use the following syntax in the folder or file name: `[paramName]`.

| Route                                    | Example URL              | Params                             | Notes                                                      |
|------------------------------------------|--------------------------|------------------------------------|------------------------------------------------------------|
| /products/[id].js                        | /products/`123`            | ```{ id: '123'  }```           |                                                            |
| /categories/[catId]/products/[prodId].js | /categories/`1`/products/`2` | ```{ catId: '1', prodId: '2'  }``` | Any nesting level                             |
| /categories/[id]/products/[id].js        | /categories/`1`/products/`2` | ```{ id: '2'  }```                 | If slug ids have the same name, the last will be taken     |
| /products/top-10.js                      | /products/`top-10`         |                                    | You still can use direct match. It will be prioritized over dynamic matchings |


## Catching All

This type of matching can catch a list of slugs. Works only if they are provided.

| Route                          | Example URL                    | Params                                             | Notes                     |
|--------------------------------|--------------------------------|----------------------------------------------------|---------------------------|
| /categories/[...categories].js | /categories/men/shoes/sneakers | ```{ categories: ['men', 'shoes', 'sneakers'] }``` |                           |
| /categories/[...categories].js | /categories/men                | ```{ categories: ['men'] }```                      |                           |
| /categories/[...categories].js | /categories                    | x                                                  | Won't catch anything, 404 |

## Optional Catching All

This is almost the same is the previous one. The main difference is that it includes the root when no params are
specified.

| Route                            | Example URL                    | Params                                             | Notes                       |
|----------------------------------|--------------------------------|----------------------------------------------------|-----------------------------|
| /categories/[[...categories]].js | /categories/men/shoes/sneakers | ```{ categories: ['men', 'shoes', 'sneakers'] }``` |                             |
| /categories/[[...categories]].js | /categories/men                | ```{ categories: ['men'] }```                      |                             |
| /categories/[[...categories]].js | /categories                    |                                                | Will be caught in this case |
