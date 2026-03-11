import { Article } from "../models/article";

const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute in milliseconds

interface ArticleQueryParams {
    after?: string;
    before?: string;
    page: number;
    limit: number;
}

export async function getArticles(params: ArticleQueryParams) {
    const { after, before, page, limit } = params;

    // Check cache
    const cacheKey = JSON.stringify({ after, before, page, limit });
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_TTL) {
        console.log("Serving from cache:", cacheKey);
        return cachedResponse.data;
    }

    const skip = (page - 1) * limit;
    const queryFilter: any = {};

    if (after || before) {
        queryFilter.publication_date = {};
        if (after) {
            queryFilter.publication_date.$gte = new Date(after);
        }
        if (before) {
            queryFilter.publication_date.$lte = new Date(before);
        }
    }

    const articles = await Article.find(queryFilter)
        .sort({ publication_date: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Article.countDocuments(queryFilter);

    const responseData = {
        data: articles,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    };

    // Store in cache
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    return responseData;
}
