// components/ui/modal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

export const Modal = ({
  title,
  description,
  children,
  open,
  onOpenChange,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      {children}
    </DialogContent>
  </Dialog>
);
