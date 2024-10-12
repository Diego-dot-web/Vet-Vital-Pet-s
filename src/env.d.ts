//// <reference path="../.astro/types.d.ts" />
declare namespace App {
  interface Locals {
    session: import("lucia").Session | null;
    User: import("lucia").User | null;
  }
}

