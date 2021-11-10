const newest = document.querySelector("#newest");
const populer = document.querySelector("#populer");
// const url = "https://api-ngeblog.herokuapp.com";
const url = "http://localhost/ngeblog/";

let myHeaders = new Headers();
myHeaders.append("Accept", "application/json");

const templateArticles = (data, timestamps) => `
  <article>
    <picture>
      <img src="${data.foto}" alt=""/>
    </picture>
    <div>
      <div class="article-header">
        <h2>${data.title}</h2>
        <time datetime="${timestamps}">${timestamps}</time>
      </div>

      <div class="article-body">
        ${data.content}
      </div>
    </div>
  </article>
`;

async function getArticles(keywords = null) {
  let response = undefined;

  switch (keywords) {
    case "newest":
      response = await fetch(url + "?artikel=newest").then(
        (response) => response
      );
      break;

    case "populer":
      response = await fetch(url + "?artikel=populer").then(
        (response) => response
      );
      break;

    default:
      response = await fetch(url).then((response) => response);
  }

  return response.json();
}

getArticles().then((response) => {
  const today = new Date();

  response.map((item) => {
    if (today.getTime() === new Date(item.createdAt).getTime()) {
      console.log("artikel terbaru");
    } else {
      newest.innerHTML += templateArticles(
        item,
        today.getTime() === new Date(item.updatedAt).getTime()
          ? item.updatedAt
          : item.createdAt
      );
    }
  });
});

getArticles("populer").then((response) => {
  const today = new Date();

  response.map((item) => {
    populer.innerHTML += templateArticles(
      item,
      today.getTime() === new Date(item.updatedAt).getTime()
        ? item.updatedAt
        : item.createdAt
    );
  });
});
