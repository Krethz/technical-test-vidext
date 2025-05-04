"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { trpc } from "../lib/trpc/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Spinner from "./ui/spinner";
import { toast } from "sonner";
import RenameDocumentModal from "./RenameDocumentModal";
import { format } from "date-fns";
import { Drawing } from "@/lib/types/Drawing";

export function DrawingList({ drawings }: { drawings: Drawing[] }) {
  const [drawingToDelete, setDrawingToDelete] = useState<Drawing | null>(null);
  const [drawingToRename, setDrawingToRename] = useState<Drawing | null>(null);
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const { isLoading, refetch } = trpc.drawings.getAll.useQuery();

  const deleteDrawing = trpc.drawings.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast(`"${drawingToDelete?.name}" has been deleted.`);
      setDrawingToDelete(null);
    },
  });

  const updateDrawing = trpc.drawings.update.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: () => {},
  });

  const handleRenameDocument = (newName: string) => {
    setShowRenameModal(!showRenameModal);
    updateDrawing.mutate({
      id: drawingToRename!.id,
      name: newName,
      data: drawingToRename!.data,
    });
    toast(`"${drawingToRename?.name}" name has been updated to "${newName}"`);
  };

  const handleDelete = () => {
    if (drawingToDelete) {
      deleteDrawing.mutate({ id: drawingToDelete.id });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Spinner />
      </div>
    );
  }

  if (drawings.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">There are no documents</p>
        <Link href="/editor/new">
          <Button>Create my first document</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {drawings.map((drawing) => (
        <Card key={drawing.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <p className="text-lg font-medium">{drawing.name}</p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDrawingToRename(drawing)}
                    >
                      <Edit size={15} />
                    </Button>
                  </AlertDialogTrigger>
                  {drawingToRename && (
                    <RenameDocumentModal
                      drawing={drawingToRename}
                      onAccept={handleRenameDocument}
                    />
                  )}
                </AlertDialog>
              </div>
              <div>
                <p className="text-sm font-medium">Created at:</p>
                {format(drawing.createdAt, "dd/MM/yyyy HH:mm")}
              </div>
              <div>
                <p className="text-sm font-medium">Last modified:</p>
                {format(drawing.updatedAt, "dd/MM/yyyy HH:mm")}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-4 pt-0">
            <Link href={`/editor/${drawing.id}`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDrawingToDelete(drawing)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action can not be undone. The document will be
                    permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
