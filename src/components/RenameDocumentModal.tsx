import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { Drawing } from "@/lib/types/Drawing";

export default function RenameDocumentModal({
  drawing,
  onAccept,
}: {
  drawing: Drawing | null;
  onAccept: (newName: string) => void;
}) {
  const [newName, setNewName] = useState(drawing!.name);

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Rename</AlertDialogTitle>
        <AlertDialogDescription>
          <Input onChange={(e) => setNewName(e.target.value)} />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => onAccept(newName)}>
          Accept
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
