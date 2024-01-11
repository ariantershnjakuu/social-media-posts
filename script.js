let allPosts = [];
let updatedPostID = "";
async function loadPosts() {
  const data = await fetch(
    "https://jsonplaceholder.typicode.com/posts/?_limit=20",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((req) => req.json());
  allPosts = data;
  showPosts();
}

function showPosts() {
  const posts = document.getElementById("allposts");
  posts.innerHTML = "";
  allPosts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.innerHTML = `
        <div class='post'>
            <h2 class='post-title'>${post.title}</h2><br />
            <p class='post-body'>${post.body}</p>
            <button class='post-update' onclick="return initUpdate(${post.id})">Update</button>
            <button class='post-update' onclick='return post_view(${post.id})'>View post</button>
        </div>`;
    posts.appendChild(postDiv);
  });
}

function initUpdate(postID) {
  const title = document.getElementById("text");
  const body = document.getElementById("body");
  const postContent = allPosts.find((post) => post.id === postID);
  title.value = postContent.title;
  body.value = postContent.body;
  document.getElementById("update-form").style.display = "block";
  document.getElementById("allposts").style.display = "none";
  document.getElementById("update-button").innerText = "Update";
  updatedPostID = postID;
}
function post_view(postID) {
  allPosts = allPosts.filter((post) => post.id === postID);
  document.getElementById("update-form").style.display = "none"
  showPosts();
}
async function submit_update(e) {
  e.preventDefault();
  e.stopPropagation();
  const title = document.getElementById("text");
  const body = document.getElementById("body");
  const data = await fetch(
    "https://jsonplaceholder.typicode.com/posts/" + updatedPostID,
    {
      method: updatedPostID ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.value,
        body: body.value,
      }),
    }
  ).then((r) => r.json()).catch(r => ({
    id: updatedPostID,
    title: title.value,
    body: body.value,
  }));
  if (!updatedPostID) {
    // Create new post
    allPosts.push(data);
    showPosts();
  } else {
    const updatedPost = allPosts.find((post) => post.id === updatedPostID);
    console.log(data);
    if (updatedPost) {
      updatedPost.title = data.title;
      updatedPost.body = data.body;
    }
    console.log(updatedPost);
    document.getElementById("allposts").style.display = "block";
    document.getElementById("update-button").innerText = "Create";
  }
  title.value = "";
  body.value = "";
  updatedPostID = "";
  showPosts();
}

function init() {
  document.getElementById("update-form").onsubmit = submit_update;
  loadPosts();
}

init();
