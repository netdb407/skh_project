const PropertiesReader = require('properties-reader');
const property = require('../../propertiesReader.js')
const chalk = require('chalk')
const exec = require('child_process').exec
const fs = require('fs')
const workload_dir = property.get_server_file2_dir() // Graph/workloads
const result_dir = property.get_server_file3_dir() // Graph/result
const ssdStorage_dir = property.get_IO_watch_dir()
const IO_tracer_dir = property.get_IO_tracer_dir()
const IO_watch_dir = property.get_IO_watch_dir()
const IO_output_dir = property.get_IO_output_dir()
const orientMaster_IP = property.get_orientMaster_IP()
const nosqltests_result_dir = property.get_nosqltests_result_dir()
let status = -1 //켜져있을 때 1, 꺼져있을 때 -1, stderr일때 0
let complete_vertex = -1
let complete_edge = -1
const orientdir = property.server_orientdb_dir()
let orientdbdir = orientdir.split(',')
const hosts = property.get_nodes_IP()
let ip = hosts.split(',')

module.exports.graphbench = (opt) => {

  benchmark_name(opt)
  check_NosquTests(status)
  // console.log(opt);
  async function check_NosquTests(status) {
    let iotracer_status = await checkStatus_iotracer(status, opt.iotracer)
    // console.log('IOTRACER_STATUS', iotracer_status)
    let runtype_status = await checkStatus_runtype(status, opt.runtype)
    // console.log('RUNTYPE_STATUS', runtype_status)
    let name_status = await checkStatus_name(status, opt.name)
    // console.log('NAME', name)
    let time_status = await checkStatus_time(status, opt.time)
    // console.log('TIME', time)
    let size_status = await checkStatus_size(status, opt.size)

      if (iotracer_status == 1 && runtype_status == 1 && name_status == 1 && time_status == 1 && size_status == 1) { //
        // run_NosquTests(opt, opt.runtype)
        if (opt.iotracer == true) { // IOracer 옵션이 있을 경우Otracer 를 실행함
          let timewindow_iotracer = opt.time/1000
            ip.forEach((i) => {
              try {
                const stdout = exec(`ssh root@${i} ${IO_tracer_dir}/bin/iotracer -m /home/DeviceDriver/drive-manager ${IO_watch_dir} -i ${timewindow_iotracer} -o /home/skh/IO_OUTPUT/${opt.bmname}`)
      	 console.log(`ssh root@${i} ${IO_tracer_dir}/bin/iotracer -m /home/DeviceDriver/drive-manager  ${IO_watch_dir} -i ${timewindow_iotracer} -o /home/skh/IO_OUTPUT/${opt.bmname}`);

                console.log('----------------------------------------------------------');
                console.log(chalk.green.bold('[INFO]'), 'run iotracer : ', chalk.blue.bold(i));
                // console.log('----------------------------------------------------------');
                // exec(`ssh root@${i} ${IO_tracer_dir} -d ${IO_watch_dir}`)
              } catch (err) {
                console.log(err);
              }
            })
          }

          if(opt.runtype == 'load'){
            load_function(status, opt)
          }else if (opt.runtype == 'run'){
            run_NosquTests(status, opt)
          }else if (opt.runtype == 'loadrun'){
            loadrun_function(status, opt)
          }

      }else {
        console.log('----------------------------------------------------------');
        console.log(chalk.red.bold('[ERROR]'), 'There was an error and could not be executed.')
        console.log('----------------------------------------------------------');
      }
  }

  async function load_function(status, opt){
    let complete_vertex = await load_vertex(status, opt)
    // console.log(complete_vertex);
    if(complete_vertex == 1){
      let complete_edge = await load_edge(status, opt)
    }
  }

    async function loadrun_function(status, opt){
      complete_vertex = await load_vertex(status, opt)
      // console.log(complete_vertex);
      if(complete_vertex == 1){
        complete_edge = await load_edge(status, opt)
      }
      if(complete_vertex == 1 && complete_edge == 1){
        run_NosquTests(status, opt)
      }
    }

}


