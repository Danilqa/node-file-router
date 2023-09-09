const db = {
  13: { id: '13', name: 'Dan' }
}

export default {
  get(req, routeParams) {
    const user = db[routeParams.id];
    return new Response(JSON.stringify(user || 'try id 13'), { headers: { 'Content-Type': 'application/json' } });
  },
  async put(req, routeParams) {
    db[routeParams.id] = await req.json();
    return new Response(
      JSON.stringify(db[routeParams.id]),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}