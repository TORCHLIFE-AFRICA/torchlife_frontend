import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { ArrowRight } from "lucide-react";

interface ContactOption {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

interface ContactModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
  options: ContactOption[];
  showCloseButton?: boolean;
}

export function ModalWithLinks({
  open,
  setOpen,
  title,
  description,
  options,
  showCloseButton = true,
}: ContactModalProps) {
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={showCloseButton} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                {option.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{option.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {option.description}
                </p>
              </div>
              <Button variant="default" size="sm" onClick={option.action}>
                Contact <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full"
          >
            Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
