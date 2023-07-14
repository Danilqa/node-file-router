---
sidebar_position: 0
---

# Direct Match

URL-адрес может точно отражать путь к конкретному файлу в структуре вашего проекта. 
Например, `/products/top-10` вызовет файл `/products/top-10.js`.

Используете index.js, 
если у пути есть вложенность, но при этом вы хотите также задействовать. Например, '/products/top-10' 
будет наложен на '/products/top-10.js' или '/products/top-10/index.js'.

| Route              | Example URL      | params |
|--------------------|------------------|------|
| /index.js          | /                |        |
| /products/index.js | /products        ||
| /products/top-10.js | /products/top-10 |              |
