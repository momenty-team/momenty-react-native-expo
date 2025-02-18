import { Href } from "expo-router";

export type BridgeRoute = Href | "goBack";

export interface BrigdeData {
  route?: BridgeRoute;
}
