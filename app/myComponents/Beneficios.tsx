import {
  Dumbbell,
  Mail,
  Coffee,
  Clock,
  Users,
  MapPin,
  LockKeyhole,
} from "lucide-react";

export default function Beneficios() {
  return (
    <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-8">
      <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
        <Dumbbell className="h-12 w-12 text-primary" />
        <h3 className="text-xl font-bold">State-of-the-art Equipment</h3>
        <p className="text-center text-muted-foreground">
          Latest fitness machines and free weights for all your training needs.
        </p>
      </div>
      <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
        <Users className="h-12 w-12 text-primary" />
        <h3 className="text-xl font-bold">Entrenador Personal</h3>
        <p className="text-center text-muted-foreground">
          Expertos te ayudaran a lograr tus metas.
        </p>
      </div>
      <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
        <Coffee className="h-12 w-12 text-primary" />
        <h3 className="text-xl font-bold">Barra</h3>
        <p className="text-center text-muted-foreground">
          Alimentos nutritivos llenos de proteina para seguir con tu día.
        </p>
      </div>
      <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
        <Clock className="h-12 w-12 text-primary" />
        <h3 className="text-xl font-bold">Horarios flexibles</h3>
        <p className="text-center text-muted-foreground">
          Abrimos temprano y cerramos con el fin de ajustarno a tus horarios.
        </p>
      </div>
      <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
        <MapPin className="h-12 w-12 text-primary" />
        <h3 className="text-xl font-bold">Cerca de tu comunidad</h3>
        <p className="text-center text-muted-foreground">
          Espacio cómodo con estacionamiento
        </p>
      </div>
      <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
        <LockKeyhole className="h-12 w-12 text-primary" />
        <h3 className="text-xl font-bold">Lockers</h3>
        <p className="text-center text-muted-foreground">
          Espacio para que mantengas tus pertenecias seguras sin ninguna
          preocupación
        </p>
      </div>
    </div>
  );
}
