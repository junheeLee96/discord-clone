import styled from "@emotion/styled";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
  faGear,
  faMicrophone,
  faHeadphones,
} from "@fortawesome/free-solid-svg-icons";
import { myBackgroundColor } from "../../../../../../room/userBoxes/myVideo/MyVideo";
import { useSelector } from "react-redux";
import ControlMicroPhoneVol from "./controlMicroPhoneVol/ControlMicroPhoneVol";
const MicorPhonesSetup = ({}) => {
  const { nickname } = useSelector((s) => s.myStream);
  const [isSetup, setIsSetup] = useState(false);

  function handleMicrophoneSetup() {
    setIsSetup((p) => !p);
  }
  return (
    <SetupContainerStyle>
      {isSetup && (
        <ControlMicroPhoneVol handleMicrophoneSetup={handleMicrophoneSetup} />
      )}
      <div style={{ display: "flex", alignItems: "center" }}>
        <CircleDivStyle style={{ background: `rgb(${myBackgroundColor})` }}>
          <FontAwesomeIcon icon={faDiscord} />
        </CircleDivStyle>
        <div style={{ fontWeight: "700" }}>{nickname}</div>
      </div>
      <SetupIconsWrapperStyle>
        <FontAwesomeIcon
          icon={faMicrophone}
          style={{ color: "rgb(172, 177, 185)" }}
        />
        <FontAwesomeIcon
          icon={faHeadphones}
          style={{ margin: "0 10px", color: "rgb(172, 177, 185)" }}
        />
        <FontAwesomeIcon
          icon={faGear}
          className="discord-fontawesome"
          style={{ cursor: "pointer" }}
          onClick={handleMicrophoneSetup}
        />
      </SetupIconsWrapperStyle>
    </SetupContainerStyle>
  );
};

export default MicorPhonesSetup;

const SetupContainerStyle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
`;

const CircleDivStyle = styled.div`
  width: 40px;
  height: 40px;

  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
`;

const SetupIconsWrapperStyle = styled.div`
  .setup_icon {
    font-size: 19px;
    cursor: pointer;
  }
`;
