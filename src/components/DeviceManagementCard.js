import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import NotoSans from "../assets/fonts/NotoSans-Regular.ttf";
import NotoSansSC from "../assets/fonts/NotoSansSC-Regular.ttf";
import { initialValues } from "../utils/constants";
import { useState, useEffect } from "react";
import axios from "axios";

// Đăng ký font
Font.register({ family: "NotoSans", src: NotoSans });
Font.register({ family: "NotoSansSC", src: NotoSansSC });

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10, fontFamily: "NotoSans" },

  title: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
  },

  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },

  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  cell: {
    flex: 1,
    borderRight: 1, // Giữ nguyên viền như code gốc
    borderBottom: 1,
    borderColor: "#000",
    padding: 6,
    justifyContent: "center",
  },

  labelCell: {
    flex: 1,
    padding: 6,
    justifyContent: "center",
    borderRight: 1,
    borderColor: "#000",
  },

  textVi: {
    fontWeight: "bold",
  },

  textCn: {
    fontFamily: "NotoSansSC",
    fontSize: 9,
    marginTop: 2,
  },

  footer: {
    marginTop: 10,
    fontSize: 8,
  },

  boldCenterText: {
    marginVertical: 6,
    fontWeight: "bold",
    textAlign: "center",
  },

  historyRow: {
    flexDirection: "row",
  },

  historyCell: {
    flex: 1,
    borderBottom: 1,
    borderRight: 1, // Viền mặc định cho các cột giữa
    borderColor: "#000",
    minHeight: 32,
    justifyContent: "center",
    padding: 4,
  },

  lastHistoryCell: {
    flex: 1,
    borderBottom: 1,
    borderColor: "#000", // Không thêm borderRight riêng để tránh chồng với table
    minHeight: 32,
    justifyContent: "center",
    padding: 4,
  },
});

const deviceInfoRows = [
  ["Mã thiết bị", "Tên thiết bị", "Logo công ty"],
  ["Quy cách mô hình", "Ngày mua", "Giá mua"],
  ["Độ chính xác", "Xưởng cung ứng"],
  ["Đơn vị sử dụng", "Điện thoại"],
  ["Người bảo quản", "Phụ kiện đính kèm"],
  ["Tiêu chí chấp thuận", "Sử dụng"],
  ["Chu kỳ kiểm tra", "Hạng mục kiểm tra"],
];

