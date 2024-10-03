import { MeshLine, MeshLineMaterial } from 'three.meshline';

/**
 * Implement a Path component and register it with the sdk.
 */
function Path() {
  // Custom properties we can use to customize our object
  this.inputs = {
    // Array <Vector3>
    pathPoints: [],
    dashed: false
  };

  /**
   * Matterport lifecycle hook for initializing custom object
   */
  this.onInit = function() {
    // Get instance of THREE.js
    var THREE = this.context.three;
    // create THREE buffer geometry
    var geometry = new THREE.BufferGeometry().setFromPoints( this.inputs.pathPoints );

    // create THREE material
    var material = new MeshLineMaterial( { 
      color: 0xff0000, 
      lineWidth: 0.08,
      dashArray: this.inputs.dashed ? 0.01 : 0,
      dashRatio: this.inputs.dashed ? 0.5 : 0, 
      transparent: true,
    });

    // create new MeshLine object
    var line = new MeshLine();
  
    // set line geometry to buffer geometry
    line.setGeometry(geometry);

    // create THREE.js object
    const mesh = new THREE.Mesh(line, material);
    
    // objectRoot is essentially our custom object, managed by Matterport
    // Assign hour mesh to objectRoot
    this.outputs.objectRoot = mesh;
  };
  
  /** NOT USED */
  this.onEvent = function(type, data) {
  }

  /** NOT USED */
  this.onInputsUpdated = function(previous) {
  };

  /** NOT USED */
  this.onTick = function(tickDelta) {
  }

  /**
   * Matterport lifecycle hook for when custom object is destroyed
   */
  this.onDestroy = function() {
    // Dispose of our custom object's mesh's material
    this.material.dispose();
  };
}

/**
 * Matterport requires a factor function to create the custom object
 * @returns Path object
 */
export function PathFactory() {
  return new Path();
}
