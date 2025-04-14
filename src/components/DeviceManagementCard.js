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

const DeviceManagementCard = () => {
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
              const isFirstRow = rowIndex === 0;

              return (
                <View
                  key={colIndex}
                  style={[
                    styles.cell,
                    {
                      flexGrow: 1,
                      flexDirection: "row",
                      padding: 0,
                      borderTop: isFirstRow ? 1 : 0,
                      borderLeft: colIndex === 0 ? 1 : 0,
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
                  <View style={{ flex: 1 }} />
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
              const textCn =
                deviceInfoRowsCN.slice(2).flat()[labelIndex] || "";
              const isFirstCol = colPairIndex === 0;

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
                  <View style={{ flex: 1 }} />
                </View>
              );
            })}
          </View>
        ))}

        {/* Tiêu đề ghi chép lý lịch */}
        <View style={{ marginVertical: 6 }}>
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
          {[...Array(10)].map((_, i) => (
            <View style={styles.historyRow} key={i}>
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