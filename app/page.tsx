import Image from "next/image";
import Link from "next/link";
import { dummyMembership } from "./DATA/membership";
import MembershipCards from "./myComponents/MembershipCards";
import { MapPin, Mail, Clock, Dumbbell } from "lucide-react";
import Beneficios from "./myComponents/Beneficios";
import NavBar from "./myComponents/NavBar";

export default function Home() {
  return (
    <main>
      <NavBar />
      {/* hero section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter  md:text-5xl/none">
                  Transforma tu cuerpo en poco tiempo
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  At FitFlex Gym, we believe fitness is not just about looking
                  good, but feeling great. Join our community and start your
                  journey to a healthier you.
                </p>
                <div className="">
                  <button className="px-8 text-lg">Join Now</button>
                  <button className="px-8 bg-zinc-700 py-2 rounded-lg text-white">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            <Image
              src={`/images/gym_1.jpg`}
              width={500}
              height={500}
              alt="working out at the gym"
              className="overflow-hidden rounded-xl object-cover object-center mx-auto "
            />
          </div>
        </div>
      </section>
      {/* Memberships */}
      <section className="w-full bg-zinc-200 py-10">
        <div className="flex flex-col items-center space-y-1 mb-5">
          <h1 className="text-3xl font-bold text-center">Membresias</h1>
          <p className="text-md text-center text-zinc-600">
            Escoge la membresia que cumpla con tus metas
          </p>
        </div>
        <div className="flex items-center gap-6 justify-center gap-x-20">
          {dummyMembership.map((membership) => (
            <MembershipCards
              key={membership.title}
              title={membership.title}
              titleDescription={membership.titleDescription}
              price={membership.price}
              isPopular={membership.isPopular}
              features={membership.features}
            />
          ))}
        </div>
      </section>
      {/* Beneficios */}
      <section className="py-12">
        <div className="flex flex-col text-center items- gap-y-2 mb-8">
          <h1 className="text-4xl font-bold">Lo que te ofrecemos</h1>
          <p className="text-md font-zinc-500">
            Todo lo que necesitas en un mismo lugar
          </p>
        </div>
        <Beneficios />
      </section>
      {/* Contact Form */}
      <section className="px-8 py-12">
        <div className="text-center flex flex-col items-center mx-auto mb-14">
          <h1 className="text-5xl font-bold ">¡Contáctanos Hoy!</h1>
          <h4 className="text-xl text-zinc-500">
            ¿Tienes preguntas? Te ayudamos. Envianos un mensaje.
          </h4>
        </div>
        <div className="grid grid-cols-2 mx-auto">
          <div className="space-y-4 px-8 flex flex-col justify-center">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span>123 Fitness Street, Gym City, GC 12345</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary" />
              <span>info@fitflexgym.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-primary" />
              <span>Mon-Fri: 5am-11pm, Sat-Sun: 7am-9pm</span>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="rounded-full bg-muted p-2 text-muted-foreground hover:text-primary"
                >
                  <Image
                    src={`/icons/Facebook_Logo_Primary.png`}
                    alt="facebook logo"
                    width={30}
                    height={30}
                  />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="#"
                  className="rounded-full bg-muted p-2 text-muted-foreground hover:text-primary"
                >
                  <Image
                    src={`/icons/Instagram_Glyph_Gradient.png`}
                    alt="Instagram logo"
                    width={30}
                    height={30}
                  />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="#"
                  className="rounded-full bg-muted p-2 text-muted-foreground hover:text-primary"
                >
                  <Image
                    src={`/icons/Digital_Glyph_Green.png`}
                    alt="WhatsApp Logo"
                    width={30}
                    height={30}
                  />
                  <span className="sr-only">WhatsApp</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="space-y-4 px-4">
            <form className="space-y-4 ">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <input
                    name="name"
                    placeholder="Nombre"
                    className="w-full border-2 border-zinc-700 rounded-lg p-2 shadow-md"
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo Electrónico"
                    className="w-full border-2 border-zinc-700 rounded-lg p-2 shadow-md"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Teléfono"
                  className="w-full border-2 border-zinc-700 rounded-lg p-2 shadow-md"
                />
              </div>
              <div className="space-y-2">
                <textarea
                  name="message"
                  placeholder="Tu mensaje"
                  className="min-h-[120px] p-2 border-2 border-zinc-700 rounded-2xl w-full shadow-md"
                />
              </div>
            </form>
          </div>
        </div>
      </section>
      <footer className="w-full border-t py-6 px-4">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <div className="flex items-center gap-2 font-bold">
            <Dumbbell className="h-6 w-6" />
            <span>FitFlex Gym</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} FitFlex Gym. All rights reserved.
          </p>
          <div className="flex gap-4 md:ml-auto md:gap-2">
            <Link
              href="#"
              className="text-sm underline-offset-4 hover:underline"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm underline-offset-4 hover:underline"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
