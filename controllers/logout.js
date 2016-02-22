/**
 * GET /
 * Logout page.
 */
exports.getlogout = function(req, res) {
  res.render('logout', {
    title: 'Logout'
  });
};
