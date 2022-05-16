/* eslint-disable no-console */
export const customerClassInfo = async (
  _: any,
  { userId }: { userId: string },
  ctx: Context
) => {
  if (userId === '') {
    return ''
  }

  const {
    clients: { masterdata },
  } = ctx

  const aux = await masterdata.searchDocuments({
    dataEntity: 'CL',
    where: `userId=${userId}`,
    fields: ['customerClass'],
    pagination: { page: 1, pageSize: 10 },
  })

  console.log(aux)

  return aux
}
