const PropertiesReader = require('properties-reader');

const properties = PropertiesReader('config.properties');

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

  //directory
  get_server_install_dir(){
    return properties.get("server_install_dir");
  },
  get_node_install_dir(){
    return properties.get("node_install_dir");
  },
  get_node_data_dir(){
    return properties.get("node_data_dir");
  },

  //IO Tracer
  get_IO_output_dir(){
    return properties.get("IO_output_dir");
  },
  get_IO_driverManager_dir(){
    return properties.get("IO_driverManager_dir");
  },

  //version
  get_java(){
    return properties.get("java");
  },
  get_sshpass(){
    return properties.get("sshpass");
  },

}
