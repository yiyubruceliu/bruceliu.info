// import $ from "jquery";
// const jQuery = require("./js/jquery-2.2.4.min.js");
// const $ = require("./lib/jquery/jquery.min.js");

export function getSEOKeywords(text) {
    // var natural = require('natural');
    // Split the text into individual words
    const words = text.split(' ');
    console.log(words);
    const stemmer = natural.PorterStemmer;            
    
    // Remove common words and words that are less than a certain length
    let keywords = words.filter(word => {
        const commonWords = ['and', 'the', 'a', 'an'];
        
        return !commonWords.includes(word) && word.length > 3;
    });

    //stem the text
    keywords = stemmer.tokenizeAndStem(keywords);
    console.log(keywords);

    // Count the number of times each keyword appears in the text
    const keywordCounts = {};
    keywords.forEach(keyword => {
        if (keywordCounts[keyword]) {
            keywordCounts[keyword]++;
        } else {
            keywordCounts[keyword] = 1;
        }
    });

    // Sort the keywords by the number of times they appear in the text
    const sortedKeywords = keywords.sort((a, b) => keywordCounts[b] - keywordCounts[a]);

    // Use a Set object to remove duplicates from the sorted keywords
    const uniqueKeywords = new Set(sortedKeywords);

    // Return the most frequently used keywords
    return Array.from(uniqueKeywords).slice(0, 10);
}

export function findKeyword(){
    console.log("start");
    //input
    let text = 'lazy The quick brown fox jumps over the lazy dog';
    // text = document.getElementById("msgBody").value;

    //process
    const keywords = getSEOKeywords(text);

    //output
    document.getElementById("lblOutput").innerText = keywords;
}