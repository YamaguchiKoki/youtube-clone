interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-screen">
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
