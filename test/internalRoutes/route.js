const express = require('express');
const { validateRequest, validateResponse } = require('../..');

const router = express.Router();

/**
 * GET /api/birds/
 * @return {string} 200 - song response
 */
router.get('/', validateRequest(), (req, res) => res.send('success'));

/**
 * DELETE /api/birds/{id}
 * @param {number} id.path.required
 * @return {string} 200 - song response
 */
router.delete('/:id', validateRequest(), (req, res) => res.send('success'));

/**
 * GET /api/birds/error-response
 * @return {string} 200 - song response
 */
router.get('/error-response', validateRequest(), (req, res, next) => {
  try {
    const errorResponse = true;
    validateResponse(errorResponse, req, 200);
    return res.send(errorResponse);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
