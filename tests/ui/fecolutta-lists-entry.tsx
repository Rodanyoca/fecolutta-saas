import React from 'react'
import { createRoot } from 'react-dom/client'
import snapshot from '../data/fecolutta-territory.json'
import { mapTable } from '@/lib/territorial-schema'
import { readSchema } from '@/lib/fecolutta-territorial-source'
import { mapTerritory } from '@/lib/territorial-view-model'
import { TerritoryPage } from '@/components/territorial/page-client'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
const tables = { LIGUES: mapTable(snapshot.tables.LIGUES, readSchema.LIGUES), ENTENTES: mapTable(snapshot.tables.ENTENTES, readSchema.ENTENTES), CLUBS: mapTable(snapshot.tables.CLUBS, readSchema.CLUBS) }
const refs = { PROVINCES: mapTable(snapshot.refs.PROVINCES, ['id_province', 'nom_province']), VILLES: mapTable(snapshot.refs.VILLES, ['id_ville', 'id_province', 'nom_ville']), CATEGORIES_CLUB: mapTable(snapshot.refs.CATEGORIES_CLUB, ['id_categorie_club', 'nom_categorie_club']), SEXES: mapTable(snapshot.refs.SEXES, ['id_sexe', 'nom_sexe']) }
const data = mapTerritory(tables, refs)
const root = createRoot(document.getElementById('root')!)
function render(kind: 'ligues' | 'ententes' | 'clubs' = 'ligues', error = '') {
  root.render(<DashboardLayout initialUser={{ estSuperAdmin: true, access: {} }}><TerritoryPage kind={kind} data={data} canWrite={false} error={error} /></DashboardLayout>)
}
Object.assign(window, { luttaRender: render })
// Isolated browser-only test bundle. No app route imports it, and no remote requests are allowed.
window.fetch = async () => { throw new Error('Network disabled in isolated FECOLUTTA list tests.') }
render()
