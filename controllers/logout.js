/**
 * GET /
 * Logout page.
 */
exports.index = function(req, res) {
  res.render('logout', {
    title: 'Logout'
  });
};
