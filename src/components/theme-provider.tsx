"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// This component provides the Dark/Light mode theme switching functionality
// ഡാർക്ക്/ലൈറ്റ് മോഡ് തീം മാറ്റാൻ സഹായിക്കുന്ന ഘടകം (Component) ആണിത്
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Wraps the entire application with the theme provider
  // ആപ്ലിക്കേഷനെ മുഴുവനായി തീം പ്രൊവൈഡർ ഉപയോഗിച്ച് റാപ്പ് ചെയ്യുന്നു
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
