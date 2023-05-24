export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url)
		const objectName = url.pathname.slice(1)

		console.log(`${request.method} object ${objectName}: ${request.url}`)

		if (request.method === 'GET') {
			const options: R2ListOptions = {
				prefix: url.searchParams.get('prefix') ?? undefined,
				delimiter: url.searchParams.get('delimiter') ?? undefined,
				cursor: url.searchParams.get('cursor') ?? undefined,
			}
			console.log(JSON.stringify(options))

			const listing = await env.PRISMA_BUILDS_BUCKET.list(options)
			return new Response(JSON.stringify(listing), {
				headers: {
					'content-type': 'application/json; charset=UTF-8',
				}
			})
		}

		return new Response(`Unprocessable request`, {
			status: 422
		})
	}
};
