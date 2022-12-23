export function getImage(keyword) {
    console.log(keyword);
    const imageUrl = getUnsplashImage(keyword).then(
        url => {
            console.log(url);  // Outputs the URL of a sunset image from Unsplash
         
            document.getElementById("lblOutput").innerHTML = `<img src="${url}" alt="Girl in a jacket" width="500" height="600"> `
        }
    );
}


const unsplashAccessKey = '5s9I46xehdnkMskJ__klZ-JD-s-rijpX7cd7yyiVq9g';

async function getUnsplashImage(query) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashAccessKey}`
    );
    const data = await response.json();
    console.log(data);
    const imageUrl = data.results[0].urls.regular;
    return imageUrl;
  } catch (error) {
    console.error(error);
  }
}


