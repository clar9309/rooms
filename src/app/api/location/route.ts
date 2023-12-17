import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { authenticateUser } from "@/app/_utils/authentication/authenticateUser";
import { db } from "@/lib/prisma-client";
import locationschema from "@/app/_utils/validation/schemas/location-schema";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams.get("searchQuery");
    if (!searchParams) {
      return NextResponse.json({
        msg: "Required params not valid",
        status: 400,
      });
    }
    const file = await fs.readFile(
      process.cwd() + "/src/app/assets/data/city.list.json",
      "utf8"
    );

    const cities = JSON.parse(file);

    // Function to find the best matches based on the search query
    const findBestMatches = (searchQuery: string) => {
      const exactMatches: any[] = [];
      const startMatches: any[] = [];
      // Filter cities based on search query logic
      cities.forEach((city: any) => {
        const cityName = city.name.toLowerCase();
        if (cityName === searchQuery.toLowerCase()) {
          exactMatches.push(city);
        }
      });
      if (exactMatches.length < 5) {
        cities.forEach((city: any) => {
          const cityName = city.name.toLowerCase();
          if (
            cityName.startsWith(searchQuery.toLowerCase()) &&
            !exactMatches.includes(city)
          ) {
            startMatches.push(city);
          }
        });
      }
      const combinedMatches = [...exactMatches, ...startMatches].slice(0, 5);

      return combinedMatches;
    };

    // Example usage:
    const bestMatches = findBestMatches(searchParams);

    return NextResponse.json(
      {
        msg: "Ok",
        citiesResult: bestMatches,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const resp = await authenticateUser(req);

    if (resp.status !== 200) {
      const msg = resp.data.msg;

      return NextResponse.json(
        {
          error: msg,
        },
        { status: resp.status }
      );
    }
    const { user } = resp.data;

    const body = await req.json();
    const { roomId, id, latitude, longitude, country, city, state } =
      locationschema.parse(body);

    const room = await db.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        cover: true,
        location: true,
      },
    });

    if (!room) {
      return NextResponse.json(
        {
          error: "Room not found",
        },
        { status: 404 }
      );
    }

    //Only admin can edit room
    if (user!.id !== room.admin_fk) {
      return NextResponse.json(
        {
          error: "Access to edit room forbidden",
        },
        { status: 403 }
      );
    }

    //Location should only be created if it doesn't already exist
    if (room.location) {
      return NextResponse.json(
        {
          error: "Room location already exists, consider using PUT",
        },
        { status: 400 }
      );
    }
    const existingLocation = await db.location.findUnique({
      where: {
        latitude_longitude: {
          latitude: latitude,
          longitude: longitude,
        },
      },
    });

    const currentDate = new Date();
    const isoDateString = currentDate.toISOString();
    if (existingLocation) {
      const updatedRoom = await db.room.update({
        where: {
          id: room.id,
        },
        data: {
          location: { connect: { id: id } },
          updated_at: isoDateString,
        },
        include: {
          cover: true,
          participants: true,
          location: true,
        },
      });
      return NextResponse.json(
        {
          msg: "Ok",
          updatedRoom: updatedRoom,
        },
        { status: 200 }
      );
    } else {
      const result = await db.$transaction([
        //create location
        db.location.create({
          data: {
            id: id,
            latitude: latitude,
            longitude: longitude,
            country: country,
            city: city,
            state,
          },
        }),

        //update room
        db.room.update({
          where: {
            id: room.id,
          },
          data: {
            location: { connect: { id: id } },
            updated_at: isoDateString,
          },
          include: {
            cover: true,
            participants: true,
            location: true,
          },
        }),
      ]);

      return NextResponse.json(
        {
          msg: "Ok",
          updatedRoom: result[1],
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const resp = await authenticateUser(req);

    if (resp.status !== 200) {
      const msg = resp.data.msg;

      return NextResponse.json(
        {
          error: msg,
        },
        { status: resp.status }
      );
    }
    const { user } = resp.data;

    const body = await req.json();
    const { roomId, id, latitude, longitude, country, city, state } =
      locationschema.parse(body);

    const room = await db.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        cover: true,
        location: true,
      },
    });

    if (!room) {
      return NextResponse.json(
        {
          error: "Room not found",
        },
        { status: 404 }
      );
    }

    //Only admin can edit room
    if (user!.id !== room.admin_fk) {
      return NextResponse.json(
        {
          error: "Access to edit room forbidden",
        },
        { status: 403 }
      );
    }

    if (!room.location) {
      return NextResponse.json(
        {
          error: "Room has no location, consider using POST",
        },
        { status: 400 }
      );
    }

    //Location is the same
    if (room.location.id == id) {
      return NextResponse.json(
        {
          msg: "Location is already added connected to room",
        },
        { status: 200 }
      );
    }

    //save old room.location.id

    //check if location already exists
    const existingLocation = await db.location.findUnique({
      where: {
        latitude_longitude: {
          latitude: latitude,
          longitude: longitude,
        },
      },
    });

    //Updated at for room
    const currentDate = new Date();
    const isoDateString = currentDate.toISOString();

    //Save old room id
    const oldLocationId = room.location.id;

    const result = await db.$transaction(async (db) => {
      let transactionResult;
      if (existingLocation) {
        //if location then only update and connect room
        const updatedRoom = await db.room.update({
          where: {
            id: room.id,
          },
          data: {
            location: { connect: { id: existingLocation.id } },
            updated_at: isoDateString,
          },
          include: {
            location: true,
            participants: true,
            cover: true,
          },
        });

        transactionResult = updatedRoom;
      } else {
        //if !location then create location and update room
        const newLocation = await db.location.create({
          data: {
            id: id,
            latitude: latitude,
            longitude: longitude,
            country: country,
            city: city,
            state,
          },
        });

        const updatedRoom = await db.room.update({
          where: {
            id: room.id,
          },
          data: {
            location: { connect: { id: newLocation.id } },
            updated_at: isoDateString,
          },
          include: {
            cover: true,
            participants: true,
            location: true,
          },
        });
        transactionResult = updatedRoom;
      }

      //Check if any rooms still have old location
      const oldLocationRoomsCount = await db.room.count({
        where: { location_id: oldLocationId, NOT: { id: room.id } },
      });

      //If old location has no rooms, delete it
      if (oldLocationRoomsCount === 0) {
        await db.location.delete({
          where: {
            id: oldLocationId,
          },
        });
      }

      return transactionResult;
    });

    return NextResponse.json(
      {
        msg: "Ok",
        updatedRoom: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
