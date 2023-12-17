import * as React from "react"
const BlockHollow = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinejoin: "round",
      strokeMiterlimit: 2,
    }}
    viewBox="0 0 82 100"
    {...props}
  >
    <path
      d="m0 52.664-32.742 14.88-32.742-14.88v-63.909l32.742 14.88L0-11.245v63.909ZM-32.742-5.153l-40.742-18.515v81.484l40.742 18.516L8 57.816v-81.484L-32.742-5.153Z"
      style={{
        fillRule: "nonzero",
      }}
      transform="translate(73.484 23.668)"
    />
  </svg>
)
export default BlockHollow
