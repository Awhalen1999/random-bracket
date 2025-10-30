export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4">
      <h1 className="text-2xl font-bold text-white">Random Bracket</h1>
      <nav>
        <a
          href="/results"
          className="text-zinc-300 hover:text-white transition-colors font-medium"
        >
          Results
        </a>
      </nav>
    </header>
  );
}
