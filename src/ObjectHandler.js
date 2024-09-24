import { Vector3 } from "three";
import { PathFactory } from "./Path";

export class ObjectHandler {
  // Instance of our matterport sdk
  _mpSdk;

  /**
   * @param {MpSdk} mpSdk - Matterport SDK instance
   */
  constructor(mpSdk) {
    this._mpSdk = mpSdk;

    // Register our custom object with the matterport sdk
    this._mpSdk.Scene.register('path', PathFactory);
  }

  /**
   * Create IComponent to add custom object to the scene
   * @param {string} component - the name of our custom component (e.g. 'path')
   * @param params - the custom properties for the custom object
   * @return {IComponent} - The node created
   */
  async addObject(component, ...params) {
    // Create an object in matterport and assign it to local variable
    const [ itemObject ] = await this._mpSdk.Scene.createObjects(1);

    // Create a self-sustaining "node" in our object to run our custom object
    const node = itemObject.addNode();

    // Create component and add it to our node
    node.addComponent(component, {...params});

    // Start running the node
    node.start();

    return node;
  }

  /**
   * Adds a custom Path object to our Matterport scene
   *
   * @param {Vector3[]} pathPoints - A list of coordinates that make up the path
   * @param {boolean} dashed - Whether the line is dashed or not
   */
  async addPath(pathPoints = [new Vector3(0,0,0)], dashed = false) {
    await this.addObject('path', pathPoints, dashed);
  }
}