import { PDFViewer } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import DeviceManagementCard from '../components/DeviceManagementCard';

const CalibrationPDFPage = () => {
  const { documentId } = useParams();

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
        <DeviceManagementCard code={documentId} />
      </PDFViewer>
    </div>
  );
};

export default CalibrationPDFPage;