function checkStatus_iotracer(status, iotracer) {
  return new Promise(function(resolve, reject) {
    if (iotracer == true) {
      iotracing = 'true'
      // console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'iotracer :', chalk.blue.bold(iotracing));
      // console.log('----------------------------------------------------------');
    } else {
      iotracing = 'false'
      // console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'iotracer :', chalk.blue.bold(iotracing));
      // console.log('----------------------------------------------------------');
    }
    return resolve(status * -1)
  });
}

function get_IO_results(bmname, ip, runtype) {
  ip.forEach((i) => { // iotracer 종료 후

    try {
      const killiocmd = exec(`ssh root@${i} sh ${IO_tracer_dir}/killIO.sh`)
      console.log(`ssh root@${i} sh ${IO_tracer_dir}/killIO.sh`);

      console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'kill iotracer : ', chalk.blue.bold(i));
      // console.log('----------------------------------------------------------');
      // console.log(stdout);
    } catch (err) {
      console.log('kill fail');
      console.log(err);
    }
  })
}

function checkStatus_runtype(status, runtype) {
  return new Promise(function(resolve, reject) {
    if (runtype == 'load' || runtype == 'run' || runtype == 'loadrun') {
      console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'runtype :', chalk.blue.bold(runtype));
      console.log('----------------------------------------------------------');
      return resolve(status * -1)
    } else {
      console.log('----------------------------------------------------------');
      console.log(chalk.red.bold('[ERROR]'), 'runtype :', 'invalid runtype', chalk.blue.bold(runtype), `, (choose from 'load', 'run', 'loadrun')`)
      console.log('----------------------------------------------------------');
      return resolve(status * 1)
    }
  });
}


function checkStatus_name(status, name) {
  return new Promise(function(resolve, reject) {
    let file = `./${workload_dir}${name}`
    // console.log('FILE', file)
    try {
      fs.statSync(file);
      console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'workload file :', chalk.blue.bold(name));
      console.log('----------------------------------------------------------');
      return resolve(status * -1) //success : 1
    } catch (err) {
      // console.error(err);
      console.log('----------------------------------------------------------');
      console.log(chalk.red.bold('[ERROR]'), 'workload name :', 'invalid workload file', `'${name}'`)
      console.log('----------------------------------------------------------');
      return resolve(status) //fail : -1
    }
  });
}

function isNumber(s) { // 입력이 숫자인지 확인해주는 함수
  s += ''; // 문자열로 변환
  s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
  if (s == '' || isNaN(s)) return false;
  return true;
}

function checkStatus_time(status, time) {
  return new Promise(function(resolve, reject) {
    if(time == null){
      time = 10000
      console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'settime :', chalk.blue.bold(time));
      console.log('----------------------------------------------------------');
      return resolve(status * -1) //success : 1
    }else{
      if (isNumber(time)) { // 입력이 숫자
        console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), 'settime :', chalk.blue.bold(time));
        console.log('----------------------------------------------------------');
        return resolve(status * -1) //success : 1
      } else { // 입력이 숫자가 아님
        console.log('----------------------------------------------------------');
        console.log(chalk.red.bold('[ERROR]'), 'settime :', `enter time as number type.`)
        console.log('----------------------------------------------------------');
        return resolve(status) //fail : -1
      }

    }

  });
}

function checkStatus_size(status, size) {
  return new Promise(function(resolve, reject) {
    let list = ["LDBC", "LDBC1", "LDBC2", "LDBC3", "LDBC4", "LDBC5", "LDBC6", "LDBC7", "pockec", "livejournal"]
    if (list.includes(size)) { // size : LDBC, pocket, livejournal
      console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'size :', chalk.blue.bold(size));
      console.log('----------------------------------------------------------');
      return resolve(status * -1) //success : 1
    } else { // 입력이 숫자가 아님
      console.log('----------------------------------------------------------');
      console.log(chalk.red.bold('[ERROR]'), 'size :', 'invalid size', `'${size}'.`, `enter ${list}`)
      console.log('----------------------------------------------------------');
      return resolve(status) //fail : -1
    }
  });
}


