import {useState } from "react";
import useTable from "../components/Table/Table";
import Modal from "../components/Modal/Modal";
import { BarcodeInput, QRScanner } from "../components/QR/QRCode";


class barcodeDataType {
    value : string = "";
    source : 'Scanner' | 'Camera' = "Scanner";
}

const BarcodeDemo = () => {
    const [dataArray,setdataArray] = useState<barcodeDataType[]>([])
    const [scanning, setScanning] = useState<boolean>(false)
    const { Table } = useTable(() => {});

  return (
    <div>
      {/* template header */}
      <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">
        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">
              Barcode Demo
            </h2>
          </div>
          <div className="flex justify-start lg:justify-end flex-wrap">
            <BarcodeInput
                onBarcodeScan={(barcode)=>{
                    console.log(barcode);
                    setdataArray(prev => ([...prev , {
                        value : barcode,
                        source : 'Scanner'
                    }]))
                }}
            />  
            {
                !scanning && 
                <button
                    className="bg-blue-400 rounded px-3 hover:bg-blue-500 text-white p-[10px] m-[10px]"
                    onClick={
                        ()=>{
                            setScanning(true);
                        }
                    }
                >
                    start scanning
                </button>
            }
          </div>
        </div>
      </div>
      <Table>
            <thead>
                <tr>
                    <th>
                        Barcode
                    </th>
                    <th>
                        Source
                    </th>
                </tr>
            </thead>
            <tbody>
                {   
                    dataArray.slice().reverse().map((_,i)=>(
                        <tr key={i}>
                            <td width='70%'>
                                {_.value}
                            </td>
                            <td width='30%'>
                                {_.source}
                            </td>
                        </tr>
                    ))
                }
            </tbody>
      </Table>
        {
            scanning &&
                <Modal onClose={()=>{
                    setScanning(false);
                }}>
                    
                        <QRScanner
                            onScan={(scannedData) => {
                                setdataArray(prev => (
                                    [
                                        ...prev,
                                        {
                                            value : scannedData,
                                            source : 'Camera'
                                        }
                                    ]
                                ))
                                setScanning(false);
                            }}
                        />
                </Modal>
        }
    </div>
  )
}


export default BarcodeDemo