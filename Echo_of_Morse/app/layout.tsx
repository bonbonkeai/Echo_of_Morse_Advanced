import "./globals.css";

import { I18nProvider } from "@/lib/i18n";
import SkipLink from "@/components/layout/skipLink";
import AuthSessionProvider from "@/components/auth/session-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import Navbar from "@/components/layout/navbar";

export const metadata = {
  title: "Echoes of Morse",
  description: "Learn, communicate, and compete through Morse code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <AuthSessionProvider>
          <SocketProvider>
            <I18nProvider>
              <NotificationProvider>
                <SkipLink />
                <Navbar />
                {children}
              </NotificationProvider>
            </I18nProvider>
          </SocketProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
