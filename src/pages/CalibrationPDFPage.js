import { PDFViewer } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import DeviceManagementCard from '../components/DeviceManagementCard';

const CalibrationPDFPage = () => {
  const { code } = useParams(); // lấy mã thiết bị nếu cần

  return (
    <PDFViewer width="100%" height="1000">
      <DeviceManagementCard code={code} />
    </PDFViewer>
  );
};

export default CalibrationPDFPage;
