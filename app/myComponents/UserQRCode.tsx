"use client";
import { useState } from "react";

import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCodeIcon } from "lucide-react";
type QRProps = {
  userId: string;
};

export default function UserQRCode({ userId }: QRProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  return (
    <div className="">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2">
            <QrCodeIcon className="h-4 w-4" />
            <span>Ver mi QRCode</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] p-2 w-fit overflow-hidden flex flex-col items-center gap-y-2 justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-2xl">
                  Tu QRCode personal
                </DialogTitle>
                <DialogDescription>
                  Escanea tu QRcode para guardar tu asistencia
                </DialogDescription>
                <div className="">
                  <QRCode value={userId} size={300} />
                </div>
              </DialogHeader>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
