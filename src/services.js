import YoutubeService from "./services/youtube"
import TwitchService from "./services/twitch"
import KickService from "./services/kick"

class Services{
  constructor(){
      this.services = [TwitchService, YoutubeService, KickService]
      this.serviceNameMap = {}
      this.serviceDomainMap = {}
      for(let i in this.services){
        this.serviceNameMap[this.services[i].name] = this.services[i]
        this.serviceDomainMap[this.services[i].domain] = this.services[i]
      }
  }

  getServiceFromURL(url){
    return this.serviceDomainMap[url.host]
  }

  getServiceFromName(name){
    return this.serviceNameMap[name]
  }

  getLogo(name){
    return this.serviceNameMap[name].logo
  }

}


export default Services