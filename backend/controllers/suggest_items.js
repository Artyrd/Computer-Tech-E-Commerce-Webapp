const { productInfoAllQuery, productTagsQuery  } = require('./products');


/**
 * Given an array of recently viewed items, suggests similar items
 * Defaults to 10 min suggested, unless req.body.num is specified
 */
const generateSuggestedProducts = async (req, res, next) => {
    try {
        let suggestedNum = 10;
        let recentItems = req.body.products;
        const currentItem = recentItems[0];
        console.log('currentItem')
        console.log(currentItem)
        recentItems.splice(10)
        // recentItems.push(currentItem);
        if (!isNaN(req.body.num)) {
            suggestedNum = req.body.num;
        }
        if (!Array.isArray(recentItems) || recentItems.length === 0 ) {
            res.status(400).json({error: 'nothing to recommend'});
            return;
        }
        let relevantCategories = {};
        let currentCategory = '';

        const allProductsInfo = await productInfoAllQuery();
        for (const product of allProductsInfo) {
            const productId = product['id'];
            // promiseList.push(productTagsQuery(productId));
            if (recentItems.includes(productId)) {
                const category = product['category'];
                if (relevantCategories[`${category}`]) {
                    relevantCategories[`${category}`] += 1;
                } else {
                    relevantCategories[`${category}`] = 1;
                }
            }
            if (productId === currentItem) {
                currentCategory = product['category'];
            }
        }
        console.log(relevantCategories);
        let relevantCategoriesArray = []
        for (const category in relevantCategories) {
            relevantCategoriesArray.push(category)
        }
        relevantCategoriesArray.sort((a,b) => relevantCategories[`${b}`] > relevantCategories[`${a}`]);
        relevantCategoriesArray.splice(3);
        relevantCategoriesArray.unshift(currentCategory);
        console.log(' rell cats:');
        console.log(relevantCategoriesArray);

        let relatedProducts = allProductsInfo.filter((product) => relevantCategoriesArray.includes(product['category']))
        // console.log(relatedProducts);

        let promiseList = [];
        for (const productId of recentItems) {
            promiseList.push(productTagsQuery(productId));
        }
        const recentItemTagsResult = await Promise.all(promiseList);
        let allRecentItemTags = []
        for (const tagArray of recentItemTagsResult) {
            for (const tag of tagArray) {
                let splitTag = tag.split(' ');
                allRecentItemTags.push(...splitTag.map((tagStr) => tagStr.toUpperCase()));
            }
        }
        let recentItemTags = {};
        for (const tag of allRecentItemTags) {
            if (recentItemTags[`${tag}`]) {
                recentItemTags[`${tag}`] += 1;
            } else {
                recentItemTags[`${tag}`] = 1;
            }
        }
        // create an array of the tags which appear the most in recent history
        let relevantTags = [];
        for (const tag in recentItemTags) {
            relevantTags.push([tag, recentItemTags[`${tag}`]]);
        }
        relevantTags.sort((a, b) => {
            return b[1] - a[1];
        });
        relevantTags = relevantTags.map((entry) => entry[0]);
        // console.log(relevantTags);

        // now we have most popular tags, and related products,
        // filter related products by tags until we have a reasonable amount
        let suggestedIds = relatedProducts.map((product) => product['id']);
        suggestedIds = suggestedIds.filter(id => (id !== currentItem));

        let relatedTags = {};
        promiseList = [];
        for (const product of relatedProducts) {
            const productId = product['id'];
            promiseList.push(productTagsQuery(productId));
        }
        const relatedProductsTagsRes = await Promise.all(promiseList); 
        for (const indx in relatedProductsTagsRes) {
            const product = relatedProducts[indx];
            let relatedProductTags = [];
            for (const tag of  relatedProductsTagsRes[indx]) {
                const splitResTag = tag.split(' ');
                relatedProductTags.push(...splitResTag.map((tagStr) => tagStr.toUpperCase()));
            }
            relatedTags[`${product.id}`] = relatedProductTags;
        }
        let oldSuggested = suggestedIds;
        for (const tag of relevantTags) {
            oldSuggested = suggestedIds;
            suggestedIds = suggestedIds.filter(id => relatedTags[`${id}`].includes(tag));
            if (suggestedIds.length < suggestedNum) {
                suggestedIds = oldSuggested;
                break;
            }
        }
        let result = relatedProducts.filter((product) => suggestedIds.includes(product['id']));
        // console.log('SUGGESTED PRODUCTS:')
        // console.log(result);

        res.status(200).json({products: result});
    }
    catch (err) {
        console.log(`There was a problem finding suggested items: ${err}`);
        res.status(400).json({error: `There was a problem finding suggested items: ${err}`});
    }
}

module.exports = {
    generateSuggestedProducts
}