// import $ from "jquery";
// const jQuery = require("./js/jquery-2.2.4.min.js");

import item from 'outlayer/item';

// const $ = require("./lib/jquery/jquery.min.js");
var natural = require('natural');
window.natural = natural;

export function getSEOKeywords(text) {
    
    // Split the text into individual words
    const words = text.split(' ');
    const stemmer = natural.PorterStemmer;            
    
    // Remove common words and words that are less than a certain length
    let keywords = words.filter(word => {
        const stopWords = natural.stopwords;
        return !stopWords.includes(word) && word.length > 3  && /^[a-zA-Z]+$/.test(word);
    });
    console.log(keywords);
    //stem the text
    stemmedKeywords = keywords.map(keyword => stemmer.stem(keyword));

    ngrammedKeywords = natural.NGrams.ngrams(keywords, 2);
    console.log(ngrammedKeywords);

    // Count the number of times each keyword appears in the text
    const keywordCounts = {};
    ngrammedKeywords.forEach(keyword => {
        if (keywordCounts[keyword]) {
            keywordCounts[keyword]++;
        } else {
            keywordCounts[keyword] = 1;
        }
    });

    // Sort the keywords by the number of times they appear in the text
    const sortedKeywords = ngrammedKeywords.sort((a, b) => keywordCounts[b] - keywordCounts[a]);

    // Use a Set object to remove duplicates from the sorted keywords
    const uniqueKeywords = new Set(sortedKeywords);

    // Return the most frequently used keywords
    return Array.from(uniqueKeywords).slice(0, 10).map(item=>{
        return `${item[0]} ${item[1]}`;
    });
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