function load_vertex(status) {
  return new Promise(function(resolve, reject) {
    dirnum = orientMaster_IP.split('.')
    let load_vertex_cmd = `ssh root@${orientMaster_IP} ${ssdStorage_dir}/orientdb${dirnum[dirnum.length-1]}/bin/oetl.sh LDBCP.json`
    console.log('LOAD_VERTEX_CMD', load_vertex_cmd)
    try{
      const load_vertex_exec = exec(load_vertex_cmd)
      console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'load vertex : ', chalk.blue.bold('LDBCP.json'));
      console.log('----------------------------------------------------------');

      load_vertex_exec.stdout.on('data', function(data){
        console.log(data);
        // resolve(status * -1)
      })

      load_vertex_exec.stderr.on('data', function(data){
        console.log(data);
        // resolve(status)
      })

      load_vertex_exec.on('exit', function(code){
        console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), `load vertex completed.`);
        console.log('----------------------------------------------------------');
        resolve(status * -1)
      })

    } catch(err){
      console.error(err);
      resolve(status)
    }
  });
}

//
//
// const load_vertex = () => new Promise(resolve => {
//   console.log('ㅁㅇㄹㄴㅇㅁㄹ');
//   dirnum = orientMaster_IP.split('.')
//   let load_vertex_cmd = `ssh root@${orientMaster_IP} ${ssdStorage_dir}/orientdb${dirnum[dirnum.length-1]}/bin/oetl.sh LDBCP.json`
//   console.log('LOAD_VERTEX_CMD', load_vertex_cmd)
//   try{
//     const load_vertex_exec = exec(load_vertex_cmd)
//     console.log('----------------------------------------------------------');
//     console.log(chalk.green.bold('[INFO]'), 'load vertex : ', chalk.blue.bold('LDBCP.json'));
//     console.log('----------------------------------------------------------');
//
//     load_vertex_exec.stdout.on('data', function(data){
//       console.log(data);
//     })
//
//     load_vertex_exec.on('exit', function(code){
//       resolve(status * -1)
//     })
//   } catch(err){
//     console.error(err);
//     resolve(status)
//   }
// })


function load_edge(status, opt) {
  return new Promise(function(resolve, reject) {
    dirnum = orientMaster_IP.split('.')
    let load_edge_cmd = `ssh root@${orientMaster_IP} ${ssdStorage_dir}/orientdb${dirnum[dirnum.length-1]}/bin/oetl.sh LDBCR.json`
    console.log('LOAD_EDGE_CMD', load_edge_cmd)
    try{
      const load_edge_exec = exec(load_edge_cmd)
      console.log('----------------------------------------------------------');
      console.log(chalk.green.bold('[INFO]'), 'load edge : ', chalk.blue.bold('LDBCR.json'));
      console.log('----------------------------------------------------------');

      load_edge_exec.stdout.on('data', function(data){
        console.log(data);
      })
      load_edge_exec.stderr.on('data', function(data){
        console.log(data);
      })
      load_edge_exec.on('exit', function(code){
        console.log('----------------------------------------------------------');
        console.log(chalk.green.bold('[INFO]'), `load edge completed.`);
        console.log('----------------------------------------------------------');
        resolve(status * -1)

        if(opt.runtype == 'load'){
          ip.forEach((i) => {
            try {
              dirnum = i.split('.');
              const std = exec(`ssh root@${i} ${ssdStorage_dir}/orientdb${dirnum[dirnum.length-1]}/killOrient.sh`);
              console.log('--------------------------------------');
              console.log(chalk.green.bold('[INFO]'), 'orientdb kill : ', chalk.blue.bold(i));
              // console.log('--------------------------------------');
            } catch (err) {
              console.log(err);
            }
          })

          if (opt.iotracer == true) { // 벤치마킹 종료 후 iotracer 결과를 저장함
              get_IO_results(opt.bmname, ip, opt.runtype)

              setTimeout(function() {
                ip.forEach((i) => {
              try {
                    // 파싱 결과를 서버의 benchmark name 디렉토리에 저장함
                    const stdout3 = exec(`ssh root@${i} ${IO_tracer_dir}/result.sh /home/skh/IO_OUTPUT/${opt.bmname} ${server_IP} ${nosqltests_result_dir}/${opt.bmname}/${i}_${opt.runtype}_output`)
                    console.log(`ssh root@${i} ${IO_tracer_dir}/result.sh /home/skh/IO_OUTPUT/${opt.bmname} ${server_IP} ${nosqltests_result_dir}/${opt.bmname}/${i}_${opt.runtype}_output`);
                  } catch (err) {
                    console.log('server send fail');
                    console.log(err);
                  }
                })
              }, 10000);
          }
          console.log('----------------------------------------------------------');
          console.log(chalk.green.bold('[INFO]'), 'complete benchmarking : ', chalk.blue.bold(opt.bmname));
          console.log('----------------------------------------------------------');
        }
      })

    } catch(err){
      console.error(err);
      resolve(status)
    }
  });
}

