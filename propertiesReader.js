const PropertiesReader = require('properties-reader');

const properties = PropertiesReader('/home/skh/sh/skh_project/config.properties');

module.exports = {
  //user정보
  get_hostname(){
    return properties.get("host");
  },
  get_password(){
    return properties.get("password");
  },



  //cluster 정보
  get_server(){
    return properties.get("server");
  },
  get_nodes(){
    return properties.get("nodes");
  },


  //version
  get_cassandra_version(){
    return properties.get("cassandra_version");
  },
  get_cassandra_file(){
    return properties.get("cassandra_file");
  },


  //directory_server
  get_server_cassandra_dir(){
    return properties.get("server_cassandra_dir")
  },
  get_server_cassandra_install_address(){
    return properties.get("server_cassandra_install_address")
  },



  //directroy_node
  get_node_cassandra_dir(){
    return properties.get("node_cassandra_dir")
  }


}
