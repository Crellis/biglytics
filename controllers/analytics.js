/**
 * GET /contact
 * Contact form page.
 */
exports.analytics = function(req, res) {
  res.render('analytics', {
    title: 'Analytics'
  });
};
