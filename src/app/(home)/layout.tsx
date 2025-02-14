import { HomeLayout } from "@/modules/home/ui/layouts/home-layout"
interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  // layout.tsxではlayoutのみ呼び出す
  return (
    <HomeLayout>
      {children}
    </HomeLayout>
  )
}

export default Layout
