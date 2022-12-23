var natural = require('natural');
window.natural = natural;

function filterStopWordsAndSymbols(words) {
    const stopWords = natural.stopwords;
    let keywords = words.filter(word => {
        return !stopWords.includes(word) && word.length > 3 && /^[a-zA-Z]+$/.test(word);
    });
    return keywords;
}

function getUniqueBigramList(ngrammedKeywords) {
    uniqueBiGrams = [];
    ngrammedKeywords.map(bigram => {
        let exists = false;
        bigram.map(keyword => {
            exists = uniqueBiGrams.some(innerArray => innerArray.includes(keyword));
        });

        if (!exists) {
            uniqueBiGrams.push(bigram);
        }
    });

    return uniqueBiGrams;
}

export function getSEOKeywords(text) {
    console.log("new changes");
    // Split the text into individual words
    const words = text.split(' ');          
    
    // Remove common words and words that are less than a certain length
    let keywords = filterStopWordsAndSymbols(words);

    //creating bi-grams
    ngrammedKeywords = natural.NGrams.ngrams(keywords, 2);

        // Count the number of times each keyword appears in the text
    const keywordCounts = countKeywords();

    // Sort the keywords by the number of times they appear in the text
    const sortedKeywords = ngrammedKeywords.sort((a, b) => keywordCounts[b] - keywordCounts[a]);

    // Use a Set object to remove duplicates from the sorted keywords
    const uniqueKeywords = getUniqueBigramList(sortedKeywords);
    console.log("uniquekeywords >>", uniqueKeywords);
    
    // Return the most frequently used keywords
    return Array.from(uniqueKeywords).slice(0, 10).map(item=>{
        return `${item[0]} ${item[1]}`;
    });
}


function countKeywords() {
    const keywordCounts = {};
    ngrammedKeywords.forEach(keyword => {
        if (keywordCounts[keyword]) {
            keywordCounts[keyword]++;
        } else {
            keywordCounts[keyword] = 1;
        }
    });
    return keywordCounts;
}

export function findKeyword(){
    //input
    let text = 'lazy The quick brown fox jumps over the lazy dog';
    text = document.getElementById("msgBody").value;
    //process
    const keywords = getSEOKeywords(text);

    //output
    document.getElementById("lblOutput").innerText = `<meta name="keyword" content="${keywords}">`;
}
