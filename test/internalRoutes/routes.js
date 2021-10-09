const addBaseRoutes = (app, { validateRequest, validateResponse }) => {
  /**
   * A song
   * @typedef {object} Song
   * @property {string} title.required - The title
   * @property {string} artist - The artist
   * @property {integer} year - The year
   */

  /**
   * POST /api/v1/songs
   * @param {Song} request.body.required - song info
   * @return {object} 200 - song response
   */
  app.post('/api/v1/songs', validateRequest(), (req, res) => res.send('You save a song!'));

  /**
   * PATCH /api/v1/songs
   * @return {object} 200 - song response
   */
  app.patch('/api/v1/songs', validateRequest(), (req, res) => res.send('You save a song!'));

  /**
   * POST /api/v1/albums
   * @param {array<Song>} request.body.required
   * @return {object} 200 - song response
   */
  app.post('/api/v1/albums', validateRequest({
    body: false,
    params: false,
    headers: false,
    query: false,
    required: false,
  }), (req, res) => res.send('Hello World!'));

  /**
   * POST /api/v1/name
   * @param {string} request.body.required - name body description
   * @return {object} 200 - song response
   */
  app.post('/api/v1/name', (req, res, next) => {
    try {
      validateResponse('Error string', req);
      return res.send('Hello World!');
    } catch (error) {
      return next(error);
    }
  });

  /**
   * POST /api/v2/name
   * @param {string} request.body.required - name body description
   * @return {Song} 200 - song response
   */
  app.post('/api/v2/name', (req, res, next) => {
    try {
      validateResponse('Error string', req, 200);
      return res.send('Hello World!');
    } catch (error) {
      return next(error);
    }
  });

  /**
   * GET /api/test/responses/valid
   * @return {Song} 200 - song response
   */
  app.get('/api/test/responses/valid', (req, res, next) => {
    try {
      const payload = {
        title: 'abum 1',
        extra: undefined,
      };
      validateResponse(payload, req, 200);
      return res.json(payload);
    } catch (error) {
      return next(error);
    }
  });

  /**
   * GET /api/test/responses/extra-props
   * @return {Song} 200 - song response
   */
  app.get('/api/test/responses/extra-props', (req, res, next) => {
    try {
      const payload = {
        title: 'abum 1',
        extra: 'this prop should not be here',
      };
      validateResponse(payload, req, 200);
      return res.json(payload);
    } catch (error) {
      return next(error);
    }
  });

  /**
   * GET /api/v1/albums/{id}
   * @summary This is the summary or description of the endpoint
   * @param {string} id.path.required
   * @return {object} 200 - success response - application/json
   */
  app.get('/api/v1/albums/:id', validateRequest(), (req, res) => (
    res.json([{
      title: 'abum 1',
    }])
  ));

  /**
   * GET /api/v1/albums/{id}/songs/{songId}
   * @summary This is the summary or description of the endpoint
   * @param {string} id.path.required
   * @param {number} songId.path.required
   * @return {object} 200 - success response - application/json
   */
  app.get('/api/v1/albums/:id/songs/:songId', validateRequest(), (req, res) => (
    res.json([{
      title: 'abum 1',
    }])
  ));

  /**
   * GET /api/v1/authors
   * @summary This is the summary or description of the endpoint
   * @param {string} name.query.required - name param description - enum:type1,type2
   * @param {array<string>} license.query - name param description
   * @return {object} 200 - success response - application/json
   */
  app.get('/api/v1/authors', validateRequest(), (req, res) => (
    res.json([{
      title: 'abum 1',
    }])
  ));

  /**
   * File upload
   * @typedef {object} File
   * @property {string} file.required - file upload - binary
   * @property {string} api_key.required - api key value
   */

  /**
   * POSt /file-upload
   * @param {File} request.body.required - song info - multipart/form-data
   * @return {object} 200 - success response - application/json
   */
  app.post('/file-upload', validateRequest(), (req, res) => res.json({ success: true }));
};

module.exports = addBaseRoutes;
