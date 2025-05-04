"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DrawingEditor } from "@/components/DrawingEditor";
import { trpc } from "@/lib/trpc/client";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DrawingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === "new";
  const [documentName, setDocumentName] = useState<string>("New Document");
  const [documentNameModalOpen, setDocumentNameModalOpen] =
    useState<boolean>(false);
  const [isCreating, setIsCreating] = useState(false);

  const createDrawing = trpc.drawings.create.useMutation({
    onSuccess: (newDrawing) => {
      router.replace(`/editor/${newDrawing.id}`);
    },
    onError: () => {
      toast.error("Error creating document");
      setIsCreating(false);
    },
  });

  const {
    data: drawing,
    isLoading,
    refetch,
  } = trpc.drawings.getById.useQuery(
    { id: isNew ? "" : id },
    { enabled: !isNew }
  );

  const memoizedInitialData = useMemo(() => drawing?.data, [drawing]);

  useEffect(() => {
    if (drawing?.name) {
      setDocumentName(drawing.name);
    }
  }, [drawing]);

  useEffect(() => {
    if (isNew) {
      setDocumentNameModalOpen(true);
    }
  }, [isNew]);

  const handleUpdated = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleAcceptName = () => {
    setIsCreating(true);
    setDocumentNameModalOpen(false);

    createDrawing.mutate({
      name: documentName,
      data: JSON.stringify({ document: { store: {} } }),
    });
  };

  const handleGenerateDescription = ()=>{
    generateDescription.mutate({store})
  }

  const newNameModal = () => (
    <AlertDialog
      open={documentNameModalOpen}
      onOpenChange={setDocumentNameModalOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Document Name</AlertDialogTitle>
          <AlertDialogDescription>
            <Input
              defaultValue="New Document"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAcceptName();
              }}
              onChange={(e) => setDocumentName(e.target.value)}
              maxLength={35}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => router.push("/")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAcceptName}>
            Aceptar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (isCreating || isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <span className="font-medium">{documentName}</span>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {newNameModal()}
          {!documentNameModalOpen && (
            <DrawingEditor
              documentName={documentName}
              documentId={id}
              initialData={memoizedInitialData}
              onUpdated={handleUpdated}
            />
          )}
        </>
      )}
    </div>
  );
}
