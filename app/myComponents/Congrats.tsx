"use client";
import { motion } from "framer-motion";
import Confetti from "react-confetti"; // Assuming you still want confetti
import { X } from "lucide-react"; // For a close button

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // For close button

export default function Congrats({
  isOpen,
  showConfettiEffect, // Renamed for clarity
  onModalClose,
}: {
  isOpen: boolean;
  showConfettiEffect: boolean;
  onModalClose: () => void;
}) {
  // State for confetti pieces, if you want to control its lifecycle
  // const [numConfettiPieces, setNumConfettiPieces] = useState(200);

  // useEffect(() => {
  //   if (!isOpen) {
  //     // Optionally stop confetti when modal closes
  //     // setTimeout(() => setNumConfettiPieces(0), 3000); // Stop after a delay
  //   } else {
  //     // setNumConfettiPieces(200); // Restart confetti if modal reopens
  //   }
  // }, [isOpen]);

  return (
    <>
      {isOpen && showConfettiEffect && (
        <Confetti
          recycle={false}
          numberOfPieces={300} // Adjust as needed
          // width={window.innerWidth} // Might need to get window dimensions safely
          // height={window.innerHeight}
        />
      )}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onModalClose();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              ¡Felicidades!
            </DialogTitle>
            <DialogDescription className="text-center">
              Tu membresía ha sido activada. ¡Bienvenido a PT Fitness Club!
            </DialogDescription>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="py-4 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Estamos emocionados de tenerte a bordo. ¡Explora tus beneficios y
              comienza tu viaje fitness!
            </p>
          </motion.div>
          <DialogClose asChild>
            <Button type="button" className="w-full" onClick={onModalClose}>
              ¡Entendido!
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
