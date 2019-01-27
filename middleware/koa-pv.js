function pv(ctx) {
    ctx.session.count++
    global.console.log('pv', ctx.session)
}
module.exports = function() {
    return async function(ctx, next) {
        pv(ctx)
        await next()
    }
}