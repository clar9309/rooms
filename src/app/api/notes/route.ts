import { db } from "@/lib/prisma-client";
import * as z from "zod";
import createnoteschema from "../../_utils/validation/schemas/create-note-schema";
import { NextResponse } from "next/server";

// Handle POST requests
export async function POST(req: Request) {
  try {
    // Validation schema
    const body = await req.json();
    const {
      title,
      text,
      note_widget_fk,
      text_format,
      title_format,
      title_alignment,
      text_alignment,
    } = createnoteschema.parse(body);

    // Formatting
    const textFormatData = await db.noteFormat.findFirst({
      where: { formatting: text_format },
    });

    const titleFormatData = await db.noteFormat.findFirst({
      where: { formatting: title_format },
    });

    // Alignment
    const titleAlignData = await db.noteAlignment.findFirst({
      where: { alignment: title_alignment },
    });

    const textAlignData = await db.noteAlignment.findFirst({
      where: { alignment: text_alignment },
    });

    interface NoteItemCreateParams {
      title: string;
      text: string;
      note_widget: {
        connect: { id: string };
      };
      title_format?: {
        connect: { id: string };
      };
      text_format?: {
        connect: { id: string };
      };
      title_alignment?: {
        connect: { id: string };
      };
      text_alignment?: {
        connect: { id: string };
      };
    }

    // Your logic
    const newNoteData: NoteItemCreateParams = {
      title,
      text,
      note_widget: {
        connect: { id: note_widget_fk },
      },
    };

    if (titleFormatData && titleFormatData.id) {
      newNoteData.title_format = { connect: { id: titleFormatData.id } };
    }

    if (textFormatData && textFormatData.id) {
      newNoteData.text_format = { connect: { id: textFormatData.id } };
    }

    if (titleAlignData && titleAlignData.id) {
      newNoteData.title_alignment = { connect: { id: titleAlignData.id } };
    }

    if (textAlignData && textAlignData.id) {
      newNoteData.text_alignment = { connect: { id: textAlignData.id } };
    }

    const newNote = await db.noteItem.create({
      data: newNoteData,
    });

    // Return a success response with the created note
    return NextResponse.json(
      {
        note: newNote,
        msg: "Note created",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      // Zod validation errors
      const validationErrors = error.issues.map((issue) => {
        return {
          message: issue.message,
        };
      });

      // Return a validation error response
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    } else {
      // Other errors
      console.error(error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}

// Handle PUT (edit note) request
export async function PUT(req: Request) {
  try {
    const { id, title, text } = await req.json();

    const currentDate = new Date();
    const isoDateString = currentDate.toISOString();
    // Opdater note item ID
    const updatedNote = await db.noteItem.update({
      where: {
        id,
      },
      data: {
        title,
        text,
        updated_at: isoDateString, // Opdaterer updated_at timestamp
      },
    });

    // Success response for note update
    return NextResponse.json(
      {
        note: updatedNote,
        msg: "Note updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
  }
}

// Handle DELETE requests
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Prisma delete note item ID
    const deletedNote = await db.noteItem.delete({
      where: {
        id,
      },
    });

    // Success response for note deletion
    return NextResponse.json(
      {
        note: deletedNote,
        msg: "Note deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zod validation errors
      const validationErrors = error.issues.map((issue) => ({
        message: issue.message,
      }));

      // Return a validation error response
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    } else {
      // Other errors
      console.error(error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
