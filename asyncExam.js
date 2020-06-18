async function checkCas(){
 var status = await changeStatus()
}

changeStatus(){
 status = true
}


function fetchItems() {
  return new Promise(function(resolve, reject) {
    var items = [1,2,3];
    resolve(items)
  });
}


async function logItems() {
  var resultItems = await fetchItems();
  console.log(resultItems); // [1,2,3]
}


function fetchUser() {
  var url = 'https://jsonplaceholder.typicode.com/users/1'
  return fetch(url).then(function(response) {
    return response.json();
  });
}

function fetchTodo() {
  var url = 'https://jsonplaceholder.typicode.com/todos/1';
  return fetch(url).then(function(response) {
    return response.json();
  });
}


async function logTodoTitle() {
  try {
    var user = await fetchUser();
    if (user.id === 1) {
      var todo = await fetchTodo();
      console.log(todo.title); // delectus aut autem
    }
  } catch (error) {
    console.log(error);
  }
}












function getRedirectsTo(xhr) {
    if (xhr.status < 400 && xhr.status >= 300) {
        return xhr.getResponseHeader("Location");
    }
    if (xhr.responseURL && xhr.responseURL != url) {
        return xhr.responseURL;
    }

    return null;
}

function getRedirectUrl(url, redirectCount) {
    redirectCount = redirectCount || 0;

    if (redirectCount > 10) {
        throw new Error("Redirected too many times.");
    }

    return new Promise(function (resolve) {
        var xhr = new XMLHttpRequest();

        xhr.onload = function () {
            resolve(getRedirectsTo(xhr));
        };

        xhr.open('HEAD', url, true);
        xhr.send();
    })
    .then(function (redirectsTo) {
        return redirectsTo
            ? getRedirectUrl(redirectsTo, redirectCount + 1)
            : url;
    });
}


let i = 0;
const countToTen = () => new Promise((resolve, reject) => {
    if (i < 10) {
      i++;
      console.log("i is now: " + i);
      resolve(countToTen());
    } else {
      resolve(i);
    }
  });

countToTen().then(() => console.log("i ended up at: " + i));
