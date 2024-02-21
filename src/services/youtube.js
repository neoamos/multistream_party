import youtubeLogo from "../logos/youtube.png";

function YoutubeStream(props){
  let stream = props.stream
  let url = new URL(stream.url)
  return (
    <iframe 
      className="stream"
      style={props.style}
      id={"stream-" + stream.id}
      src={"https://www.youtube.com/embed/" + url.searchParams.get("v") + "?autoplay=1"}
      title="YouTube video player" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen="true">
    </iframe>
  )
}

function usernameFromUrl(url){
  return "YouTube"
}

let YoutubeService = {
  StreamComponent: YoutubeStream,
  logo: youtubeLogo,
  domain: "www.youtube.com",
  name: "YouTube",
  supports: {url: true},
  usernameFromUrl: usernameFromUrl
}

  export default YoutubeService