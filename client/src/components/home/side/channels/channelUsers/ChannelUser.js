import styled from "@emotion/styled";
import React from "react";

const ChannelUser = ({ nickname, stream, id, peer }) => {
  console.log(stream);
  return (
    <ChannelUserStyle>
      <NameSpanStyle className="nickname_sp">{nickname}</NameSpanStyle>
      {/* <span>Gdgd</span> */}
    </ChannelUserStyle>
  );
};

export default ChannelUser;

const NameSpanStyle = styled.span`
  color: rgb(119, 125, 133);
`;

const ChannelUserStyle = styled.div`
  width: 100%;
  display: flex;
  padding: 10px 10px 10px 40px;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    .nickname_sp {
      color: rgb(230, 230, 232);
    }
  }
`;
