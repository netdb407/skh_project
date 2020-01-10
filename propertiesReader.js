const PropertiesReader = require('properties-reader');

const properties = PropertiesReader('config.properties');

module.exports = {
  getNodeInfo(){
    return properties.get("node1");
  }
}
