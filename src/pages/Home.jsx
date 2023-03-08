import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import socketIO from 'socket.io-client'
// import JoinButton from '../component/Button'

const WS = 'https://cors-anywhere.herokuapp.com/https://9b98-36-255-86-176.in.ngrok.io';
const socket = socketIO(WS);

const Home = () => {
  // const [warning, setWarning] = useState('')
  const remoteVideoRef = useRef()
  const pc = useRef(new RTCPeerConnection(null))
  const textRef = useRef()
  // const candidates = useRef([])
  const { userTyp } = useParams()

  useEffect(() => {
    socket.emit('join', '1111');
    socket.on('connection-success', (success) => {
      console.log(success)
    })

    socket.on('sdp', (data) => {
      textRef.current.value = JSON.stringify(data.sdp)
      pc.current.setRemoteDescription(new RTCSessionDescription(data.sdp))
    })
    
    socket.on('candidate', (data) => {
      console.log(data)
      // candidates.current = [...candidates.current, data.candidate]
      pc.current.addIceCandidate(new RTCIceCandidate(data.candidate))
    })

    if (userTyp === '1') {
      navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
        .then(stream => {
          stream.getTracks().forEach(track => {
            pc.current.addTrack(track, stream)
          })
        })
    }

    const _PC = new RTCPeerConnection({
      iceServers: [
        {
          urls: ["stun:stun.google.com:19302", "stun:global.stun.twilio.com:3478"]
        }
      ]
    })

    _PC.onicecandidate = (e) => {
      // when new ice candidate available this willbe triggred
      if (e.candidate) {
        console.log(JSON.stringify(e.candidate))
        socket.emit('candidate', { candidate: e.candidate })
      }
    }
    _PC.oniceconnectionstatechange = (e) => {
      // helps check the peer connections like (connected, disconnected, failed, closed)
      console.log(e)
    }
    _PC.ontrack = (e) => {
      // we get remote stream here
      remoteVideoRef.current.srcObject = e.streams[0]
    }
    pc.current = _PC
  }, [userTyp])

  const sendToPeer = (eventType, payload) => {
    socket.emit(eventType, payload)
  }

  const processSDP = ( sdp ) => {
    console.log(JSON.stringify(sdp))
    pc.current.setLocalDescription(sdp)
    sendToPeer('sdp', { sdp })
  }

  const createOffer = () => {
    pc.current.createOffer({
      offerToReceiveVideo: 1,
      offerToReceiveAudio: 0
    }).then(sdp => {
      // created offer send sdp to the server
      processSDP(sdp)
    }).catch(err => {
      console.log(err)
    })
  }
  const createAnswer = () => {
    pc.current.createAnswer({
      offerToReceiveVideo: 1,
      offerToReceiveAudio: 0
    }).then(sdp => {
      // created answer send sdp to the server
      processSDP(sdp)
    }).catch(err => {
      console.log(err)
    })
  }

  // const setRemoteDescription = () => {
  //   const sdp = JSON.parse(textRef.current.value)
  //   pc.current.setRemoteDescription(new RTCSessionDescription(sdp))
  // }

  // const addCandidates = () => {
  //   // const candidate = JSON.parse(textRef.current.value)
  //   candidates.current.forEach(candidate => {
  //     pc.current.addIceCandidate(new RTCIceCandidate(candidate))
  //   })
  // }
  return (
    <div className='row'>
      {userTyp === '2' ?
        <video autoPlay ref={remoteVideoRef} style={{width: '400px'}} />
        : null
      }
      <div className="alert alert-info" role="alert">
        <p className="fs-2 p-2">{`User window ID: ${"userId"}`}</p>
      </div>
      <button className='btn btn-primary col-4 m-2' onClick={() => createOffer()}>Create offer</button>
      <button className='btn btn-primary col-4 m-2' onClick={() => createAnswer()}>Create answer</button>
      <hr />
      <textarea ref={textRef} style={{ width: '80vw', marginBottom: '20px', marginLeft: '50px' }} />
      {/* <hr />
      <button className='btn btn-primary col-4 m-2' onClick={setRemoteDescription}>Set Remote Description</button>
      <button className='btn btn-primary col-4 m-2' onClick={addCandidates}>Add Candidates</button> */}
    </div>
  )
}

export default Home