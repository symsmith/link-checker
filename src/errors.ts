import { Schema } from "effect";

export class BadStatus extends Schema.TaggedError<BadStatus>()("BadStatus", {
  url: Schema.String,
  status: Schema.Natural,
}) {}

export class Unreachable extends Schema.TaggedError<Unreachable>()("Unreachable", {
  url: Schema.String,
  cause: Schema.Defect(),
}) {}

export class TimedOut extends Schema.TaggedError<TimedOut>()("TimedOut", {
  url: Schema.String,
}) {}
