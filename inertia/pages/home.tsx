import { Button } from '../components/ui/button'
import { Head } from '@inertiajs/react'

export default function Home() {
  return (
    <>
      <Head title="Accueil" />

      <div className="flex items-center gap-2 flex-col">
        <h1 className="text-lg">Bienvenue sur la page d'accueil</h1>
        <Button>Cliquer ici</Button>
      </div>
    </>
  )
}
