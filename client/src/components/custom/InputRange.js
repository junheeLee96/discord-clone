import styled from "@emotion/styled";
import React, { useCallback, useEffect, useRef, useState } from "react";

const InputRange = ({ min, max, step, onChange, value }) => {
  // const [rangeValue, setRangeValue] = useState<number>((min + max) / 2);

  const getPercentage = (n) => {
    //인풋 레인지의 퍼센트를 계산
    //value가 움직이면 전체의 값을 퍼센트로 변환한 만큼 노란색으로 색칠해야함
    if (n <= min) {
      return 0; // n이 최솟값 x보다 작거나 같으면 0% 반환
    }

    if (n >= max) {
      return 100; // n이 최댓값 y보다 크거나 같으면 100% 반환
    }

    const range = max - min; // 최댓값과 최솟값 사이의 범위 계산
    const value = n - min; // n값에서 최솟값을 뺀 값 계산
    const percentage = (value / range) * 100; // 백분율 계산

    return percentage;
  };
  const onRangeChange = (e) => {
    if (!InputRef.current) return;
    const vals = Number(e.currentTarget.value);
    if (min <= vals && vals <= max) {
      onChange(vals);
    }
  };

  useEffect(() => {
    if (!InputRef.current) return;
    // const vals = (min + max) / 2;
    if (!value) return;
    const val = getPercentage(Number(value));

    InputRef.current.style.background = `linear-gradient(to right, #D7E537 0%,#D7E537  ${val}%, rgb(53,60,64) ${val}%, rgb(53,60,64) 100%)`;
  }, [value]);

  const InputRef = useRef();
  return (
    // <DivStyle>
    <RangeInputStlye
      type="range"
      ref={InputRef}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onRangeChange}
    />
    // </DivStyle>
  );
};

export default InputRange;

const RangeInputStlye = styled.input`
  width: 100%;
  position: relative;
  height: 2px;
  border-radius: 26px;
  -webkit-appearance: none;
  background: none;
  z-index: 11;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #d7e537;
    height: 16px;
    width: 16px;
    border-radius: 24px;
    background: #d7e537;
    cursor: pointer;
    -webkit-appearance: none;
  }

  &::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #d7e537;
    height: 16px;
    width: 16px;
    border-radius: 24px;
    background: #d7e537;
    cursor: pointer;
    -webkit-appearance: none;
  }

  &::-moz-range-track {
    width: 100%;
    position: relative;
    height: 2px;

    -webkit-appearance: none;
    background: none;
    z-index: 11;
    border-radius: 26px;
    &:focus {
      outline: none;
    }
  }

  &::-ms-track {
    width: 100%;
    position: relative;
    height: 2px;

    -webkit-appearance: none;
    background: none;
    z-index: 11;
    border-radius: 26px;
    &:focus {
      outline: none;
    }
  }

  &::-ms-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #d7e537;
    height: 16px;
    width: 16px;
    border-radius: 24px;
    background: #d7e537;
    cursor: pointer;
    -webkit-appearance: none;
  }
`;
