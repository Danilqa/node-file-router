export function createTestRequestHandler(url) {
  const filePath = url.replace(process.cwd(), '')
      .replace('/tests', '');

  return (req, res) => res.end({ req, filePath });
}

export function createTestRequestRunner(requestHandler) {
  return (url, onSuccess) => {
    requestHandler(
        { url, headers: { host: 'site' } },
        { end: onSuccess },
    );
  };
}

export function createTestMethodsRequestRunner(requestHandler) {
  return (url, method, onSuccess) => {
    requestHandler(
        { url, headers: { host: 'site' }, method },
        { end: onSuccess },
    );
  };
}
