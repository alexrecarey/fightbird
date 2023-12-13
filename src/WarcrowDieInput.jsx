import {Rating} from "@mui/material"
import { styled } from '@mui/material/styles';


function WarcrowDieInput({value, setValue, color}) {

  const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
      color: color,
    },
    '& .MuiRating-iconHover': {
      color: color,
    },
  });

  return <StyledRating
    value={value}
    min={0}
    max={3}
    size="large"
    onChange={(event, newValue) => setValue(newValue || 0)}
    //icon={<FontAwesomeIcon fontSize="inherit" style={{padding: 2, color: colorMid}} icon={faDiceD20}/>}
    //emptyIcon={<FontAwesomeIcon fontSize="inherit" style={{padding: 2, opacity: 0.55}} icon={faDiceD20}/>}
  />
}

export default WarcrowDieInput;