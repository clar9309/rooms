import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma-client";
import edituserschema from "@/app/_utils/validation/schemas/backend/user-edit-schema";
import generateSignature from "@/app/_utils/helpers/cloudinary";
import { authenticateUser } from "@/app/_utils/authentication/authenticateUser";

export async function PUT(req: NextRequest) {
  try {
    const resp = await authenticateUser(req);

    if (resp.status !== 200) {
      const msg = resp.data.msg;

      return NextResponse.json(
        {
          msg: msg,
        },
        { status: resp.status }
      );
    }
    const { user } = resp.data;

    if (!user) {
      return NextResponse.json({ msg: "User not found", status: 404 });
    }

    const formDataToObject = (body: FormData): Record<string, unknown> => {
      const object: Record<string, unknown> = {};
      body.forEach((value: FormDataEntryValue, key: string) => {
        object[key] = value;
      });
      return object;
    };

    const body = await req.formData();
    const bodyObject = formDataToObject(body);

    const { first_name, last_name, birthday, status, avatar_img } =
      await edituserschema.parseAsync(bodyObject);

    const updates: { [key: string]: any } = {};

    let newImageData = {
      newurl: "",
      cloudinarypublicid: "",
    };

    if (avatar_img) {
      const formData = new FormData();
      formData.append("file", avatar_img);
      formData.append("upload_preset", "fullstack-rooms");

      const resp = await fetch(
        "https://api.cloudinary.com/v1_1/dceom4kf4/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await resp.json();

      if (!resp.ok) {
        return NextResponse.json(
          {
            msg: "An error occurred regarding image upload",
          },
          {
            status: data.error.message.includes("Invalid image file")
              ? 400
              : 500,
          }
        );
      }

      newImageData.cloudinarypublicid = data.public_id;
      //Format image
      const url = data.secure_url.split("upload/");

      if (data.width < 400 || data.height < 400) {
        newImageData.newurl = `${url[0]}upload/w_400,h_400,c_scale/${url[1]}`;
      } else if (data.width > 400 || data.height > 400) {
        newImageData.newurl = `${url[0]}upload/w_400,h_400,c_crop/${url[1]}`;
      } else if (data.width === 400 && data.height === 400) {
        newImageData.newurl = data.secure_url;
      }
    }
    // Compare and update each attribute
    if (first_name !== user.first_name) {
      updates.first_name = first_name;
    }

    if (last_name !== user.last_name) {
      updates.last_name = last_name;
    }

    if (birthday !== user.birthday) {
      updates.birthday = birthday;
    }

    if (status !== user.status_fk) {
      updates.status = { connect: { id: status } };
    }

    //no updates
    if (Object.keys(updates).length === 0 && !avatar_img) {
      return NextResponse.json(
        {
          msg: "No changes made",
        },
        { status: 200 }
      );
    }

    //updated at
    const currentDate = new Date();
    const isoDateString = currentDate.toISOString();
    updates.updated_at = isoDateString;

    //if new img
    if (
      newImageData.newurl &&
      newImageData.cloudinarypublicid &&
      !user.avatar
    ) {
      let response: any = null;

      //Transaction
      await db.$transaction(async (prisma) => {
        //Create avatar
        const newAvatar = await prisma.avatar.create({
          data: {
            formatted_url: newImageData.newurl,
            cloudinary_public_id: newImageData.cloudinarypublicid,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
          select: {
            id: true,
          },
        });

        //Update user
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            ...updates,
            avatar: {
              connect: {
                id: newAvatar.id,
              },
            },
          },
          select: {
            id: true,
            first_name: updates.first_name ? true : false,
            last_name: updates.last_name ? true : false,
            birthday: updates.birthday ? true : false,
            status: updates.status ? true : false,
            avatar: true,
          },
        });

        response = NextResponse.json(
          {
            updatedUser: updatedUser,
            msg: "Succesfully updated user here",
          },
          { status: 200 }
        );
      });

      return response;
    }
    if (newImageData.newurl && newImageData.cloudinarypublicid && user.avatar) {
      try {
        //update avatar
        const updatedAvatarPromise = db.avatar.update({
          where: { id: user.avatar.id },
          data: {
            formatted_url: newImageData.newurl,
            cloudinary_public_id: newImageData.cloudinarypublicid,
          },
        });
        //update user
        const updatedUserPromise = db.user.update({
          where: { id: user.id },
          data: updates,
          select: {
            id: true,
            first_name: updates.first_name ? true : false,
            last_name: updates.last_name ? true : false,
            birthday: updates.birthday ? true : false,
            status: updates.status ? true : false,
            avatar: true,
          },
        });

        const [updatedAvatar, updatedUser] = await db.$transaction([
          updatedAvatarPromise,
          updatedUserPromise,
        ]);

        //cloudinary delete old img
        const params = {
          public_id: user.avatar.cloudinary_public_id,
        };
        const { timestamp, signature } = generateSignature(params);
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dceom4kf4/image/destroy?public_id=${user.avatar.cloudinary_public_id}&api_key=${process.env.CLOUDINARY_API_KEY}&signature=${signature}&timestamp=${timestamp}`;
        const deleteResp = await fetch(`${cloudinaryUrl}`, {
          method: "DELETE",
        });

        if (deleteResp.ok) {
          console.log("Old image deleted successfully from Cloudinary");
        } else {
          const errorText = await deleteResp.text();
          console.error("Delete request failed:", errorText);
        }

        //return success
        return NextResponse.json(
          {
            updatedUser: updatedUser,
            msg: "Succesfully updated user",
          },
          { status: 200 }
        );
      } catch (error) {
        console.error(error);
      }
    } else if (Object.keys(updates).length !== 0 && !avatar_img) {
      //update user only
      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: updates,
        select: {
          id: true,
          first_name: updates.first_name ? true : false,
          last_name: updates.last_name ? true : false,
          birthday: updates.birthday ? true : false,
          status: updates.status ? true : false,
        },
      });
      return NextResponse.json(
        {
          updatedUser: updatedUser,
          msg: "Succesfully updated user",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      //Zod errors
      const validationErrors = error.errors.map((err) => {
        return {
          message: err.message,
        };
      });
      // Return a validation error response
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    } else {
      //Other errors
      console.error(error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
