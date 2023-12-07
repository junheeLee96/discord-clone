import React from "react";
import { ChannelIconStyle, FontAwesomeIconStyle } from "../ServerContainer";
// import { faCheckSquare, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
const AddChannel = () => {
  return (
    <ChannelIconStyle>
      <FontAwesomeIconStyle icon={faSquarePlus} />
    </ChannelIconStyle>
  );
};

export default AddChannel;
