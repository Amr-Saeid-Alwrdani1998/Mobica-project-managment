'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function ExcelToJsonPage() {
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

reader.onload = (evt) => {
  const data = evt.target?.result;
  const workbook = XLSX.read(data, { type: 'binary' });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawJson = XLSX.utils.sheet_to_json(worksheet, { raw: true });

  const processedJson = rawJson.map((row: any) => {
    const newRow = { ...row };

    // حدد الأعمدة اللي هي تواريخ
    const dateColumns = ['تاريخ الميلاد', 'تاريخ التوريد'];

    dateColumns.forEach((col) => {
      const value = newRow[col];
      if (typeof value === 'number') {
        const date = XLSX.SSF.parse_date_code(value);
        if (date) {
          newRow[col] = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
        }
      }
    });

    return newRow;
  });

  setJsonData(processedJson);
};


    reader.readAsBinaryString(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    alert('✅ تم نسخ JSON إلى الحافظة');
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.[^/.]+$/, "") + '.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📥 تحويل Excel إلى JSON</h1>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {fileName && <p className="mb-2 text-sm text-gray-600">الملف: {fileName}</p>}

      {jsonData.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">📄 بيانات JSON:</h2>

          <div className="flex gap-4 mb-4">
            <button
              onClick={handleCopy}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              📋 نسخ JSON
            </button>
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              💾 تنزيل JSON
            </button>
          </div>

          <pre className="bg-gray-100 p-4 rounded max-h-[500px] overflow-auto text-sm">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
