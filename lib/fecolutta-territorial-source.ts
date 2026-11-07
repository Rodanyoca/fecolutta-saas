export const TERRITORY_ID = '1rEVy4LLJPsDHxnyawidS9g38lYY4iwKTLV_cozSpOo4'
export const REFERENCES_ID = '1_RvDhBggMdiZKoeF_c582MRb8pRpnwmB3Mo7ZBYtgCs'
export const readSchema = {
  LIGUES: ['id_ligue', 'nom_ligue', 'pseudo_ligue', 'email_ligue', 'id_province', 'statut', 'observations'],
  ENTENTES: ['id_entente', 'code_entente', 'nom_entente', 'pseudo_entente', 'id_ligue', 'id_ville', 'email_entente', 'statut', 'observations'],
  CLUBS: ['id_club', 'nom_club', 'id_categorie_club', 'id_sexe', 'date_affiliation', 'id_ville', 'id_entente', 'id_ligue', 'statut', 'observations', 'code_club'],
} as const
export function territorialConfiguration(values: Record<string, string | undefined>) {
  const required = (name: string) => { const value = values[name]?.trim(); if (!value) throw new Error(`Configuration manquante : ${name}.`); return value }
  const territory = required('FECOLUTTA_STRUCTURE_TERRITORIALE_SPREADSHEET_ID')
  const references = required('FECOLUTTA_REFERENTIELS_SPREADSHEET_ID')
  if (territory !== TERRITORY_ID || references !== REFERENCES_ID) throw new Error('Les cibles Google Sheets ne correspondent pas aux classeurs FECOLUTTA validés.')
  return { territory, references, email: required('GOOGLE_CLIENT_EMAIL'), key: required('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n') }
}
