import kickLogo from "../logos/kick.png";

function KickStream(props){
    let stream = props.stream
    return (
      <div className="stream"
        id={"stream-" + stream.id}
        style={props.style}>
        <iframe
          className="stream-kick"
          title={stream.username}
          src={"https://player.kick.com/" + stream.username}
          frameborder="0" 
          scrolling="no" 
          allowfullscreen="true"> 
        </iframe>
      </div>
    )
  }

let KickService = {
  StreamComponent: KickStream,
  logo: kickLogo,
  domain: "kick.com",
  name: "Kick",
  supports: {url: true, username: true}
}

export default KickService