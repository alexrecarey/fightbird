import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {pipe, multiply} from 'ramda';


export const oneDecimalPlace = (n, d=1) => n.toFixed(d);
export const formatPercentage = pipe(multiply(100), oneDecimalPlace);


function WarcrowResultTable({rows}) {
  if (!rows) return <></>;

  return (
    <Table // sx={{minWidth: 650}}
           size="small">
      <TableHead>
        <TableRow>
          <TableCell>Wounds</TableCell>
          <TableCell align="right">Outcomes</TableCell>
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
              {row.wounds}
            </TableCell>
            <TableCell align="right">{row.outcomes}</TableCell>
            <TableCell align="right">{formatPercentage(row.probability)}%</TableCell>
            <TableCell align="right">{formatPercentage(row.cumulative_probability)}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default WarcrowResultTable;