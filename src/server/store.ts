let document: any = {
  shapes: [],
};

export const getDocument = () => document;

export const saveDocument = (newDoc: any) => {
  document = newDoc;
};
