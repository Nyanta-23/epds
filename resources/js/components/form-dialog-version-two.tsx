import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface FormDialogProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FormDialog({
  title,
  description,
  children,
  open,
  onOpenChange,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="min-w-[400px] sm:min-w-[500px] sm:max-w-[600px]"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="mt-4">{children}</div>

        {/* 
        <DialogFooter>
          <Button className="cursor-pointer" onClick={action}>Save & Publish</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
