module.exports = function imageProxyHandler(req, res, routeParams) {
  const { operations } = routeParams;
  if (!operations) {
    return res.end(
      'Use this format to transform image: /resize:w100:h500/compress:75',
    );
  }

  res.end(`These operations will be applied: ${JSON.stringify(operations)}`);
};