const deviceInfoRowsCN = [
  ["設備編號", "設備名稱", "公司標誌"],
  ["模型規格", "購買日期", "購買價格"],
  ["精度", "供應工廠"],
  ["使用部門", "電話"],
  ["保管人員", "附帶配件"],
  ["合格標準", "用途"],
  ["檢查週期", "檢查項目"],
];
const deviceInfoKeys = [
  ["code", "name", "brand"], // null nếu là logo công ty hoặc không có dữ liệu
  ["type", "buyDate", "cost"],
  ["brand", "supplier"],
  ["usedBy", "phoneNumber"],
  ["attached", "calibrationStandard"],
  ["selfCalibration", "externalCalibration"],
  ["calibrationFrequency", "lastCalibrationDate"],
];
const deviceInfoKeysBlock2 = [
  "brand", "supplier",
  "department", "phoneNumber",
  "", "attached",
  "calibrationStandard", "usedBy",
  "calibrationFrequency", ""
];
const DeviceManagementCard = ({ code }) => {
  const [device, setDevice] = useState(initialValues);
  const [history, setHistory] = useState([]);
  const [emptyRows, setEmptyRows] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        // Lấy dữ liệu thiết bị
        const deviceResponse = await axios.get(
          `http://117.6.40.130:1337/api/devices/${code}`,
          { signal: abortController.signal }
        );
        const deviceData = deviceResponse.data.data || {};
        setDevice({
          name: deviceData.name || '',
          code: deviceData.code || '',
          brand: deviceData.brand || '',
          type: deviceData.type || '',
          calibrationFrequency: deviceData.calibrationFrequency?.toString() || '',
          selfCalibration: deviceData.selfCalibration || false,
          externalCalibration: deviceData.externalCalibration || false,
          usedBy: deviceData.usedBy || [],
          phoneNumber: deviceData.phoneNumber || '',
          attached: deviceData.attached || '',
          supplier: deviceData.supplier || '',
          cost: deviceData.cost?.toString() || '',
          buyDate: deviceData.buyDate || '',
          lastCalibrationDate: deviceData.lastCalibrationDate || '',
          calibrationStandard: deviceData.calibrationStandard || '',
        });

        // Lấy lịch sử hiệu chuẩn
        const historyResponse = await axios.get(
          `http://117.6.40.130:1337/api/calibration-records?filters[deviceId][$eq]=${code}`,
          { signal: abortController.signal }
        );
        const records = Array.isArray(historyResponse.data.data) ? historyResponse.data.data : [];

        setHistory(
          records.map((item, index) => ({
            id: item.id || `temp-id-${index}`,
            calibrationDate: typeof item.calibrationDate === 'string' ? item.calibrationDate : '',
            calibrationDetail: typeof item.calibrationDetail === 'string' ? item.calibrationDetail : '',
            result: typeof item.result === 'string' ? item.result : '',
            scribe: typeof item.scribe === 'string' ? item.scribe : '',
          }))
        );
        setEmptyRows(10 - records.length);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Request aborted');
        } else {
          console.error('Error fetching data:', err);
          setDevice(initialValues);
          setHistory([]);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [code]);
  function renderUsedBy(value) {
    if (!value || value.length === 0) return "";
    if (Array.isArray(value)) {
      const labels = [];
      if (value.includes("field")) labels.push("Hiện trường");
      if (value.includes("office")) labels.push("Văn phòng");
      return labels.join(", ");
    }
    if (value === "field") return "Hiện trường";
    if (value === "office") return "Văn phòng";
    return value;
  }
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <View style={{ textAlign: "center" }}>
          <Text style={styles.title}>THẺ QUẢN LÝ THIẾT BỊ THỬ NGHIỆM</Text>
          <Text
            style={[
              styles.title,
              { fontFamily: "NotoSansSC", fontWeight: "800", fontSize: 12 },
            ]}
          >
            試驗設備管理卡
          </Text>
        </View>

        {/* BLOCK 1: 6 cột, 2 hàng */}
        {deviceInfoRows.slice(0, 2).map((row, rowIndex) => (
          <View style={styles.row} key={`block1-row-${rowIndex}`}>
            {row.map((textVi, colIndex) => {
              const textCn = deviceInfoRowsCN[rowIndex]?.[colIndex] || "";
              const key = deviceInfoKeys[rowIndex]?.[colIndex];
              let value = key ? device[key] : "";

              if (Array.isArray(value)) value = value.join(", ");
              if (typeof value === "boolean") value = value ? "Có" : "Không";
              if (key === "cost" && value) value = Number(value).toLocaleString("vi-VN");
              if ((key === "buyDate" || key === "lastCalibrationDate") && value)
                value = new Date(value).toLocaleDateString("vi-VN");

              return (
                <View
                  key={colIndex}
                  style={[
                    styles.cell,
                    {
                      flexGrow: 1,
                      flexDirection: "row",
                      padding: 0,
                      borderTop: rowIndex === 0 ? 1 : 0,
                      borderLeft: colIndex === 0 ? 1 : 0,
                    },
                  ]}
                >
                  {/* Label */}
                  <View
                    style={{
                      flex: 1,
                      padding: 4,
                      justifyContent: "center",
                      borderRight: 1,
                      borderColor: "#000",
                    }}
                  >
                    <Text>{textVi}</Text>
                    <Text style={{ fontFamily: "NotoSansSC", fontSize: 9 }}>
                      {textCn}
                    </Text>
                  </View>
                  {/* Value */}
                  <View style={{ flex: 1, justifyContent: "center", padding: 4 }}>
                    <Text style={{ fontWeight: "bold", fontFamily: "NotoSansSC" }}>{value || ""}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        {/* BLOCK 2: 4 cột, 5 hàng */}
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <View style={styles.row} key={`block2-row-${rowIndex}`}>
            {[0, 1].map((colPairIndex) => {
              const labelIndex = rowIndex * 2 + colPairIndex;
              const textVi = deviceInfoRows.slice(2).flat()[labelIndex] || "";
              const textCn = deviceInfoRowsCN.slice(2).flat()[labelIndex] || "";
              const isFirstCol = colPairIndex === 0;
              const key = deviceInfoKeysBlock2[labelIndex];
              let value = key ? device[key] : "";

              // Hiển thị mảng dưới dạng chuỗi
              if (key === "usedBy") value = renderUsedBy(value);
              else if (Array.isArray(value)) value = value.join(", ");
              // Hiển thị boolean
              if (typeof value === "boolean") value = value ? "Có" : "Không";
              // Hiển thị ngày
              if (key === "lastCalibrationDate" && value)
                value = new Date(value).toLocaleDateString("vi-VN");

              return (
                <View
                  key={colPairIndex}
                  style={[
                    styles.cell,
                    {
                      flexGrow: 1,
                      flexDirection: "row",
                      padding: 0,
                      borderTop: 0,
                      borderLeft: isFirstCol ? 1 : 0,
                    },
                  ]}
                >
                  <View
                    style={{
                      flex: 1,
                      padding: 4,
                      justifyContent: "center",
                      borderRight: 1,
                      borderColor: "#000",
                    }}
                  >
                    <Text>{textVi}</Text>
                    <Text style={{ fontFamily: "NotoSansSC", fontSize: 9 }}>
                      {textCn}
                    </Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: "center", padding: 4 }}>
                    <Text style={{ fontWeight: "bold", fontFamily: "NotoSansSC" }}>{value || ""}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
        {/* Tiêu đề ghi chép lý lịch */}
        <View style={{ marginVertical: 1 }}>
          <Text style={styles.boldCenterText}>Ghi chép lý lịch</Text>
          <Text
            style={[styles.boldCenterText, { fontFamily: "NotoSansSC", fontSize: 10 }]}
          >
            履歷記錄
          </Text>
        </View>

        {/* Bảng ghi chép */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.row}>
            <View style={[styles.historyCell, { flex: 1 }]}>
              <Text>Ngày</Text>
              <Text style={{ fontFamily: "NotoSansSC", fontSize: 9 }}>日期</Text>
            </View>
            <View style={[styles.historyCell, { flex: 3 }]}>
              <Text>Tình hình sửa chữa, hiệu chuẩn và bảo trì</Text>
              <Text style={{ fontFamily: "NotoSansSC", fontSize: 9 }}>
                維修、校準及保養情況
              </Text>
            </View>
            <View style={[styles.historyCell, { flex: 1 }]}>
              <Text>Phán định</Text>
              <Text style={{ fontFamily: "NotoSansSC", fontSize: 9 }}>判定</Text>
            </View>
            <View style={[styles.lastHistoryCell, { flex: 1 }]}>
              <Text>Người ghi chép</Text>
              <Text style={{ fontFamily: "NotoSansSC", fontSize: 9 }}>
                記錄人員
              </Text>
            </View>
          </View>

          {/* Body */}
          {/* Body: render dữ liệu thực tế */}
          {/* Body: Render toàn bộ dữ liệu trong history */}
          {Array.isArray(history) && history.map((item, index) => {
            const date = item.calibrationDate && !isNaN(new Date(item.calibrationDate).getTime())
              ? new Date(item.calibrationDate).toLocaleDateString("vi-VN")
              : "";
            const detail = typeof item.calibrationDetail === 'string' ? item.calibrationDetail : '';
            const result = typeof item.result === 'string' ? item.result : '';
            const scribe = typeof item.scribe === 'string' ? item.scribe : '';

            return (
              <View style={styles.historyRow} key={item.id}>
                <View style={[styles.historyCell, { flex: 1 }]}>
                  <Text style={{ fontFamily: "NotoSans" }}>{date}</Text>
                </View>
                <View style={[styles.historyCell, { flex: 3 }]}>
                  <Text style={{ fontFamily: "NotoSans" }}>{detail}</Text>
                </View>
                <View style={[styles.historyCell, { flex: 1 }]}>
                  <Text style={{ fontFamily: "NotoSans" }}>{result}</Text>
                </View>
                <View style={[styles.lastHistoryCell, { flex: 1 }]}>
                  <Text style={{ fontFamily: "NotoSans" }}>{scribe}</Text>
                </View>
              </View>
            );
          })}
          {/* Body: render dòng trống nếu chưa đủ 10 dòng */}
          {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, index) => (
            <View style={styles.historyRow} key={`empty-${index}`}>
              <View style={[styles.historyCell, { flex: 1 }]} />
              <View style={[styles.historyCell, { flex: 3 }]} />
              <View style={[styles.historyCell, { flex: 1 }]} />
              <View style={[styles.lastHistoryCell, { flex: 1 }]} />
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Đơn vị bảo lưu: Đơn vị phát hành và quản lý | Thời hạn bảo lưu: 3 năm | Phương pháp hủy: Thu hồi | Lần sửa: 01
        </Text>
        <Text style={[styles.footer, { fontFamily: "NotoSansSC" }]}>
          保管單位：發行及管理單位 | 保管期限：3年 | 銷毀方式：回收 | 修改次數：01
        </Text>
      </Page>
    </Document>
  );
};

export default DeviceManagementCard;
