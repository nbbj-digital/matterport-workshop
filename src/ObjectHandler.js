import { Vector3 } from "three";
import { PathFactory } from "./objects/PathComponent";
import { TextFactory } from "./objects/TextComponent";

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
    this._mpSdk.Scene.register('text', TextFactory);
  }

  /**
   * Create IComponent to add custom object to the scene
   * @param {string} componentName - the name of our custom component (e.g. 'path')
   * @param params - the custom properties for the custom object
   * @return {IComponent} - The component created
   */
  async addObject(componentName, params) {
    // Create an object in matterport and assign it to local variable
    const [ itemObject ] = await this._mpSdk.Scene.createObjects(1);

    // Create a self-sustaining "node" in our object to run our custom object
    const node = itemObject.addNode();

    // Create component and add it to our node
    const component = node.addComponent(componentName, params);

    node.start();

    return component;
  }

  /**
   * Adds a custom Path object to our Matterport scene
   *
   * @param {Vector3[]} pathPoints - A list of coordinates that make up the path
   * @param {boolean} dashed - Whether the line is dashed or not
   */
  async addPath(pathPoints = [new Vector3(0,0,0)], dashed = false, color = '#ffffff') {
    await this.addObject('path', { pathPoints, dashed, color });
  }

  /**
 * Create IComponent to add text to the scene
 * @param { string } text 
 * @param { Object } position 
 * @param { function } callback 
 */
  async addText(text = '', position = { x: 0, y: 0, z: 0 }, callback, baseColor = '#ffffff', hoverColor = '#000000') {
    const textComponent = await this.addObject('text', { text, position, baseColor, hoverColor });

    const clickSpy = new ClickSpy(textComponent, callback);
    const hoverSpy = new HoverSpy(textComponent);
    textComponent.spyOnEvent(clickSpy);
    textComponent.spyOnEvent(hoverSpy);
  }
}

class ClickSpy {
  constructor(textComponent, callback) {
    this.eventType = 'INTERACTION.CLICK';
    this.textComponent = textComponent;
    this.callback = callback;
  }

  onEvent(payload) {
    this.callback();
  }
}

class HoverSpy {
  constructor(textComponent) {
    this.eventType = 'INTERACTION.HOVER';
    this.textComponent = textComponent;
  }

  onEvent(payload) {
    this.textComponent.handleHoverEvent();
  }
}