import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { setmystream } from "../../../modules/stream";

let peers = {};
let socketInstance = {};
const constraints = {
  video: true,
  audio: true,
};

class SocketConnection {
  constructor(settings) {
    this.otherUserStream = false;

    this.settings = settings;
    this.myPeer = initializePeerConnection();
    this.socket = initializeSocketConnection();
    this.stream = this.getMedia();
    if (this.socket) this.isSocketConnected = true;
    if (this.myPeer) this.isPeersConnected = true;

    if (this.initializePeersEvents) this.initializePeersEvents();
    if (this.initializeSocketEvents) this.initializeSocketEvents();
  }

  getMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getAudioTracks()[0].enabled = false;
      stream.getTracks().forEach((track) => {
        this.myPeer.addTrack(track, stream);
      });
      return new Promise((resolve, reject) => {
        resolve(stream); // 미디어 스트림을 해결
      });
    } catch (error) {
      console.error("Error getting media:", error);
      throw error; // 에러를 상위로 전파
    }
  };

  initializeSocketEvents = () => {
    if (!this.myPeer || !this.socket) return;
    const roomId = this.settings.roomId;
    console.log(this.settings.roomId);
    // this.socket.on("connect", () => {
    //   console.log("connect!!");
    // });
    this.socket.emit("join-room", roomId);

    this.socket.on("welcom", async (user, newCount) => {
      console.log("welcom");
      const offer = await this.myPeer.createOffer();
      this.myPeer.setLocalDescription(offer);
      console.log("보내는 오퍼 = ", offer);
      this.socket.emit("offer", offer, roomId);
    });

    this.socket.on("offer", async (offer) => {
      console.log("받는오퍼 = ", offer);
      this.myPeer.setRemoteDescription(offer);
      const answer = await this.myPeer.createAnswer();
      console.log("보내는 answer = ", answer);
      await this.myPeer.setLocalDescription(answer);
      this.socket.emit("answer", answer, roomId);
    });

    this.socket.on("ice", (ice) => {
      console.log("ice@");
      this.myPeer.addIceCandidate(ice);
    });

    this.socket.on("answer", (answer) => {
      console.log("받은 answer = ", answer);
      // peerRef.current.setLocalDescription(answer);
      this.myPeer.setRemoteDescription(answer);
    });

    this.myPeer.addEventListener("icecandidate", (data) => {
      console.log("ice data = ", data);

      this.socket.emit("ice", data.candidate, this.settings.roomId);
    });

    // this.myPeer.addEventListener("track", (event) => {
    //   console.log("new user connected!!!!!");
    //   //   console.log("addstream data = ", event);
    //   const stream = event.streams[0] || new MediaStream([event.track]);
    //   //   console.log("stream = ", stream);
    //   this.settings.setuser(stream);
    //   //   this.otherUserStream = stream;
    //   // otherUserRef.current.srcObject = stream;
    //   // console.log("stream.getTracks() = ", stream.getTracks());
    //   stream.getTracks().forEach((track) => {
    //     track.addEventListener("ended", () => {
    //       console.log("Track ended:", track);
    //     });
    //   });
    //   // otherUserRef.current.srcObject = data.streams[0];
    // });
  };
}

const initializePeerConnection = () => {
  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  });

  //   peer.addEventListener("track", (event) => {
  //     console.log("addstream data = ", event);
  //     const stream = event.streams[0] || new MediaStream([event.track]);
  //     console.log("stream = ", stream);

  //     otherUserRef.current.srcObject = stream;
  //     console.log("stream.getTracks() = ", stream.getTracks());
  //     stream.getTracks().forEach((track) => {
  //       track.addEventListener("ended", () => {
  //         console.log("Track ended:", track);
  //       });
  //     });
  //     // otherUserRef.current.srcObject = data.streams[0];
  //   });

  return peer;
};

const initializeSocketConnection = () => {
  return io("localhost:8080");
};

export function createSocketConnectionInstance(settings = {}) {
  return (socketInstance = new SocketConnection(settings));
}
