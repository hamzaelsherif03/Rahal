import { Header } from './header';

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>{children}</main>
    </div>
  );
}