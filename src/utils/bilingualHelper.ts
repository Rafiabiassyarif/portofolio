/**
 * Utility for automatic bilingual synchronization and smart translation.
 * Enables the user to only fill in Indonesian, while automatically generating English equivalents.
 */

const MONTH_MAP: Record<string, string> = {
  'januari': 'January',
  'februari': 'February',
  'maret': 'March',
  'april': 'April',
  'mei': 'May',
  'juni': 'June',
  'juli': 'July',
  'agustus': 'August',
  'september': 'September',
  'oktober': 'October',
  'november': 'November',
  'desember': 'December',
  'jan': 'Jan',
  'feb': 'Feb',
  'mar': 'Mar',
  'apr': 'Apr',
  'agu': 'Aug',
  'agt': 'Aug',
  'sep': 'Sep',
  'okt': 'Oct',
  'nov': 'Nov',
  'des': 'Dec',
};

const PHRASE_MAP: Record<string, string> = {
  'sekarang': 'Present',
  'saat ini': 'Present',
  'skor:': 'Score:',
  'nilai:': 'Grade:',
  'sampai': '-',
  's/d': '-',
  'hingga': '-',
  'pengembang': 'Developer',
  'mahasiswa': 'Student',
  'magang': 'Intern',
  'keberhasilan': 'Accomplishment',
};

/**
 * Translates date or period strings from Indonesian to English.
 * Example: "Jan 2026 - Mei 2026" -> "Jan 2026 - May 2026"
 * Example: "Mei 2026" -> "May 2026"
 * Example: "Agustus 2024 - Sekarang" -> "August 2024 - Present"
 */
export function autoTranslateDate(idDate: string): string {
  if (!idDate) return '';
  let result = idDate;

  // Replace phrases
  for (const [idTerm, enTerm] of Object.entries(PHRASE_MAP)) {
    const regex = new RegExp(`\\b${idTerm}\\b`, 'gi');
    result = result.replace(regex, enTerm);
  }

  // Replace months
  for (const [idMonth, enMonth] of Object.entries(MONTH_MAP)) {
    const regex = new RegExp(`\\b${idMonth}\\b`, 'gi');
    result = result.replace(regex, enMonth);
  }

  return result;
}

/**
 * Returns an English fallback for text if not explicitly provided.
 */
export function autoSyncText(idText: string, enText?: string): string {
  if (enText && enText.trim()) return enText;
  return idText || '';
}
