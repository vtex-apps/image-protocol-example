import { parse } from 'querystring'

import { LogLevel } from '@vtex/api'

export async function getUserCustomerClass(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { masterdata },
    vtex: { logger },
    querystring,
  } = ctx

  const queryString = parse(querystring)

  if (queryString?.userId !== 'undefined' && queryString?.userId.length !== 0) {
    const client: ClientMasterdataEntityType[] = await masterdata.searchDocuments(
      {
        dataEntity: 'CL',
        where: `userId=${queryString.userId}`,
        fields: ['customerClass'],
        pagination: { page: 1, pageSize: 10 },
      }
    )

    logger.log(
      {
        message: `In getCustomerClass, user fetched from masterdata from userId: ${queryString.userId}`,
        detail: {
          client,
        },
      },
      LogLevel.Info
    )

    if (client.length) {
      const [{ customerClass }] = client

      ctx.state.customerClass = customerClass ?? null
    }

    await next()
  } else {
    logger.log(
      {
        message: `In getcustomerClass, user id is undefined`,
        detail: {
          queryString,
        },
      },
      LogLevel.Info
    )
    await next()
  }
}
