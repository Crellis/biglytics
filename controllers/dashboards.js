/**
 * GET /dashboards
 * Dashboards page.
 */
exports.index = function(req, res) {
  res.render('dashboards', {
    title: 'Dashboards'
  });
};
