#!/usr/bin/env node

var start = 1;


async1(start)
    .then(async2)
    .then(async3)
    .then(result => {
        console.log(result); // 24
    });

function async1 (param) {
    return new Promise(function(resolve, reject) {
        resolve(param*2);
    });
}
function async2 (param) {
    return new Promise(function(resolve, reject) {
        resolve(param*3);
    });
}
function async3 (param) {
    return new Promise(function(resolve, reject) {
        resolve(param*4);
    });
}
















function loadScript(src) {
  return new Promise(function(resolve, reject) {
    let script = document.createElement('script');
    script.src = src;

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Script load error for ${src}`));

    document.head.append(script);
  });
}

let promise = loadScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js");



promise.then(
  script => alert(`${script.src} is loaded!`),
  error => alert(`Error: ${error.message}`)
);

promise.then(script => alert('Another handler...'));
