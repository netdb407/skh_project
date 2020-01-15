let globalVar;

new Promise((resolve, reject) => {
  someModule.func((err, arg) => {
    err ? reject(err) : resolve(arg)
  })
.then(arg => {
  globalVar = arg;
  console.log(globalVar);
});


versionCheck(err, arg){
  console.log('1');
}
