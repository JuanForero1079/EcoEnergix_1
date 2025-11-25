import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportTableToPDF = (title, columns, data) => {
  const doc = new jsPDF("p", "pt");

  doc.setFontSize(16);
  doc.text(title, 40, 40);

  // AutoTable
  autoTable(doc, {
    startY: 60,
    head: [columns],
    body: data,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [30, 144, 255] },
  });

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
};
