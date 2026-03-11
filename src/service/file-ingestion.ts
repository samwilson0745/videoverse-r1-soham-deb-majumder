import { XMLParser } from "fast-xml-parser";
import { Article as ArticleModel } from "../models/article";
import { Article as ArticleType } from "../types/article";

// Simple cache that will grow forever to avoid redundant DB checks
const urlCache = new Set<string>();

export async function fileFetchingAndParsing(url: string): Promise<any[]> {
    try {
        const response = await fetch(url);

        // 1. Get the raw XML string from the response
        const xmlData = await response.text();

        // 2. Initialize parser
        const parser = new XMLParser({
            ignoreAttributes: false,
            removeNSPrefix: true // Helps with namespaces like news:title
        });

        // 3. Directly add the rawXML string to the parser
        const jsonObj = parser.parse(xmlData);

        // 4. Map the sitemap structure to your Article model
        const urlList = jsonObj.urlset?.url || [];
        const articles = Array.isArray(urlList) ? urlList : [urlList];

        // console.log(articles)
        for (const item of articles) {
            if (!item.news) continue;

            // let isDuplicateArticle = await checkDuplicate(item.loc)
            if (urlCache.has(item.loc)) continue;

            // Check if all required fields are present
            if (!item.loc || 
                !item.news.title || 
                !item.news.publication_date || 
                !item.news.publication?.name || 
                !item.news.publication?.language) {
                console.warn(`Skipping item due to missing required fields: ${item.loc || 'unknown URL'}`);
                continue;
            }

            const articleAttrs: ArticleType = {
                url: item.loc,
                publication_name: item.news.publication.name,
                publication_language: item.news.publication.language,
                publication_date: item.news.publication_date,
                title: item.news.title,
                keywords: item.news.keywords ? item.news.keywords.split(',').map((k: string) => k.trim()) : []
            };

            const article = ArticleModel.build(articleAttrs);
            await article.save();
            // Add to cache after successful save
            urlCache.add(item.loc);
        }

        console.log(`Successfully ingested ${articles.length} news items.`);
        return articles
    } catch (err) {
        console.error("Error fetching or parsing XML:", err);
        throw err;
    }
}

// async function checkDuplicate(url: string): Promise<boolean> {
//     try {
//         let article = await Article.findOne({
//             url: url
//         })
//         if (!article) {
//             return false
//         }
//         return true
//     } catch (err) {
//         throw err
//     }
// }