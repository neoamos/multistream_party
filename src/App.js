import './App.scss';
import { useState, useRef, useEffect} from 'react';
import Services from "./services"

import { XMarkIcon, PlusIcon } from '@heroicons/react/24/solid'



let services = new Services()
let idCounter = 4

function App() {

  const [streams, setStreams] = useState([
    {
      id: 1,
      service: "Twitch",
      username: "Esfandtv",
      position: 0
    },
    {
      id: 2,
      service: "Kick",
      username: "Grym",
      position: 2
    },
    {
      id: 3,
      service: "YouTube",
      url: "https://www.youtube.com/watch?v=qcyXu1f_0vE",
      position: 3
    }
  ]);

  const [layout, setLayout] = useState("showcase")
  const [gridStyle, setGridStyle] = useState()
  const gridRef = useRef()

  const updateLayout = () => {
    if(layout == "grid"){
      let [rows, cols] = calculateRowsAndColsBruteForce(streams.length, gridRef.current.offsetHeight, gridRef.current.offsetWidth)
      // console.log("N: " + streams.length + ", W: " +gridRef.current.offsetWidth + ", H: " + gridRef.current.offsetHeight + ", Rows: " + rows + ", Cols: " + cols)
      let style = {
        gridTemplateRows: "repeat(" + rows + ", 1fr)",
        gridTemplateColumns: "repeat(" + cols + ", 1fr)",
      }
      setGridStyle(style)
    }else if(layout == "showcase"){
      let showcasePercent = 1- (((gridRef.current.offsetWidth / (streams.length-1)) * (9/16)) / gridRef.current.offsetHeight)
      showcasePercent = 0.5
      showcasePercent = Math.max(0.75, showcasePercent)
      let [rows, cols] = calculateRowsAndColsBruteForce(streams.length-1, (1-showcasePercent) * gridRef.current.offsetHeight, gridRef.current.offsetWidth)
      let style = {
        gridTemplateRows: Math.trunc(showcasePercent*100) + "% repeat(" + rows + ", 1fr)",
        gridTemplateColumns: "repeat(" + cols + ", 1fr)",
      }
      setGridStyle(style)
    }
  }

  useEffect(() => {
    const element = gridRef?.current;

    if (!element) return;

    const observer = new ResizeObserver(updateLayout);

    observer.observe(element);
    return () => {
      // Cleanup the observer by unobserving all elements
      observer.disconnect();
    };
  }, [layout, streams])

  useEffect(updateLayout, [layout, streams]);

  const deleteStream = (id) => {
    console.log("sdffds")
    setStreams(streams => {
      let newStreams = [...streams]
      let i = newStreams.findIndex((s) => s.id===id)
      newStreams.splice(i, 1)
      return newStreams
    }, updateLayout);
  }

  const addStream = (text, serviceName) => {
    try { 
      let url = new URL(text)
      let service = services.getServiceFromURL(url)
      if(service && service.supports.url){
        let id = idCounter
        idCounter = idCounter + 1
        let newStream = {
          id: id,
          service: service.name,
          url: url.href,
          position: streams.length
        }
        pushStream(newStream)
      }
    }catch(e){ 
      let service = services.getServiceFromName(serviceName)
      if(service && service.supports.username){
        let id = idCounter
        idCounter = idCounter + 1
        let newStream = {
          id: id,
          service: service.name,
          username: text,
          position: streams.length
        }
        pushStream(newStream)
      }
    }
  }

  const pushStream = (stream) => {
    setStreams(function(prev){
      let newStreams = [...prev]
      newStreams.push(stream)
      return newStreams
    })
  }

  let streamComponents = [...streams].sort((x, y) => x.id-y.id).map(function(s, i){
    let service = services.getServiceFromName(s.service)
    let style = {order: s.position}
    if(layout === "showcase" && s.id == streams[0].id){
      style.gridColumn = "1 / -1"
    }
    return <service.StreamComponent stream={s} i={i} key={s.id} style={style} />
  })

  return (
    <div className="App">
      <div className="stream-container" style={gridStyle} ref={gridRef}>
        {streamComponents}
      </div>
      <div className="controls">
        <div className="controls-left">
          <div className="logo">
            MultiStream 🎉
          </div>
          <StreamAdder addStream={addStream} />
        </div>
        <StreamList streams={streams} 
          setStreams={setStreams} 
          deleteStream={deleteStream}/>
      </div>
    </div>
  );
}

