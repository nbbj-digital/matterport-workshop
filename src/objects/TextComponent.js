import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { MeshBasicMaterial, Mesh } from 'three';

/**
 * Implement a Text component and register it with the sdk.
 */
function TextComponent() {
  this.material = new MeshBasicMaterial({ color: '#D3D3D3', transparent: true, opacity: 0.5 });
  this.componentType = 'path';

  this.inputs = {
    position: { x: 0, y: 0, z: 0 },
    text: 'test',
    hovered: false,
  };

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
      this.material.color.setHex(0x00ff00);
    } else {
      this.material.color.setHex(0xffffff);
    }
  }
}

export function TextFactory() {
  return new TextComponent();
}
