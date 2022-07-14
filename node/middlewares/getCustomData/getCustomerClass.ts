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

  if (queryString?.userId !== 'undefined') {
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
        message: `User fetched from masterdata from userId: ${queryString.userId}`,
        detail: {
          client,
        },
      },
      LogLevel.Info
    )

    const [{ customerClass }] = client

    ctx.state.customerClass = customerClass

    await next()
  } else {
    await next()
  }
}
