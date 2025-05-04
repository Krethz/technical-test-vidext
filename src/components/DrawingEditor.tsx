"use client";

import { memo, useCallback } from "react";
import { getSnapshot, Tldraw, useEditor } from "tldraw";
import "tldraw/tldraw.css";
import { Button } from "./ui/button";
import { Bot, Save } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import Spinner from "./ui/spinner";

function DrawingEditorComponent({
  initialData,
  documentName,
  documentId,
  onUpdated,
}: {
  initialData?: string;
  documentName: string;
  documentId: string;
  onUpdated: () => void;
}) {
  const updateDrawing = trpc.drawings.update.useMutation({
    onSuccess: () => {
      toast(`"${documentName}" has been saved.`);
      onUpdated();
    },
    onError: () => {
      toast(`There was an error saving the document.`);
    },
  });

  const generateDescription = trpc.describe.useMutation({
    onSuccess: (message) => {
      console.log(message);
    },
  });

  const CustomButton = () => {
    const editor = useEditor();

    const handleClick = useCallback(() => {
      if (!editor) return;
      const snapshot = getSnapshot(editor.store);
      const data = JSON.stringify(snapshot);

      updateDrawing.mutate({ id: documentId, name: documentName, data });
    }, [editor]);

    return (
      <Button
        onClick={handleClick}
        className="m-2 pointer-events-auto"
        title="Save document"
      >
        <Save className="mr-1 h-4 w-4 " />
        Save
      </Button>
    );
  };

  const AiButton = () => {
    const editor = useEditor();

    const handleClick = useCallback(() => {
      if (!editor) return;
      const snapshot = getSnapshot(editor.store);
      const data = JSON.stringify(snapshot);
      generateDescription.mutate({ store: snapshot });
    }, [editor]);
    return (
      <Button
        // onClick={handleClick}
        className="m-2 pointer-events-auto"
        title="Generate an IA based description"
      >
        <Bot className="mr-1 h-4 w-4 " />
        AI
      </Button>
    );
  };

  if (updateDrawing.isPending) {
    return <Spinner />;
  }

  return (
    <div className="h-[600px] border rounded-md overflow-hidden">
      <Tldraw
        initialData={
          initialData ? JSON.parse(initialData).document.store : undefined
        }
        components={{
          SharePanel: () => (
            <div className="flex gap-1 p-1">
              <AiButton />
              <CustomButton />
            </div>
          ),
        }}
      />
    </div>
  );
}

export const DrawingEditor = memo(DrawingEditorComponent);
