import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
// @ts-expect-error Node native tests require explicit TypeScript extensions.
import { readSchema, territorialConfiguration, TERRITORY_ID, REFERENCES_ID } from '../lib/fecolutta-territorial-source.ts'
// @ts-expect-error Node native tests require explicit TypeScript extensions.
import { mapTable } from '../lib/territorial-schema.ts'
// @ts-expect-error Node native tests require explicit TypeScript extensions.
import { mapTerritory } from '../lib/territorial-view-model.ts'
const snapshot = JSON.parse(readFileSync(new URL('./data/fecolutta-territory.json', import.meta.url), 'utf8'))
function source() {
  return {
    tables: { LIGUES: mapTable(snapshot.tables.LIGUES, readSchema.LIGUES), ENTENTES: mapTable(snapshot.tables.ENTENTES, readSchema.ENTENTES), CLUBS: mapTable(snapshot.tables.CLUBS, readSchema.CLUBS) },
    refs: { PROVINCES: mapTable(snapshot.refs.PROVINCES, ['id_province', 'nom_province']), VILLES: mapTable(snapshot.refs.VILLES, ['id_ville', 'nom_ville', 'id_province']), CATEGORIES_CLUB: mapTable(snapshot.refs.CATEGORIES_CLUB, ['id_categorie_club', 'nom_categorie_club']), SEXES: mapTable(snapshot.refs.SEXES, ['id_sexe', 'nom_sexe']) },
  }
}
test('FECOLUTTA Drive snapshot: 26 textual IDs, blank statuses, genuine empty child sheets', () => {
  const { tables, refs } = source(), data = mapTerritory(tables, refs)
  assert.deepEqual(data.ligues.map(row => row.idLigue), Array.from({ length: 26 }, (_, i) => String(i + 1).padStart(2, '0')))
  assert.ok(data.ligues.every(row => row.statut === ''))
  assert.equal(data.ententes.length, 0); assert.equal(data.clubs.length, 0)
  assert.equal(data.provinces.length, 26); assert.equal(data.cities.length, 36)
  assert.ok(readSchema.CLUBS.includes('code_club')); assert.ok(readSchema.CLUBS.includes('id_categorie_club'))
})
test('read aliases, actual category key and local club code; resolve league through parent', () => {
  const { tables, refs } = source()
  tables.LIGUES.rows[0].pseudo_ligue = 'LUT-KIN'; tables.LIGUES.rows[0].email_ligue = 'ligue@example.test'
  tables.ENTENTES.rows.push({ id_entente: '0102', code_entente: '02', nom_entente: 'Entente test', pseudo_entente: 'ENT-TEST', id_ligue: '01', id_ville: '', email_entente: 'entente@example.test', statut: '', observations: '' })
  const category = refs.CATEGORIES_CLUB.rows[0]
  tables.CLUBS.rows.push({ id_club: '0102001', code_club: '001', nom_club: 'Club test', id_categorie_club: category.id_categorie_club, id_sexe: '', date_affiliation: '', id_ville: '', id_entente: '0102', id_ligue: '02', statut: '', observations: '' })
  const data = mapTerritory(tables, refs)
  assert.equal(data.ligues[0].sigleLigue, 'LUT-KIN'); assert.equal(data.ligues[0].emailLigue, 'ligue@example.test')
  assert.equal(data.ententes[0].pseudoEntente, 'ENT-TEST'); assert.equal(data.ententes[0].emailEntente, 'entente@example.test')
  assert.equal(data.clubs[0].idCategorieClub, category.id_categorie_club); assert.equal(data.clubs[0].categorie, category.nom_categorie_club)
  assert.equal(data.clubs[0].codeClub, '001'); assert.equal(data.clubs[0].idClub, '0102001'); assert.equal(data.clubs[0].idLigue, '01')
  assert.equal(data.clubs[0].idLigueHistorique, '02'); assert.equal(data.clubs[0].logoDriveUrl, ''); assert.equal(data.diagnostics.length, 1)
})
test('unknown parents do not hide club history or create a direct league relation', () => {
  const { tables, refs } = source()
  tables.CLUBS.rows.push({ id_club: '0102001', nom_club: 'Orphelin', id_entente: '0102', id_ligue: '01' })
  const data = mapTerritory(tables, refs)
  assert.equal(data.clubs.length, 1); assert.equal(data.clubs[0].idLigue, ''); assert.equal(data.diagnostics.length, 1)
})
test('empty data needs valid headers; absent/duplicate headers or IDs are errors', () => {
  assert.equal(mapTable([[...readSchema.CLUBS]], readSchema.CLUBS).rows.length, 0)
  assert.throws(() => mapTable([], readSchema.CLUBS))
  assert.throws(() => mapTable([['id_club', 'id_club']], ['id_club']))
  assert.throws(() => mapTable([['id_club'], ['01'], ['01']], ['id_club']))
})
test('only explicit FECOLUTTA target IDs are accepted; no FECOT fallback', () => {
  const config = { FECOLUTTA_STRUCTURE_TERRITORIALE_SPREADSHEET_ID: TERRITORY_ID, FECOLUTTA_REFERENTIELS_SPREADSHEET_ID: REFERENCES_ID, GOOGLE_CLIENT_EMAIL: 'test@example.test', GOOGLE_PRIVATE_KEY: 'test-key' }
  assert.equal(territorialConfiguration(config).territory, TERRITORY_ID)
  assert.throws(() => territorialConfiguration({ ...config, FECOLUTTA_STRUCTURE_TERRITORIALE_SPREADSHEET_ID: 'FECOT' }))
  assert.throws(() => territorialConfiguration({ FECOT_STRUCTURE_TERRITORIALE_SPREADSHEET_ID: TERRITORY_ID }))
  assert.throws(() => territorialConfiguration({ ...config, GOOGLE_PRIVATE_KEY: '' }))
})
