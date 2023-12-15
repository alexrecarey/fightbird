import {Rating, SvgIcon} from "@mui/material"
import { styled } from '@mui/material/styles';
import D8 from "./icons/D8.jsx";

function FightbirdRatingInput({value, setValue, color, min, max, icon}) {
  const ratingIcon = icon ?? D8;

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
    min={min ?? 0}
    max={max ?? 3}
    size="large"
    onChange={(event, newValue) => setValue(newValue || 0)}
    icon={<SvgIcon component={ratingIcon} inheritViewBox sx={{fontSize: '1em', mr: 0.25, ml: 0.25, mt: 0.25}}/>}
    emptyIcon={<SvgIcon component={ratingIcon} inheritViewBox sx={{fontSize: '1em', mr: 0.25, ml: 0.25, mt: 0.25}}/>}

  />
}

export default FightbirdRatingInput;
