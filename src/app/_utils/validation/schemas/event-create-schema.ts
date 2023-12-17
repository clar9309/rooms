import { z } from "zod";
import { stringValidation } from "../validations/string-validation";
import {
  maxFirstNameLen,
  maxdescriptionLen,
  minFirstNameLen,
} from "../validationVariables";
import { date } from "../validations/date-validation";
import { time } from "../validations/time-validation";

const createeventschema = z
  .object({
    title: stringValidation(minFirstNameLen, maxFirstNameLen, "Title"),
    roomId: z.string({
      required_error: `RoomId is required`,
      invalid_type_error: `RoomId must be a string`,
    }),
    description: z
      .string()
      .max(maxdescriptionLen, `Description max length is ${maxdescriptionLen}`)
      .optional(),
    location: z
      .string()
      .max(maxFirstNameLen, `Location max length is ${maxFirstNameLen}`)
      .optional(),
    startDate: date("Start date"),
    startTime: time("Start time"),
    endDate: date("End date"),
    endTime: time("End time"),
    allDay: z.boolean({
      required_error: "All day is required",
      invalid_type_error: "All day must be a boolean",
    }),
  })
  .superRefine(({ startDate, startTime, endDate, endTime, allDay }, ctx) => {
    //Turn values into strings
    const startDateTimeString = `${startDate}T${startTime}:00`;
    const endDateTimeString = `${endDate}T${endTime}:00`;
    //Turn values into datetime js objects
    const startDateTime = new Date(startDateTimeString);
    const endDateTime = new Date(endDateTimeString);
    if (!allDay) {
      if (
        startDateTime > endDateTime ||
        startDateTimeString === endDateTimeString
      ) {
        ctx.addIssue({
          code: "custom",
          message: `End date must be greater than start date`,
          path: ["endDate"],
        });
      }
    }
  });
export default createeventschema;
