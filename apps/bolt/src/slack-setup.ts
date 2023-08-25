import {
  AppOptions,
  InstallURLOptions,
  Installation,
  InstallationQuery,
} from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { IncomingMessage, ServerResponse } from "http";

export function slackAppOptions() {
  let appOptions: AppOptions = {
    extendedErrorHandler: true,
  };

  return appOptions;
}
