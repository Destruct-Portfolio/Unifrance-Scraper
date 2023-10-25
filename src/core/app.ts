import { UnifranceDataExtractor } from "../components/extractor.js";

export default class App {
  public static async start() {
    await UnifranceDataExtractor.launch();
  }
}
