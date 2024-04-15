import fastify from 'fastify';
import {z} from 'zod';
import {sql} from "./lib/postgres";
import postgres from "postgres";
import {redis} from "./lib/redis";

const app = fastify();

const port = 8080;

app.get('/api/links', async (req, res) => {
     return sql`
        SELECT * FROM url_shortening
        ORDER BY created_at DESC
    `;
})

app.post('/api/links', async ( req, res) => {
    const createLinkSchema = z.object({
        code: z.string().min(3),
        url: z.string().url()
    });

    const {code, url} = createLinkSchema.parse(req.body);

    try {
        const result = await sql`
        INSERT INTO url_shortening (code, original_url)
        VALUES (${code}, ${url})
        RETURNING id
    `

        const link = result[0]

        return res.status(200).send({shortLinkId: link.id})
    } catch (error) {
        if (error instanceof postgres.PostgresError) {
            if (error.code === '23505') {
                return res.status(400).send({message: 'Duplicated code!'})
            }
        }
    }
})

app.get('/:code', async (req, res) => {
    const getLinkSchema = z.object({
        code: z.string().min(3)
    })

    const {code} = getLinkSchema.parse(req.params);

    const result = await sql`
        SELECT id, original_url
        FROM url_shortening
        WHERE short_links.code = ${code}
    `

    if (!result.length) {
        return res.status(400).send({message: 'Link not found.'});
    }

    const link = result[0];

    await redis.zIncrBy('metrics', 1, link.id);

    return res.redirect(301, link.original_url);
})

app.get('/api/metrics', async (req, res) => {
    const result = await redis.zRangeByScoreWithScores('metrics', 0, 50);

    return result
            .sort((a, b) => a.score - b.score)
            .map(item => {
                return {
                    shortLinkId: Number(item.value),
                    clicks: item.score
                }
            })
})

app.listen({
    port
}).then(() => console.log(`Server is listening on port: ${port}`));