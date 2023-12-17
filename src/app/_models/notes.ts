import { NoteAlignment, NoteFormat, NoteItem } from "@prisma/client";

export interface CreateNoteForm {
  title: string;
  text: string;
  text_format?: string;
  title_format?: string;
  text_alignment?: string;
  title_alignment?: string;
  note_widget_fk: string;
}

export interface EditNote {
  title: string;
  text: string;
  note_widget_fk?: string;
}

export interface ExpandedNoteItem extends NoteItem {
  text_format?: NoteFormat;
  title_format?: NoteFormat;
  title_alignment?: NoteAlignment;
  text_alignment?: NoteAlignment;
}
