import kickLogo from "../logos/kick.png";

function KickStream(props){
    let stream = props.stream
    let username = stream.username || usernameFromUrl(stream.url)

    return (
      <div className="stream"
        id={"stream-" + stream.id}
        style={props.style}>
        <iframe
          className="stream-kick"
          title={username}
          src={"https://player.kick.com/" + username}
          frameborder="0" 
          scrolling="no" 
          allowfullscreen="true"> 
        </iframe>
      </div>
    )
}

function usernameFromUrl(url){
    try{
        url = new URL(url)
        console.log(url)
        let username = url.pathname.substring(1)
        return username
    }catch(e){
        return null
    }
}

let KickService = {
  StreamComponent: KickStream,
  logo: kickLogo,
  domain: "kick.com",
  name: "Kick",
  supports: {url: true, username: true},
  usernameFromUrl: usernameFromUrl
}

export default KickService