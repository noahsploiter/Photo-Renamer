"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [photoData, setPhotoData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [renameStatus, setRenameStatus] = useState("");

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    setPhotoData(files);
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const renamePhotos = () => {
    if (photoData.length > 0 && excelData.length > 0) {
      let successCount = 0;
      let errorCount = 0;

      photoData.forEach((file, index) => {
        const studentData = excelData[index];
        if (studentData) {
          const studentName = studentData["student name"];
          const studentId = studentData["id"];
          const renamedPhotoName = `${studentName} ${studentId}.jpg`; // Replace with actual renamed photo name

          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result;
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = renamedPhotoName;
            link.click();
            successCount++;
          };

          reader.onerror = () => {
            errorCount++;
          };

          reader.readAsDataURL(file);
        } else {
          errorCount++;
        }
      });

      const renameStatusMessage = `${successCount} photo(s) renamed and downloaded successfully, ${errorCount} photo(s) failed to rename.`;
      setRenameStatus(renameStatusMessage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Photo Renamer</h1>
      <div className="flex flex-col space-y-4">
        <h2>Add your photos</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          className="p-2 border border-gray-300 rounded"
        />
        <h2>Add your Excel file</h2>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleExcelUpload}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={renamePhotos}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
        >
          Rename and Download Photos
        </button>
      </div>
      {renameStatus && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Rename and Download Status:</h2>
          <p>{renameStatus}</p>
        </div>
      )}
      {photoData.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Uploaded Photos:</h2>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {photoData.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Uploaded Photo ${index + 1}`}
                className="max-w-full"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
