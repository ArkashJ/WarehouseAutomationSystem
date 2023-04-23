//interface used by the table

export interface ITableColumns{
    id          : 'Date' | 'WarehouseID' | 'ShippingPO' | 'ShipmentID' | 'BoxesRcvd';
    label       : string;
    minWidth   ?: number;
    align      ?: 'right';
}

export interface ITableData{
    date        : string
    warehouseID : string
    shippingPO  : string
    shipmentID  : string 
    boxesRcvd   : string
}

export interface IImageUpload{
    id          : 'Image'
    file        : File
    name        : string
}