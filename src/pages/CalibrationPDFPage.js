import { PDFViewer } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import DeviceManagementCard from '../components/DeviceManagementCard';
import { useEffect, useState } from 'react';
import { initialValues } from '../utils/constants';
import axios from 'axios';

const CalibrationPDFPage = () => {
  const { documentId } = useParams();
  const [device, setDevice] = useState(initialValues);
  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await axios.get(`http://192.168.10.87:1337/api/devices/${documentId}`);

        const device = response.data.data;

        if (device) {
          setDevice({
            name: device.name || '',
            code: device.code || '',
            brand: device.brand || '',
            type: device.type || '',
            calibrationFrequency: device.calibrationFrequency?.toString() || '',
            selfCalibration: device.selfCalibration || false,
            externalCalibration: device.externalCalibration || false,
            usedBy: device.usedBy || [],
            phoneNumber: device.phoneNumber || '',
            attached: device.attached || '',
            supplier: device.supplier || '',
            cost: device.cost?.toString() || '',
            buyDate: device.buyDate || '',
            lastCalibrationDate: device.lastCalibrationDate || '',
            calibrationStandard: device.calibrationStandard || '',
          });
        } else {
        }
      } catch (err) {
        console.error('Error fetching device:', err);
      } finally {
      }
    };
    fetchDevice();
  }, [documentId]);
  return (
    <>
      <PDFViewer width="100%" height="1000">
        <DeviceManagementCard code={documentId} />
      </PDFViewer>
    </>
  );
};

export default CalibrationPDFPage;