//
//
// const load_edge = () => new Promise(resolve => {
//   dirnum = orientMaster_IP.split('.')
//   let load_vertex_cmd = `ssh root@${orientMaster_IP} ${ssdStorage_dir}/orientdb${dirnum[dirnum.length-1]}/bin/oetl.sh LDBCR.json`
//   console.log('LOAD_VERTEX_CMD', load_vertex_cmd)
//   try{
//     const load_edge_exec = exec(load_edge_cmd)
//     console.log('----------------------------------------------------------');
//     console.log(chalk.green.bold('[INFO]'), 'load edge : ', chalk.blue.bold('LDBCR.json'));
//     console.log('----------------------------------------------------------');
//     load_edge_exec.stdout.on('data', function(data){
//       console.log(data);
//     })
//     load_edge_exec.on('exit', function(code){
//       resolve(status * -1)
//     })
//   } catch(err){
//     console.error(err);
//     resolve(status)
//   }
// })
//

function run_NosquTests(status, opt) {
  return new Promise(function(resolve, reject) {
    dirnum = orientMaster_IP.split('.')

    let run_cmd = `nosqltest orientdb -n ${opt.name} -t ${opt.time} -s ${opt.size}`
    console.log(run_cmd);

        try {
          runexec = exec(run_cmd)
          console.log('----------------------------------------------------------');
          console.log(chalk.green.bold('[INFO]'), `nosqltests started.`);
          console.log('----------------------------------------------------------');
        }catch (err){
          console.error(err);
        }

          runexec.stdout.on('data', function(data){
            console.log(data);
          })

          runexec.on('exit', function(data){
            console.log('----------------------------------------------------------');
            console.log(chalk.green.bold('[INFO]'), `nosqltests completed.`);
            console.log('----------------------------------------------------------');
              ip.forEach((i) => {
                try {
                  dirnum = i.split('.');
                  const std = exec(`ssh root@${i} ${ssdStorage_dir}/orientdb${dirnum[dirnum.length-1]}/killOrient.sh`);
                  console.log('--------------------------------------');
                  console.log(chalk.green.bold('[INFO]'), 'orientdb kill : ', chalk.blue.bold(i));
                  // console.log('--------------------------------------');
                } catch (err) {
                  console.log(err);
                }
              })

              if (opt.iotracer == true) { // 벤치마킹 종료 후 iotracer 결과를 저장함
                  get_IO_results(opt.bmname, ip, opt.runtype)

                  setTimeout(function() {
                    ip.forEach((i) => {
                  try {
                        // 파싱 결과를 서버의 benchmark name 디렉토리에 저장함
                        const stdout3 = exec(`ssh root@${i} ${IO_tracer_dir}/result.sh /home/skh/IO_OUTPUT/${opt.bmname} ${server_IP} ${nosqltests_result_dir}/${opt.bmname}/${i}_${opt.runtype}_output`)
                        console.log(`ssh root@${i} ${IO_tracer_dir}/result.sh /home/skh/IO_OUTPUT/${opt.bmname} ${server_IP} ${nosqltests_result_dir}/${opt.bmname}/${i}_${opt.runtype}_output`);
                      } catch (err) {
                        console.log('server send fail');
                        console.log(err);
                      }
                    })
                  }, 10000);
              }

              console.log('----------------------------------------------------------');
              console.log(chalk.green.bold('[INFO]'), 'complete benchmarking : ', chalk.blue.bold(opt.bmname));
              console.log('----------------------------------------------------------');

        resolve(status * -1)
      })
  });
}
//
//
// const run_NosquTests = (opt, runtype) => new Promise(resolve => {
//   if (opt.iotracer == true) { // IOracer 옵션이 있을 경우Otracer 를 실행함
//     let timewindow_iotracer = opt.time/1000
//     if (opt.runtype == 'load' || opt.runtype == 'run' || ((opt.runtype == 'loadrun') && (runtype == 'load')))
//       ip.forEach((i) => {
//         try {
//           console.log(timewindow_iotracer);
//           const stdout = exec(`ssh root@${i} ${IO_tracer_dir}/bin/iotracer -m /home/DeviceDriver/drive-manager ${IO_watch_dir} -i ${timewindow_iotracer} -o /home/skh/IO_OUTPUT/${opt.name}`)
// 	 console.log(`ssh root@${i} ${IO_tracer_dir}/bin/iotracer -m /home/DeviceDriver/drive-manager  ${IO_watch_dir} -i ${timewindow_iotracer} -o /home/skh/IO_OUTPUT/${opt.name}`);
//
//          // const stdout = exec(`ssh root@${i} ${IO_tracer_dir}/bin/iotracer -d ${IO_watch_dir} -o /home/skh/IO_OUTPUT/${opt.name}`)
//          // console.log(`ssh root@${i} ${IO_tracer_dir}/bin/iotracer -d ${IO_watch_dir} -o /home/skh/IO_OUTPUT/${opt.name}`);
//           // const stdout = exec(`ssh root@${i} nohup ${IO_tracer_dir}/bin/iotracer -d -p 1048576 ${IO_watch_dir} &`)
//           // console.log(`ssh root@${i} nohup ${IO_tracer_dir}/bin/iotracer -d -p 1048576 ${IO_watch_dir} &`);
//           // const stdout = exec(`ssh root@${i} ${IO_tracer_dir}/bin/iotracer -d -D -o /root/io_output/${opt.name} -p 1048576 ${IO_watch_dir}`)
//           // const stdout = exec(`ssh root@${i} ${IO_tracer_dir}/bin/iotracer -d -p 1048576 ${IO_watch_dir}`)
//           // console.log(`stdout: ${stdout}`);
//           console.log('----------------------------------------------------------');
//           console.log(chalk.green.bold('[INFO]'), 'run iotracer : ', chalk.blue.bold(i));
//           // console.log('----------------------------------------------------------');
//           // exec(`ssh root@${i} ${IO_tracer_dir} -d ${IO_watch_dir}`)
//         } catch (err) {
//           console.log(err);
//         }
//       })
//     }
//
//       if (opt.runtype == 'load'){
//         console.log('load 시작');
//         load_vertex().then(load_edge())
//       } else if ((opt.runtype == 'loadrun') && (runtype == 'load')){
//         console.log('load 시작');
//         load_vertex().then(load_edge())
//       }
//
//       let run_cmd = `nosqltest orientdb -n ${opt.name} -t ${opt.time} -s ${opt.size}`
//       console.log(run_cmd);
//
//       try {
//         runexec = exec(run_cmd)
//         console.log('----------------------------------------------------------');
//         console.log(chalk.green.bold('[INFO]'), `nosqltests started.`);
//         console.log('----------------------------------------------------------');
//       }catch (err){
//         console.error(err);
//       }
//
//         runexec.stdout.on('data', function(data){
//           console.log(data);
//         })
//
//         runexec.on('exit', function(data){
//
//           console.log('----------------------------------------------------------');
//           console.log(chalk.green.bold('[INFO]'), `nosqltests completed.`);
//           console.log('----------------------------------------------------------');
//
//           if (((opt.runtype == 'load') || (opt.runtype == 'run')) || ((opt.runtype == 'loadrun') && (runtype == 'run'))) {
//
//             ip.forEach((i) => {
//               try {
//                 dirnum = i.split('.');
//                 const std = exec(`ssh root@${i} ${ssdStorage_dir}/orientdb${dirnum[dirnum.length-1]}/killOrient.sh`);
//                 console.log('--------------------------------------');
//                 console.log(chalk.green.bold('[INFO]'), 'orientdb kill : ', chalk.blue.bold(i));
//                 // console.log('--------------------------------------');
//               } catch (err) {
//                 console.log(err);
//               }
//             })
//
//             if (opt.iotracer == true) { // 벤치마킹 종료 후 iotracer 결과를 저장함
//               if ((opt.runtype == 'load') || (opt.runtype == 'run') || ((opt.runtype == 'loadrun') && (runtype == 'run'))) {
//                 get_IO_results(opt.name, ip, opt.runtype)
//
//                 setTimeout(function() {
//                   ip.forEach((i) => {
//                     try {
//                       // 파싱 결과를 서버의 benchmark name 디렉토리에 저장함
//                       const stdout3 = exec(`ssh root@${i} ${IO_tracer_dir}/result.sh /home/skh/IO_OUTPUT/${opt.name} ${server_IP} ${ycsb_exportfile_dir}/${opt.name}/${i}_${opt.runtype}_output`)
//                       console.log(`ssh root@${i} ${IO_tracer_dir}/result.sh /home/skh/IO_OUTPUT/${opt.name} ${server_IP} ${ycsb_exportfile_dir}/${opt.name}/${i}_${opt.runtype}_output`);
//
//                     } catch (err) {
//                       console.log('server send fail');
//                       console.log(err);
//                     }
//                   })
//                 }, 10000);
//
//               }
//             }
//
//             console.log('----------------------------------------------------------');
//             console.log(chalk.green.bold('[INFO]'), 'complete benchmarking : ', chalk.blue.bold(opt.name));
//             console.log('----------------------------------------------------------');
//
//           }
//           resolve(flag)
//
//   })
//
// })
//

