import { PDFViewer } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import DeviceManagementCard from '../components/DeviceManagementCard';

const CalibrationPDFPage = () => {
  const { documentId } = useParams();
  
  return (
    <>
      <PDFViewer width="100%" height="1000">
        <DeviceManagementCard code={documentId} />
      </PDFViewer>
    </>
  );
};

export default CalibrationPDFPage;
