import Navbar from '../navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-4 pt-20">{children}</main>
    </>
  )
}
