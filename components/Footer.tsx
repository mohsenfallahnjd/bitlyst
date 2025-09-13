import { SniplyRoundedMark } from "./sniply-typography-icons/SniplyIcons";

export default function Footer() {
  return (
    <footer className="border-t dark:border-gray-800 mt-16">
      <div className="container py-10 text-sm text-gray-500 flex items-center justify-between">
        <p className="flex items-center gap-2">
          © {new Date().getFullYear()} . <SniplyRoundedMark size={16} /> Sniply
        </p>
      </div>
    </footer>
  );
}
