/**
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
// Export a default object containing event handlers
export default {
	// The fetch handler is invoked when this worker receives a HTTP(S) request
	// and should return a Response (optionally wrapped in a Promise)
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// You'll find it helpful to parse the request.url string into a URL object. Learn more at https://developer.mozilla.org/en-US/docs/Web/API/URL
		const url = new URL(request.url)
		const objectName = url.pathname.slice(1)

		console.log(`${request.method} object ${objectName}: ${request.url}`)

		if (request.method === 'GET' || request.method === 'HEAD') {
			if (objectName === '') {
				if (request.method == 'HEAD') {
					return new Response(undefined, { status: 400 })
				}

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
		}

		return new Response(`Unprocessable request`, {
			status: 422
		})
	}
};
