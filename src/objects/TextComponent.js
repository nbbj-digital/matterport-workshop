import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { MeshBasicMaterial, Mesh } from 'three';

/**
 * Implement a Text component and register it with the sdk.
 */
function TextComponent() {
  this.componentType = 'path';

  this.inputs = {
    position: { x: 0, y: 0, z: 0 },
    text: 'test',
    hovered: false,
    baseColor: '#ffffff',
    hoverColor: '#000000',
  };

  this.material = new MeshBasicMaterial({ color: this.inputs.baseColor, transparent: true, opacity: 1 });

  this.context = null; // or assign a proper context

  this.events = {
    'INTERACTION.CLICK': true,
    'INTERACTION.HOVER': true,
    'INTERACTION.DRAG': false
  };

  this.spyOnEvent = function(spy) {
    return { cancel: () => {} };
  }

  this.onInit = function() {
    const loader = new FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', this.init.bind(this));
  }

  this.init = function(font) {
    const geometry = new TextGeometry(this.inputs.text, {
      font: font,
      size: 0.15,
      height: 0.01,
    });
    
    const mesh = new Mesh(geometry, this.material);
    mesh.position.set(this.inputs.position.x, this.inputs.position.y, this.inputs.position.z);
    mesh.rotation.y = Math.PI;
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.z = Math.PI;

    this.outputs.objectRoot = mesh;
    this.outputs.collider = mesh; // raycasting ability
  }

  this.onEvent = function(eventType, eventData) {
    if (eventType === 'INTERACTION.CLICK') {
      this.notify('INTERACTION.CLICK', { type: eventType, component: this });
    }

    if (eventType === 'INTERACTION.HOVER') {
      this.notify('INTERACTION.HOVER', { type: eventType, component: this });
    }
  }

  this.onDestroy = function () {
    this.material.dispose();
  }

  this.handleHoverEvent = function() {
    this.inputs.hovered = !this.inputs.hovered;

    if (this.inputs.hovered) {
      let color = this.inputs.hoverColor;
      color = color.substring(1);
      console.log('hover is ', color);
      this.material.color.setHex(parseInt(color, 16));
    } else {
      let color = this.inputs.baseColor;
      color = color.substring(1);
      this.material.color.setHex(parseInt(color, 16));
    }
  }
}

export function TextFactory() {
  return new TextComponent();
}
