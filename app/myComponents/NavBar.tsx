import Image from "next/image";
import Link from "next/link";
export default function NavBar() {
  return (
    <header className=" flex justify-evenly items-center sticky top-0 z-40 rounded-2xl py-4  backdrop-blur supports-[backdrop-filter]:bg-background/20 w-1/2 mx-auto shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between gap-2">
          <Image src={`/icon.png`} alt="logo" width={30} height={30} />
          <p className="font-bold text-xl">PT Fitness Club</p>
        </div>
      </div>
      <nav className="hidden md:flex gap-6">
        <Link
          href="#"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Home
        </Link>
        <Link
          href="#memberships"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Memberships
        </Link>
        <Link
          href="#amenities"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Amenities
        </Link>
        <Link
          href="#contact"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Contact
        </Link>
      </nav>
      <button className="bg-zinc-700 text-white rounded-lg px-2 py-1">
        Únete ahora
      </button>
    </header>
  );
}
