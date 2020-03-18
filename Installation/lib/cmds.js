// git install : rpm -ivh 파일명
// git delete : rpm -e git-core-2.18.1-3.el8.x86_64
// java install : rpm -ivh 파일명
// java delete : yum remove -y java* (rpm -e로 지우면 dependency때문에 못지움)
// python install : rpm -ivh 파일명
// python delete : python은 지울 수 없고 symbolic link로만 변경 가능
// maven install : rpm -ivh 파일명(dependencies 쩔음)
// maven delete : rpm -e maven

//[설치 테스트 순서] - git, java, mvn, python
//1. java, git은 지워보고
//2. mvn은 폴더 자체를 삭제?? /etc/profile 수정은?
//3. python은 심볼릭 링크 삭제?

//[java]
//<<java 지울 때 한번에 안 지워지는 문제>> : 한개씩 지워야 함..
//***conflicting request : perl 모듈 필요하다는 오류 나면 : yum upgrade 해보기
// yum --version 하면 4.2.7 나오는데 이게 최신인가?<해결불가..>
//yum remove -y java* 로 해서 dependency 오류 나면
//rpm -qa|grep java 해서 나오는 결과 한개씩 yum으로 지워줘야할 것 같은데..

//tzdata-java 강제로 한개 지운 경우(194, 195) : 설치 시에도 dependency 에러 발생;;;
//강제로 다시 설치해줘야할 것 같은데..


//[python]
//심볼링링크 /usr/bin에서 찾고 지우고 ..<명령어 찾기!>\



//[테스트 결과]
//1. git (o)
//2. java (x) : 강제로 한개씩 해버리면 ㄱㅊ
//3. maven (x!!) : 뭔 문제냐~~ /etc/profile 문제일듯..
//4. python


const installCmd = 'rpm -ivh'
const deleteCmd = 'rpm -e' //git, sshpass
const yumDeleteCmd = 'yum remove -y'

//dependencies걸려있는 애들은 yum remove 패키지명* 로 관련된거 다 지워버리기
// const java = 'java-1.8.0-openjdk'
const java = 'java'
const maven = 'maven'
const python = 'python2'
const git = 'git-core'


//송희 추가
const wgetCmd = 'wget -P'
const decompress = 'tar -xvzf'
const copy = 'cp -f'



module.exports = {
  installCmd,
  deleteCmd,
  yumDeleteCmd,

  java,
  git,
  maven,
  python,

  wgetCmd,
  decompress,
  copy
}
