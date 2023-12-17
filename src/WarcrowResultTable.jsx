import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SvgIcon from '@mui/material/SvgIcon';
import {pipe, multiply} from 'ramda';


export const oneDecimalPlace = (n, d=1) => n.toFixed(d);
export const formatPercentage = pipe(multiply(100), oneDecimalPlace);


function WarcrowResultTable({rows, icon}) {
  if (!rows) return <></>;

  return (
    <Table // sx={{minWidth: 650}}
           size="small">
      <TableHead>
        <TableRow>
          <TableCell>Outcome</TableCell>
          <TableCell align="right">Probability</TableCell>
          <TableCell align="right">Cumulative Probability</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.id}
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
          >
            <TableCell component="th" scope="row">
              {row.hits}<SvgIcon component={icon} inheritViewBox sx={{fontSize: '1em'}}/>
            </TableCell>
            <TableCell align="right">{formatPercentage(row.probability)}%</TableCell>
            <TableCell align="right">{formatPercentage(row.cumulative_probability)}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default WarcrowResultTable;
