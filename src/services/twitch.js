import twitchLogo from "../logos/twitch.png";

function TwitchStream(props){
let stream = props.stream
return (
    <iframe
    className="stream"
    style={props.style}
    id={"stream-" + stream.id}
    title={stream.username}
    src={"https://player.twitch.tv/?channel=" + stream.username + "&parent=" + window.location.hostname +"&muted=true"}
    allowfullscreen="true">
    </iframe>
)
}

let TwitchService = {
  StreamComponent: TwitchStream,
  logo: twitchLogo,
  domain: "www.twitch.tv",
  name: "Twitch",
  supports: {url: true, username: true}
}

export default TwitchService