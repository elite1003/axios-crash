//axios global, putting common header , which will be passed to every req
axios.defaults.headers.common["X-Auth-Token"] =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
// GET REQUEST
function getTodos() {
  axios
    .get("https://jsonplaceholder.typicode.com/todos?_limit=5", {
      timeout: 2000,
      // validateStatus: function (status) {
      //   return status < 500; // this will return false for status greater than or equal to 500, now if this is false only then catch block will run, in other word catch will only run for status 500 and above.
      // },
    })
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// POST REQUEST //create resource
function addTodo() {
  axios
    .post("https://jsonplaceholder.typicode.com/todos", {
      title: "Sid Todo",
      completed: true,
    })
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// PUT/PATCH REQUEST //Update resource (pass the id of resource)
// put replace whole resource with updated value.
// patch incrementally add value to the resource.
function updateTodo() {
  axios
    .put("https://jsonplaceholder.typicode.com/todos/1", {
      title: "Sid Todo",
      completed: true,
    })
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      console.log(err);
    });
  // axios
  //   .patch("https://jsonplaceholder.typicode.com/todos/1", {
  //     title: "Sid Todo",
  //     completed: true,
  //   })
  //   .then((res) => {
  //     showOutput(res);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
}

// DELETE REQUEST
function removeTodo() {
  axios
    .delete("https://jsonplaceholder.typicode.com/todos/1")
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// SIMULTANEOUS DATA
function getData() {
  axios
    .all([
      axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5"),
      axios.get("https://jsonplaceholder.typicode.com/posts?_limit=5"),
    ])
    .then(
      axios.spread((todos, posts) => {
        showOutput(todos);
        // showOutput(posts);
      })
    )
    .catch((err) => console.log(err));
}

// Sending CUSTOM HEADERS
function customHeaders() {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "sometoken",
    },
  };

  axios
    .post(
      "https://jsonplaceholder.typicode.com/todos",
      {
        title: "Sid Todo",
        completed: true,
      },
      config
    )
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  axios({
    method: "post",
    url: "https://jsonplaceholder.typicode.com/todos",
    data: { title: "hello world!" },
    transformResponse: axios.defaults.transformResponse.concat((data) => {
      data.title = data.title.toUpperCase();
      return data;
    }),
  }).then((res) => {
    showOutput(res);
  });
}

// ERROR HANDLING
function errorHandling() {
  axios
    .get("https://jsonplaceholder.typicode.com/todoss")
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      if (err.response) {
        // if is true for anything other than 2xx
        console.log(err.response.status);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log(err.message);
      }
    });
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();
  axios
    .get("https://jsonplaceholder.typicode.com/todos", {
      cancelToken: source.token,
    })
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.log(err.message);
      }
    });

  if (true) {
    source.cancel("Request canceld");
  }
}

// INTERCEPTING REQUESTS & RESPONSES // runs whenever a req is sent to server
axios.interceptors.request.use(
  (config) => {
    console.log(
      `${config.method.toUpperCase()} request sent to ${
        config.url
      } at ${new Date().getTime()}`
    );
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// AXIOS INSTANCES
const axiosInstance = axios.create({
  // aur bhi custom settings hai
  baseURL: "https://jsonplaceholder.typicode.com",
});
// axiosInstance.get("/comments?_limit=5").then((res) => {
//   showOutput(res);
// });

// Show output in browser
function showOutput(res) {
  document.getElementById("res").innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById("get").addEventListener("click", getTodos);
document.getElementById("post").addEventListener("click", addTodo);
document.getElementById("update").addEventListener("click", updateTodo);
document.getElementById("delete").addEventListener("click", removeTodo);
document.getElementById("sim").addEventListener("click", getData);
document.getElementById("headers").addEventListener("click", customHeaders);
document
  .getElementById("transform")
  .addEventListener("click", transformResponse);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("cancel").addEventListener("click", cancelToken);
