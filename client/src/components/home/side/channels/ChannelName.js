import React from "react";
import styled from "@emotion/styled";

const ChannelName = () => {
  return (
    <ChannelNameStyle>
      <span>즐거운 생활</span>
      <ArrowWrapperStyle>
        <BrokenArrowDivStyle
          style={{
            transform: "rotate(45deg)",
            position: "relative",
            right: "3px",
          }}
        />
        <BrokenArrowDivStyle
          style={{
            transform: "rotate(-45deg)",
            position: "relative",
            left: "3px",
            bottom: "3px",
          }}
        />
      </ArrowWrapperStyle>
    </ChannelNameStyle>
  );
};

export default ChannelName;

const ChannelNameStyle = styled.div`
  width: 100%;
  min-height: 48px;
  overflow: hidden;
  display: flex;
  padding: 12px 16px 12px 16px;
  justify-content: space-between;
  position: relative;

  span {
    font-weight: bold;
  }
`;

const ArrowWrapperStyle = styled.div`
  display: inline-block;
  position: absolute;
  bottom: 16px;
  right: 12px;
`;

const BrokenArrowDivStyle = styled.div`
  width: 10px;
  height: 3px;
  background: white;
  cursor: pointer;
`;
