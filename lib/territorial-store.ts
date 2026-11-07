import "server-only"
import { territorialConfiguration, readSchema } from "./fecolutta-territorial-source"
import { google } from "googleapis"
import { mapTable, type Table, type Row, type Sheet } from "./territorial-schema"

export function required(name: string) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Configuration manquante : ${name}.`)
  return value
}
export const configured = () => { try { territorialConfiguration(process.env); return true } catch { return false } }
export function sheetsClient() {
  const config = territorialConfiguration(process.env)
  const auth = new google.auth.JWT({ email: config.email, key: config.key, scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"] })
  return google.sheets({ version: "v4", auth })
}
const refsSchema = {
  PROVINCES: ["id_province", "nom_province"], VILLES: ["id_ville", "id_province", "nom_ville"],
  CATEGORIES_CLUB: ["id_categorie_club", "nom_categorie_club"], SEXES: ["id_sexe", "nom_sexe"],
}
export type TerritorialTables = Record<Sheet, Table>
export type ReferenceTables = Record<keyof typeof refsSchema, Table>
export async function readTables(): Promise<{ tables: TerritorialTables; refs: ReferenceTables }> {
  const client = sheetsClient()
  const specs = [readSchema, refsSchema] as const
  const config = territorialConfiguration(process.env)
  const ids = [config.territory, config.references]
  const results = await Promise.all(specs.map(async (spec, index) => {
    const names = Object.keys(spec)
    const result = await client.spreadsheets.values.batchGet({ spreadsheetId: ids[index], ranges: names.map(name => `'${name}'!A:${index === 0 ? (name === 'LIGUES' ? 'G' : name === 'ENTENTES' ? 'I' : 'K') : 'D'}`), valueRenderOption: 'FORMATTED_VALUE' }, { timeout: 15000, retry: false })
    return Object.fromEntries(names.map((name, position) => [name, mapTable(result.data.valueRanges?.[position]?.values || [], spec[name as keyof typeof spec])]))
  })).catch(() => { throw new Error("Lecture Google Sheets FECOLUTTA indisponible ou en-tetes incompatibles. Aucun repli fictif.") })
  return { tables: results[0] as TerritorialTables, refs: results[1] as ReferenceTables }
}
export async function writeRecord(_sheet: Sheet, _table: Table, _id: string, _record: Row, _editing: boolean): Promise<never> {
  throw new Error("Lot listes FECOLUTTA en lecture seule : mutations indisponibles avant raccordement des formulaires.")
}
