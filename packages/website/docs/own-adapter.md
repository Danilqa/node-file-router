# Custom Adapter

Для того, чтобы использовать протоколы отличные от http или другие фреймворки можно написать свой адаптер.
Для этого нужно передать в свойство `adapter` следующие свойства:

| Param     | Description |
|-----------|-------------|
| getPathname  | -           |
| getMethod | -           |
| defaultNotFoundHandler  | -           |

Пример:
```
  const useFileRouter = await initFileRouter({
    baseDir: `${__dirname}/api`,
    adapter: <SocketAdapter>{
      getPathname: incomeMessage => incomeMessage.path,
      getMethod: incomeMessage => incomeMessage.action,
      defaultNotFoundHandler: (incomeMessage, ws) => ws.send(`${incomeMessage.path} is not found.`)
    }
  });
```