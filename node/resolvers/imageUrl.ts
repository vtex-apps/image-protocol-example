/* eslint-disable no-console */
// import atob from 'atob'

/* function parseJwt(token: string) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c: string) => {
          return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`
        })
        .join('')
    )
  
    return JSON.parse(jsonPayload)
} */

export const imageUrl = async (
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

  return 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg'
}