function StreamList(props){
  const streams = props.streams
  const setStreams = props.setStreams

  const draggingPos = useRef(null);
  const dragOverPos = useRef(null);
  
  const handleDragStart = (position, e) => {
    draggingPos.current = position;
  };

  const handleDragEnter = (position, e) => {
    dragOverPos.current = position;
    const newStreams = [...streams];
    const draggingStream = newStreams[draggingPos.current];
    if (!draggingStream) return;

    newStreams.splice(draggingPos.current, 1);
    newStreams.splice(dragOverPos.current, 0, draggingStream);

    const reorderedStreams = newStreams.map((item, index) => ({
      ...item,
      position: index
    }));

    draggingPos.current = position;
    dragOverPos.current = null;

    setStreams(reorderedStreams);
  };

  const handleClick = (id) => {
    setStreams(streams => {
      let newStreams = [...streams]
      let i = newStreams.findIndex((s) => s.id===id)
      let stream = streams[i]
      // newStreams.splice(i, 1)
      // newStreams.unshift(stream)
      newStreams[i] = newStreams[0]
      newStreams[0] = stream
      const reorderedStreams = newStreams.map((item, index) => ({
        ...item,
        position: index
      }));
      return reorderedStreams
    })
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    props.deleteStream(id)
  }

  return (
    <div className="stream-list">
      {streams.map((stream, index) => {
        return (
          <div className="stream-list-item" 
            draggable="true"
            onDragStart={(e) => handleDragStart(index, e)}
            onDragEnter={(e) => handleDragEnter(index, e)}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => handleClick(stream.id)}
          >
            <div className="stream-list-item-img" id={stream.id}>
              <img src={services.getLogo(stream.service)} alt="logo" /> 
            </div>
            <div>{stream.username || stream.id}</div>
            <div className="stream-list-item-delete" onClick={(e) => handleDelete(e, stream.id)}><XMarkIcon className="x-mark" /></div>
          </div>
          )
        })
      }
    </div>
  )
}

function StreamAdder(props){
  let [text, setText] = useState("")
  let [service, setService] = useState(services.services[0].name)

  const handleTextChange = (event) => {
    setText(event.target.value)
  }
  const handleServiceChange = (event) => {
    setService(event.target.value)
  }
  const handleSubmit = () => {
    props.addStream(text, service)
    setText("")
  }
  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      handleSubmit()
    }
  }

  let serviceOptions = services.services.map(function(s){
    return <option value={s.name}>{s.name}</option>
  })



  return (
    <div className="add-stream">
      <input 
        id="stream-input" 
        type="text"
        placeholder="Username or Link..."
        value={text}
        onChange={handleTextChange}
        onKeyPress={handleKeyPress}
        ></input>
      <select id="service-selector" onChange={handleServiceChange} 
        value={service}>
        {serviceOptions}
      </select>
      <div className="button" onClick={handleSubmit}>
        <PlusIcon className="plus"/>
      </div>
    </div>
  )
}

// Doesnt work right???
// Based on https://math.stackexchange.com/questions/466198/algorithm-to-get-the-maximum-size-of-n-squares-that-fit-into-a-rectangle-with-a/466248#466248
function calculateRowsAndCols(streamCount, viewHeight, viewWidth){
  let a = (16/9) / (viewWidth / viewHeight)
  let c = Math.sqrt(streamCount * a)
  let r = Math.sqrt(streamCount / a)
  let possibilities = [
    [0, Math.floor(r) * Math.ceil(c)],
    [1, Math.ceil(r) * Math.floor(c)],
    [2, Math.ceil(r) * Math.ceil(c)],
  ]
  console.log(possibilities)
  possibilities.sort((x, y) => x[1] - x[2])
  console.log(possibilities)
  possibilities = possibilities.filter(x => x[1] >= streamCount)
  console.log(possibilities)
  switch(possibilities[0][0]){
    case 0:
      return [Math.floor(r),  Math.ceil(c)]
    case 1:
      return [Math.ceil(r),  Math.floor(c)]
    case 2:
      return [Math.ceil(r),  Math.ceil(c)]
    default:
      return null
  }
}

function calculateRowsAndColsBruteForce(streamCount, viewHeight, viewWidth){
  let maxArea = 0
  let maxR = 0
  let maxC = 0
  for(let r = 1; r < 15; r++){
    for(let c = 1; c < 15; c++){
      if(r*c >= streamCount){
        let streamH = viewHeight/r;
        let streamW = viewWidth/c;
        if(streamH * (16/9) < streamW){
          let area = streamH * streamH * (16/9)
          if(area > maxArea){
            maxArea = area
            maxR = r
            maxC = c
          }
        }else{
          let area = streamW * streamW * (9/16)
          if(area > maxArea){
            maxArea = area
            maxR = r
            maxC = c
          }
        }
      }
    }
  }
  return [maxR, maxC]
}

export default App;
