

const wgetCmd = 'wget -P'


//테스트 디렉토리
const cassandraDir = '/home/skh/sh/skh_project/'

//카산드라 디렉토리
//const cassandraNodeDir = '/home/skh/skh_project/'
//const cassandraInstallDir = 'http://www.apache.org/dist/cassandra/3.11.5/'
const cassandraVersion = 'apache-cassandra-3.11.5'
//const cassandraFile = 'apache-cassandra-3.11.5-bin.tar.gz'

const decompress = 'tar -xvzf'

const cassandraHome = cassandraDir+cassandraVersion

const conf = cassandraHome+'/conf/cassandra.yaml'
const nodes ='203.255.92.193'

module.exports = {
  wgetCmd,
  //cassandraDir,
  //cassandraNodeDir,
  //cassandraInstallDir,
  //cassandraVersion,
  //cassandraFile,
  decompress,
  //cassandraHome,
  conf,
  nodes
}
