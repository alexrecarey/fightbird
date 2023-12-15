import * as React from "react"

const HitFull = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinejoin: "round",
      strokeMiterlimit: 2,
    }}
    viewBox="0 0 87 100"
    {...props}
  >
    <path
      d="m0 0 18.301 25-30.801-3.349L-25 50l-12.5-28.349L-68.301 25-50 0l-18.301-25 30.801 3.349L-25-50l12.5 28.349L18.301-25 0 0Z"
      style={{
        fillRule: "nonzero",
      }}
      transform="translate(68.301 50)"
    />
  </svg>
)
export default HitFull
