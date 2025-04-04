const posts = document.querySelector(".posts");

async function getPosts() {
  const url = "http://lucasbeltoft.dk/wp-json/wp/v2/posts";

  const response = await fetch(url);

  const json = await response.json();
  console.log(json);

  const postsEl = document.querySelector(".posts");
  for (const item of json) {
  }

  let tagResponse = await fetch("http://lucasbeltoft.dk/wp-json/wp/v2/posts");
  let posts = await tagResponse.json();

  for (const post of posts) {
    let imageResponse = await fetch(
      "http://lucasbeltoft.dk/wp-json/wp/v2/media/" + post.featured_media
    );
    let imageData = await imageResponse.json();

    const tagEl = document.querySelector(".tagContainer")
    for (const tag of post.tags) {
      
      let tagResponse = await fetch("http://lucasbeltoft.dk/wp-json/wp/v2/tags/" + tag)
      let tagsData = await tagResponse.json();
      tagEl.innerHTML += `<button>${tagsData.name}</button>`


    }

    postsEl.innerHTML += `<img src="${imageData.guid.rendered}" alt=""></img>`;
    postsEl.innerHTML += `<h2>${post.title.rendered}</h2>`;
  }
}

getPosts();
