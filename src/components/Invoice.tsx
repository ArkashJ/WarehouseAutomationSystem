import { ITableColumns, ITableData } from '../types/api_types';
import {Table, TableBody, TableCell, TableHead, TableRow }  from '@mui/material';

const columns: readonly ITableColumns[] = [
  { id: 'Date',         label: 'date',        minWidth: 170 },
  { id: 'WarehouseID',  label: 'warehouseID', minWidth: 100 },
  { id: 'ShippingPO',   label: 'shippingPO',  minWidth: 170, align: 'right'},
  { id: 'ShipmentID',   label: 'shipmentID',  minWidth: 170, align: 'right'},
  { id: 'BoxesRcvd',    label: 'boxesRcvd',   minWidth: 170, align: 'right'},
];

export default function Invoice({shipperInfo}:{shipperInfo: ITableData[]}){

  return(
    <div>
      <div >
      <Table aria-label="simple table" sx={{overflow: 'hidden' }}>

        {/*setting cols*/}
        
        <TableHead>
          <TableRow>
            {
            columns.map((col) => 
              (
              <TableCell key={col.id}>
                {col.label}
              </TableCell>
              ))
            }
          </TableRow>
        </TableHead>

        {/*setting rows*/}

        <TableBody>
          {/* Iterate through shipperInfo and print values */}
          {shipperInfo.map((row) => (
            <TableRow key={row.shipmentID}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.warehouseID}</TableCell>
              <TableCell>{row.shippingPO}</TableCell>
              <TableCell>{row.shipmentID}</TableCell>
              <TableCell>{row.boxesRcvd}</TableCell>
            </TableRow>
          ))} 
        </TableBody>
      </Table>
    </div>
    </div>
  )
}