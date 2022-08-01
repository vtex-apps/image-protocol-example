import { LogLevel } from '@vtex/api'

export async function errorHandler(ctx: Context, next: () => Promise<void>) {
  const {
    vtex: { logger },
  } = ctx

  try {
    await next()
  } catch (error) {
    logger.log(
      {
        message: error.message,
        error,
      },
      LogLevel.Error
    )

    ctx.status = error.status || 500
    ctx.body = error.message
    ctx.app.emit('error', error, ctx)
  }
}
