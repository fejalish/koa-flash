/**
 * Initialize flash middleware with `opts`
 *
 * - `key` session property name (default: koa-flash)
 * - `defaultValue` default value for this.flash (default: {})
 *
 * @param {Object} opts
 * @return {GeneratorFunction}
 * @api public
 */

module.exports = function (opts) {
  var opts = opts || {};
  var key = opts.key || 'koa-flash';
  var defaultValue = opts.defaultValue || {};

  return async (ctx, next) => {
    if (ctx.session === undefined) throw new Error('koa-flash requires the koa-session middleware.');

    var data = ctx.session[key] || defaultValue;

    Object.defineProperty(ctx, 'flash', {
      enumerable: true,
      get: function() {
        return data;
      },
      set: function(val) {
        this.session[key] = val;
      }
    });

    await next();

    if (ctx.status != 302){
      delete ctx.session[key];
    }
  };
};
