"use client"
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("يرجى اختيار ملف Excel");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✔ تم تحميل ${data.count} سجل بنجاح`);
      } else {
        setMessage(`✖ فشل التحميل: ${data.message || res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("✖ حدث خطأ أثناء الرفع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">رفع ملف Excel</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "جاري الرفع..." : "رفع الملف"}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
