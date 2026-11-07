import "server-only"
export function getUsersSpreadsheetId(): string {
  const id = process.env.FECOLUTTA_USERS_SPREADSHEET_ID?.trim()
  if (!id) throw new Error("FECOLUTTA_USERS_SPREADSHEET_ID est manquant.")
  if (id === process.env.FECOT_USERS_SPREADSHEET_ID?.trim()) throw new Error("Le classeur utilisateurs FECOLUTTA ne doit pas etre celui de FECOT.")
  return id
}
