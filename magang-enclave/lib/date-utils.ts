export function formatDateToDDMMYYYY(dateString: string): string {
  if (!dateString) return "";
  
  // If already in DD/MM/YYYY format, return as is
  if (dateString.includes("/")) {
    return dateString;
  }
  
  // Convert from YYYY-MM-DD to DD/MM/YYYY
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

export function formatDateToYYYYMMDD(dateString: string): string {
  if (!dateString) return "";
  
  // If already in YYYY-MM-DD format, return as is
  if (dateString.includes("-")) {
    return dateString;
  }
  
  // Convert from DD/MM/YYYY to YYYY-MM-DD
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}

export function getTodayDDMMYYYY(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getTodayYYYYMMDD(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${year}-${month}-${day}`;
}

// Validasi tanggal untuk memastikan bulan dan hari valid
export function validateDateInput(dateString: string): { valid: boolean; message: string } {
  if (!dateString) {
    return { valid: false, message: "Tanggal harus diisi" };
  }

  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return { valid: false, message: "Format tanggal tidak valid" };
  }

  const [year, month, day] = dateString.split("-").map(Number);
  
  // Validasi tahun
  if (year < 1900 || year > 2099) {
    return { valid: false, message: "Tahun harus antara 1900-2099" };
  }

  // Validasi bulan (1-12)
  if (month < 1 || month > 12) {
    return { valid: false, message: "Bulan harus antara 1-12" };
  }

  // Validasi hari sesuai bulan
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return { valid: false, message: `Tanggal tidak valid untuk bulan ${month}. Maksimal ${daysInMonth} hari` };
  }

  return { valid: true, message: "" };
}
