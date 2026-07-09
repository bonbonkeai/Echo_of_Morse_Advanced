import { ReactNode } from "react"
import Footer from "@/components/layout/footer"

type PageShellProps = {
  children: ReactNode
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div
      style={{
        maxWidth: "1180px",
        margin: "0 auto",
        padding: "32px 32px 56px 32px",
      }}
    >
      {children}
      <Footer />
    </div>
  )
}
