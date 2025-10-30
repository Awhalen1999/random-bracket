import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex items-center justify-start px-8 py-4">
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 text-sm">Inspired by</span>
        <Image
          src="/hivemind-logo.svg"
          alt="Hivemind Logo"
          width={120}
          height={32}
          className="h-6 w-auto"
        />
      </div>
    </footer>
  );
}
