import React from "react";
import { ChannelIconStyle, FontAwesomeIconStyle } from "../ServerContainer";
// import { faCheckSquare, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";

const SearchingChannel = () => {
  return (
    <ChannelIconStyle>
      <FontAwesomeIconStyle icon={faEye} />;
    </ChannelIconStyle>
  );
};

export default SearchingChannel;
