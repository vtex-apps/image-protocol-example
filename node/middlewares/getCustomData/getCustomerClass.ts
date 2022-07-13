import { parse } from 'querystring'

export async function getUserCustomerClass(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { masterdata },
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

    const [{ customerClass }] = client

    ctx.state.customerClass = customerClass

    await next()
  } else {
    await next()
  }
}
