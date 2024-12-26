interface RootLayoutProps {
    children: React.ReactNode
  }
  
  export default function RootLayout({ children }: RootLayoutProps) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    )
  }
  
  