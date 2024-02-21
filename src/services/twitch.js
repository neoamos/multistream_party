import twitchLogo from "../logos/twitch.png";

function TwitchStream(props){
    let stream = props.stream
    let username = stream.username || usernameFromUrl(stream.url)

    return (
        <iframe
        className="stream"
        style={props.style}
        id={"stream-" + stream.id}
        title={stream.username}
        src={"https://player.twitch.tv/?channel=" + username + "&parent=" + window.location.hostname +"&muted=true"}
        allowfullscreen="true">
        </iframe>
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

let TwitchService = {
  StreamComponent: TwitchStream,
  logo: twitchLogo,
  domain: "www.twitch.tv",
  name: "Twitch",
  supports: {url: true, username: true},
  usernameFromUrl: usernameFromUrl
}

export default TwitchService