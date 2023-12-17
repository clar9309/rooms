import { UserEdit } from "@/app/_models/user";
import { Field, FieldInputProps, FormikErrors, FormikTouched } from "formik";
import Image from "next/image";
import { User } from "next-auth";
import { ChangeEvent, useEffect, useState } from "react";

interface AvatarFileInputProps {
  setFieldValue: (
    field: any,
    value: any
  ) => Promise<void | FormikErrors<UserEdit>>;
  error: string | undefined;
  touched: boolean | undefined;
  sessionUser: User | undefined;
  setFieldTouched: (
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean
  ) => void;
  isValidating: boolean;
}

function AvatarFileInput({
  setFieldValue,
  error,
  touched,
  sessionUser,
  setFieldTouched,
  isValidating,
}: AvatarFileInputProps) {
  const [displayedImg, setDisplayedImg] = useState("");
  const [inputImg, setInputImg] = useState("");

  //initial load
  useEffect(() => {
    if (sessionUser?.image) {
      setDisplayedImg(sessionUser.image);
    } else {
      setDisplayedImg("/default_avatar.png");
    }
  }, [sessionUser?.image]);

  useEffect(() => {
    //if done validating and there isnt error set image
    if (!isValidating && !error && inputImg) {
      setDisplayedImg(inputImg);
    }
  }, [isValidating, error]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setInputImg(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="my-6 min-h-[10.5rem]">
      <div className="relative flex items-center justify-center">
        <Field>
          {({ field }: { field: FieldInputProps<string> }) => (
            <input
              id="avatar_img"
              type="file"
              name="avatar_img"
              onBlur={field.onBlur}
              accept="image/png, image/jpeg, image/webp"
              hidden
              onChange={(event) => {
                if (event.currentTarget.files) {
                  setFieldValue("avatar_img", event.currentTarget.files[0]);
                  setFieldTouched("avatar_img", true, false);
                  handleImageChange(event);
                }
              }}
            />
          )}
        </Field>
        <div className="relative min-w-[8.5rem] h-full min-h-[8.5rem] overflow-hidden rounded-full">
          <Image
            src={displayedImg ? displayedImg : "/default_avatar.png"}
            alt={"avatar picture"}
            style={{ objectFit: "cover" }}
            fill={true}
            sizes="(max-width: 768px) 100vw, (min-width: 769px) 33vw"
            className="filter group-hover:brightness-90 transition"
          />
          <label
            className="absolute top-0 left-0 w-full h-full rounded-full cursor-pointer z-10 peer"
            htmlFor="avatar_img"
          ></label>
          <span className="absolute top-0 left-0 w-full h-full rounded-full peer-hover:bg-bg_black peer-hover:bg-opacity-10"></span>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-primary p-3 bg-opacity-60 rounded-full">
            <svg
              className="w-5 h-5"
              width="23"
              height="24"
              viewBox="0 0 23 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.4403 6.65533L7.43336 21.6622L1.47996 22.7064C1.4265 22.7142 1.383 22.7179 1.34556 22.7179C1.16581 22.7179 0.992964 22.6493 0.845476 22.5071C0.765888 22.4278 0.706655 22.3304 0.67285 22.2233C0.638799 22.1153 0.631573 22.0007 0.651806 21.8893L0.652325 21.8864L1.69761 15.9265L16.7062 0.917851L22.4403 6.65533ZM22.5424 6.75749C22.5422 6.75733 22.5421 6.75718 22.5419 6.75702L22.5424 6.75749Z"
                stroke="#E9E9E9"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>

      {error && touched && (
        <p className="text-warning mt-2 italic text-center text-sm">{error}</p>
      )}
    </div>
  );
}

export default AvatarFileInput;
