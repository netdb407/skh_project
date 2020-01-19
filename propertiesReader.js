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

  get_rpm_dir(){
    return properties.get("rpm_dir");
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
  get_server_wlfile_dir(){
    return properties.get("server_wlfile_dir")
  },
  get_server_ycsb_dir(){
    return properties.get("server_ycsb_dir")
  },

  //IO Tracer
  get_IO_output_dir(){
    return properties.get("IO_output_dir");
  },
  get_IO_driverManager_dir(){
    return properties.get("IO_driverManager_dir");
  },

  //version
  get_javaVersion(){
    return properties.get("javaVersion");
  },
  get_sshpassVersion(){
    return properties.get("sshpassVersion");
  },
  get_pythonVersion(){
    return properties.get("pythonVersion");
  },
  get_gitVersion(){
    return properties.get("gitVersion");
  },
  get_mavenVersion(){
    return properties.get("mavenVersion");
  }

}
