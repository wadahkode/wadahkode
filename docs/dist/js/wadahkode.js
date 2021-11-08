const articles = document.querySelector("#newest");
const url = "https://api-ngeblog.herokuapp.com";
// const url = "http://localhost/ngeblog/";

let myHeaders = new Headers();
myHeaders.append("Accept", "application/json");

const templateArticles = (data, timestamps) => `
  <article>
    <picture>
      <img src="${data.foto}" alt="..."/>
    </picture>
    <div>
      <div class="article-header">
        <h2>${data.title}</h2>
        <sub>${timestamps}</sub>
      </div>

      <div class="article-body">
        ${data.content}
      </div>
    </div>
  </article>
`;

async function getArticles() {
  const response = await fetch(url).then((response) => response);

  return response.json();
}

getArticles().then((response) => {
  const today = new Date();

  response.map((item) => {
    if (today.getTime() === new Date(item.createdAt).getTime()) {
      console.log("artikel terbaru");
    } else {
      articles.innerHTML += templateArticles(
        item,
        today.getTime() === new Date(item.updatedAt).getTime()
          ? item.updatedAt
          : item.createdAt
      );
    }
  });
});
