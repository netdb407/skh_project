const PropertiesReader = require('properties-reader');

const properties = PropertiesReader('./InstallConfig');
// const properties = PropertiesReader('./InstallConfig_homedir');

module.exports = {
  get_home_dir(){
    return properties.get("home_dir");
  },

  //user정보
  get_hostname(){
    return properties.get("server_hostname");
  },
  get_password(){
    return properties.get("server_password");
  },


  get_rpm_dir_in_skhproject(){
    return properties.get("rpm_dir_in_skhproject")
  },
  get_rpm_dir_in_ServerAndNode(){
    return properties.get("rpm_dir_in_ServerAndNode");
  },



  //cluster 정보
  get_server_IP(){
    return properties.get("server_IP");
  },
  get_nodes_IP(){
    return properties.get("nodes_IP");
  },
  get_nodetool_IP(){
    return properties.get("nodetool_IP");
  },
  get_nodes_hostname(){
    return properties.get("nodes_hostname");
  },
  get_nodes_password(){
    return properties.get("nodes_password");
  },
  get_orientMaster_IP(){
    return properties.get("orientMaster_IP");
  },


  //directory
  get_server_install_dir(){
    return properties.get("server_install_dir");
  },
  get_server_install_dir_WL(){
    return properties.get("server_install_dir_WL");
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
  get_server_WLgenerate_dir(){
    return properties.get("server_WLgenerate_dir")
  },
  get_server_file1_dir(){
    return properties.get("server_file1_dir")
  },
  get_server_file2_dir(){
    return properties.get("server_file2_dir")
  },
  get_server_file3_dir(){
    return properties.get("server_file3_dir")
  },
  get_node_arangodb_dir(){
    return properties.get("node_arangodb_dir")
  },
  get_node_arangodb_data_dir(){
    return properties.get("node_arangodb_data_dir")
  },



  //ycsb
  get_ycsb_exporter(){
    return properties.get("ycsb_exporter")
  },
  get_ycsb_exportfile_dir(){
    return properties.get("ycsb_exportfile_dir")
  },


  //IO Tracer
  get_IO_output_dir(){
    return properties.get("IO_output_dir");
  },
  get_IO_driverManager_dir(){
    return properties.get("IO_driverManager_dir");
  },
  get_IO_tracer_dir(){
    return properties.get("IO_tracer_dir");
  },
  get_IO_watch_dir(){
    return properties.get("IO_watch_dir");
  },


  //version
  get_javaVersion(){
    return properties.get("java_version");
  },
  get_pythonVersion(){
    return properties.get("python_version");
  },
  get_mavenVersion(){
    return properties.get("maven_version");
  },


  //송희 추가 - 카산드라 옵션
 get_cassandra_version(){
   return properties.get("cassandra_version");
 },
 //directory_server
 get_server_cassandra_dir(){
   return properties.get("server_cassandra_dir")
 },
 //directroy_node
 get_node_cassandra_dir(){
   return properties.get("node_cassandra_dir")
 },
 //update_configuration_path_server
 get_update_conf_path(){
   return properties.get("update_conf_path")
 },

//orientdb
server_orientdb_dir(){
  return properties.get("server_orientdb_dir")
 },
get_profile_dir(){
  return properties.get("load_profile_dir")
 },

get_relation_dir(){
  return properties.get("load_relation_dir")
 },
get_nosqltests_result_dir(){
   return properties.get("nosqltests_result_dir")
  },


}
