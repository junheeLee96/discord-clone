import React from "react";
import { ChannelIconStyle, FontAwesomeIconStyle } from "../ServerContainer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

const Logo = () => {
  return (
    <ChannelIconStyle>
      <FontAwesomeIconStyle icon={faDiscord} />
    </ChannelIconStyle>
  );
};

export default Logo;