function benchmark_name(opt) {
  if (opt.bmname == null) { // n 값이 없으면 디폴트값 만들어줌
    opt.bmname = 'nosqltests_result_1'
    try {
      while (1) {
        let file = `${nosqltests_result_dir}/${opt.bmname}`
        fs.statSync(file); // 파일 존재 확인

        let string = opt.bmname
        let strArray = string.split('_') // 마지막 sequence 자르기
        let seqString = strArray[strArray.length - 1] // 마지막 인자 (숫자 저장)

        // 배열에 담기 (스트링->각 요소들을 숫자로)
        let seqArray = new Array();
        let newArray = new Array();
        seqArray = seqString.split("");

        let seqNum = 0
        // 각 요소들을 더해서 숫자로 계산
        for (let i = 0; i < seqArray.length; i++) {
          newArray[i] = seqArray[i] * Math.pow(10, seqArray.length - 1 - i)
          newArray[seqArray.length - 1] = newArray[seqArray.length - 1] + 1
          seqNum += newArray[i]
        }
        opt.bmname = `nosqltests_result_${seqNum}`
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        // console.log(chalk.red.bold('[ERROR]'),'There was an error.')
        // console.log(err);
      }
    }
  } else { //n 값이 있으면 else if((typeof opt.name) == 'string')
    const path = `${nosqltests_result_dir}`
    // console.log(file);
    //console.log(file.split("_")[1])
    //split 하면 배열로 반환됨
    const fs = require('fs')

    while (1) {
      // console.log(file)
      var array = file.split("_") //som, som, 1
      try {
        if (!fs.existsSync(path + '/' + file)) {
          fs.mkdirSync(path + '/' + file)
        } else if (fs.existsSync(path + '/' + file) && array.length >= 2) {
          let num = Number(array[array.length - 1]); //
          // console.log('exists')
          if (isNaN(num)) {
            file = file + '_' + 1
            fs.mkdirSync(path + '/' + file)

            opt.bmname = file
          } else if (typeof(num) == typeof(10)) {
            num += 1; //2
            //for문
            file = ''
            for (i = 0; i < array.length - 1; i++) { //length = 3
              file += array[i] + '_' //i = 0, 1 (som, som)
            }
            file = file + num
            fs.mkdirSync(path + '/' + file)
            //opt.name = file
            opt.bmname = file
          } else {
            file = file + '_' + 1 //som_som_1
            fs.mkdirSync(path + '/' + file)
            //opt.name = file
            opt.bmname = file
          }
          break;
        } else if (array.length == 1) {
          file = array[0] + '_' + 1
          fs.mkdirSync(path + '/' + file)

          opt.bmname = file
        }
        break;
      } catch (err) {
        continue;
      }
    }
  }
  console.log('----------------------------------------------------------');
  console.log(chalk.green.bold('[INFO]'), 'benchmark Name :', chalk.blue.bold(opt.bmname));
  console.log('----------------------------------------------------------');

  try {
    exec(`mkdir ${nosqltests_result_dir}/${opt.bmname}`)
  } catch (err) {
    console.error(err);
  }
}
