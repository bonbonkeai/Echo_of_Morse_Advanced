import { ReactNode } from "react"
import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"

type PageShellProps = {
  children: ReactNode
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div
      style={{
        maxWidth: "1180px",
        margin: "0 auto",
        padding: "0 24px 56px 24px",
      }}
    >
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}