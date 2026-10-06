import { h } from "./xml-utils";

// NixOS snowflake by Simon Frankau and Tim Cuthbertson, CC BY 4.0.
// https://github.com/NixOS/nixos-artwork/blob/master/logo/nix-snowflake-colours.svg
// Adapted to flat colors and a reusable SVG symbol for small snake segments.
const arm =
  "m 309.54892,-710.38827 122.19683,211.67512 -56.15706,0.5268 -32.6236,-56.8692 -32.85645,56.5653 -27.90237,-0.011 -14.29086,-24.6896 46.81047,-80.4901 -33.22946,-57.8257 z";

export const nixosLogo =
  '<defs><symbol id="nixos-snowflake" viewBox="0 0 501.56251 501.56249">' +
  '<g transform="translate(-156.41121,933.30685)">' +
  '<g transform="matrix(0.99994059,0,0,0.99994059,-0.06321798,33.188377)">' +
  [
    ["", "#5277c3"],
    ["rotate(60,407.11155,-715.78724)", "#7ebae4"],
    ["rotate(-60,407.31177,-715.70016)", "#7ebae4"],
    ["rotate(180,407.41868,-715.7565)", "#7ebae4"],
    ["rotate(120,407.33916,-716.08356)", "#5277c3"],
    ["rotate(-120,407.28823,-715.86995)", "#5277c3"],
  ]
    .map(([transform, fill]) => h("path", { d: arm, transform, fill }))
    .join("") +
  "</g></g></symbol></defs>";
