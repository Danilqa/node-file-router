---
sidebar_position: 2
---

# Catch All

This type of matching can catch a list of slugs. Works only if they are provided.

| Route                          | Example URL                    | Params                                       | Notes                     |
|--------------------------------|--------------------------------|----------------------------------------------|---------------------------|
| /categories/[...categories].js | /categories/men/shoes/sneakers | ```{ categories: ['men', 'shoes', 'sneakers'] }``` |                           |
| /categories/[...categories].js | /categories/men                | ```{ categories: ['men'] }```                     |                           |
| /categories/[...categories].js | /categories                    | -                                            | Won't catch anything, 404 |