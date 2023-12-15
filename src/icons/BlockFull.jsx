import * as React from "react"

const BlockFull = (props) => (
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
      d="m0 62.968-40.742 18.516-40.742-18.516v-81.484L-40.742 0 0-18.516v81.484Z"
      style={{
        fillRule: "nonzero",
      }}
      transform="translate(81.484 18.516)"
    />
  </svg>
)
export default BlockFull
