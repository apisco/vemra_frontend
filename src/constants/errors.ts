export interface ErrorScreenContent {
  code: string;
  heading: string;
  body: string;
}

export const NOT_FOUND_CONTENT: ErrorScreenContent = {
  code: "404",
  heading: "This page doesn't exist",
  body: "The listing may have been unlisted, or the link you followed is out of date.",
};

export const SERVER_ERROR_CONTENT: ErrorScreenContent = {
  code: "500",
  heading: "Something went wrong",
  body: "Something failed on our end. It is usually temporary, so try again in a moment.",
};

export const ERROR_BACK_LINK = {
  href: "/browse",
  label: "Back to browse rentals",
} as const;
