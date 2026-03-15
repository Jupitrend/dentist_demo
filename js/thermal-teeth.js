/**
 * thermal-teeth.js
 * Vanilla JS port of the Three.js thermal shader effect.
 * Renders a rotten tooth (left) and a healthy tooth (right) in the header.
 * Requires Three.js to be loaded globally as window.THREE.
 */
(function () {
  'use strict';

  // ─── Constants ───────────────────────────────────────────────────────────────

  var DEFAULT_PARAMETERS = {
    effectIntensity: 1.3,
    contrastPower: 0.8,
    colorSaturation: 1.5,
    heatSensitivity: 0.5,
    videoBlendAmount: 1.0,
    gradientShift: 0.0,
    heatDecay: 0.9,
    interactionRadius: 1.0,
    reactivity: 3.0
  };

  var THERMAL_PALETTE = ['000000', '073dff', '53d5fd', 'fefcdd', 'ffec6a', 'f9d400', 'a61904'];

  var ANIMATION = {
    FADE_IN_SPEED: 0.1,
    MOUSE_INTERPOLATION_SPEED: 0.8,
    SCROLL_INTERPOLATION_SPEED: 0.2,
    MOVEMENT_INTERPOLATION_SPEED: 0.01,
    POWER_INTERPOLATION_SPEED: 0.01,
    HEAT_MAX_VALUE: 1.3,
    TARGET_FPS: 60,
    POWER_MIN: 0.8,
    POWER_MAX: 1.0
  };

  var DRAW_RENDERER = {
    TEXTURE_SIZE: 256,
    UNIFORMS: {
      RADIUS_VECTOR: [-8, 0.9, 150],
      SIZE_DAMPING: 0.8,
      FADE_DAMPING: 0.98,
      DIRECTION_MULTIPLIER: 100
    }
  };

  var GRADIENT_CONFIG = {
    BLEND_POINTS: [0.4, 0.7, 0.81, 0.91],
    FADE_RANGES: [1, 1, 0.72, 0.52],
    MAX_BLEND: [0.8, 0.87, 0.5, 0.27]
  };

  var CAMERA_CONFIG = {
    LEFT: -0.5, RIGHT: 0.5, TOP: 0.5, BOTTOM: -0.5,
    NEAR: -1, FAR: 1, POSITION_Z: 1
  };

  var INTERACTION = {
    HOLD_MOVE_TARGET: 0.95,
    RELEASE_MOVE_TARGET: 1.0,
    HOLD_POWER_TARGET: 1.0,
    RELEASE_POWER_TARGET: 0.8,
    HEAT_CLEANUP_THRESHOLD: 0.001
  };

  // ─── Math Utilities ──────────────────────────────────────────────────────────

  function lerp(a, b, t) { return a + (b - a) * t; }

  function lerpSpeed(base, dt) {
    var n = base * dt * 60;
    return n > 1 ? 1 : n < 0 ? 0 : n;
  }

  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

  function hexToRGB(hex) {
    if (hex.length === 3) hex = hex.split('').map(function(c){ return c+c; }).join('');
    return [
      parseInt(hex.slice(0,2),16)/255,
      parseInt(hex.slice(2,4),16)/255,
      parseInt(hex.slice(4,6),16)/255
    ];
  }

  function screenToNDC(sx, sy, bounds) {
    var nx = bounds.width  > 0 ? (sx - bounds.left) / bounds.width  : 0.5;
    var ny = bounds.height > 0 ? (sy - bounds.top)  / bounds.height : 0.5;
    return { x: 2*(nx-0.5), y: 2*(-(ny-0.5)) };
  }

  function calcMoveDelta(cx, cy, lx, ly, bounds) {
    var nx = bounds.width  > 0 ? (cx - bounds.left) / bounds.width  : 0.5;
    var ny = bounds.height > 0 ? (cy - bounds.top)  / bounds.height : 0.5;
    return { x: nx-lx, y: ny-ly };
  }

  function isTouchDevice() {
    return ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  }

  function addEvt(el, ev, fn, opts) {
    el.addEventListener(ev, fn, opts);
    return function(){ el.removeEventListener(ev, fn, opts); };
  }

  // ─── Tooth Canvas Generators ─────────────────────────────────────────────────

  /**
   * Draws a clean, symmetric two-root molar tooth (healthy).
   * White filled on transparent background — alpha used as shader mask.
   */
  function createHealthyToothCanvas() {
    var s = 256;
    var cv = document.createElement('canvas');
    cv.width = s; cv.height = s;
    var ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, s, s);

    ctx.fillStyle = 'white';
    ctx.beginPath();

    // Left root — bottom tip, counter-clockwise around the tooth
    ctx.moveTo(100, 226);
    ctx.bezierCurveTo(90, 224, 85, 212, 87, 196);
    ctx.bezierCurveTo(87, 178, 91, 158, 93, 144);

    // Crown left side — widens toward cusps
    ctx.bezierCurveTo(89, 132, 80, 116, 78, 100);
    ctx.bezierCurveTo(76, 86, 79, 70, 85, 58);

    // Left cusp — peak
    ctx.bezierCurveTo(91, 46, 102, 32, 112, 32);
    ctx.bezierCurveTo(120, 32, 126, 40, 128, 54);

    // Valley between cusps then right cusp
    ctx.bezierCurveTo(130, 40, 136, 32, 144, 32);
    ctx.bezierCurveTo(154, 32, 165, 46, 171, 58);

    // Crown right side
    ctx.bezierCurveTo(177, 70, 180, 86, 178, 100);
    ctx.bezierCurveTo(176, 116, 167, 132, 163, 144);

    // Right root going down
    ctx.bezierCurveTo(165, 158, 169, 178, 169, 196);
    ctx.bezierCurveTo(171, 212, 166, 224, 156, 226);

    // Right root bottom arc
    ctx.bezierCurveTo(148, 230, 142, 222, 140, 208);
    ctx.bezierCurveTo(138, 192, 138, 170, 137, 154);

    // Root trunk — bridge between two roots
    ctx.bezierCurveTo(136, 146, 133, 140, 128, 138);
    ctx.bezierCurveTo(123, 140, 120, 146, 119, 154);

    // Left root bottom arc
    ctx.bezierCurveTo(118, 170, 118, 192, 116, 208);
    ctx.bezierCurveTo(114, 222, 108, 230, 100, 226);

    ctx.closePath();
    ctx.fill();

    // Highlight groove line between cusps (subtle indentation illusion)
    ctx.strokeStyle = 'rgba(200,200,200,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(128, 54);
    ctx.bezierCurveTo(128, 78, 128, 100, 128, 120);
    ctx.stroke();

    return cv;
  }

  /**
   * Draws a rotten/decayed tooth — same molar shape but:
   *  • chipped crown edges
   *  • two cavity holes cut out with destination-out
   *  • a crack line through the crown
   */
  function createRottenToothCanvas() {
    var s = 256;
    var cv = document.createElement('canvas');
    cv.width = s; cv.height = s;
    var ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, s, s);

    ctx.fillStyle = 'white';
    ctx.beginPath();

    // Rotten left root (slightly shorter/stumpy)
    ctx.moveTo(102, 220);
    ctx.bezierCurveTo(92, 218, 87, 207, 89, 192);
    ctx.bezierCurveTo(89, 175, 93, 156, 94, 142);

    // Crown left — irregular bulge
    ctx.bezierCurveTo(90, 130, 81, 115, 79, 99);
    ctx.bezierCurveTo(77, 83, 81, 66, 87, 54);

    // Left cusp — chipped (jagged)
    ctx.lineTo(92, 46);
    ctx.lineTo(96, 52);   // chip up
    ctx.lineTo(100, 42);  // chip down
    ctx.lineTo(108, 36);
    ctx.bezierCurveTo(114, 32, 122, 38, 126, 52);

    // Valley (slightly asymmetric)
    ctx.bezierCurveTo(128, 42, 133, 33, 142, 34);

    // Right cusp — another chip
    ctx.lineTo(148, 30);
    ctx.lineTo(152, 38);  // chip
    ctx.lineTo(158, 30);  // chip
    ctx.lineTo(164, 40);
    ctx.bezierCurveTo(170, 50, 174, 68, 172, 84);

    // Crown right — slightly collapsed
    ctx.bezierCurveTo(174, 100, 168, 118, 162, 132);

    // Right root
    ctx.bezierCurveTo(164, 147, 167, 166, 166, 184);
    ctx.bezierCurveTo(166, 202, 162, 216, 154, 220);
    ctx.bezierCurveTo(146, 225, 139, 217, 137, 203);
    ctx.bezierCurveTo(135, 188, 136, 167, 135, 152);

    // Trunk
    ctx.bezierCurveTo(134, 144, 131, 138, 128, 136);
    ctx.bezierCurveTo(125, 138, 122, 144, 121, 152);

    // Left root down
    ctx.bezierCurveTo(120, 167, 121, 188, 119, 203);
    ctx.bezierCurveTo(117, 217, 110, 225, 102, 220);

    ctx.closePath();
    ctx.fill();

    // ── Cavity holes — cut out with destination-out ──
    ctx.globalCompositeOperation = 'destination-out';

    // Cavity 1 — upper-left of crown
    ctx.beginPath();
    ctx.ellipse(108, 72, 10, 8, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Cavity 2 — centre-right of crown (larger, deeper decay)
    ctx.beginPath();
    ctx.ellipse(148, 88, 13, 10, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Cavity 3 — small pit near valley
    ctx.beginPath();
    ctx.ellipse(128, 62, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Crack line ──
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(124, 50);
    ctx.lineTo(118, 84);
    ctx.lineTo(126, 118);
    ctx.stroke();

    ctx.globalCompositeOperation = 'source-over';

    return cv;
  }

  // ─── Shaders ─────────────────────────────────────────────────────────────────

  var thermalVertexShader = [
    'varying vec2 vUv;',
    'varying vec4 vClipPosition;',
    'void main() {',
    '  vUv = uv;',
    '  vClipPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '  gl_Position = vClipPosition;',
    '}'
  ].join('\n');

  var thermalFragmentShader = [
    'precision highp float;',
    'uniform sampler2D drawMap;',
    'uniform sampler2D maskMap;',
    'uniform float time;',
    'uniform float opacity;',
    'uniform float amount;',
    'uniform vec2 scale;',
    'uniform vec2 offset;',
    'uniform float power;',
    'uniform float effectIntensity;',
    'uniform float colorSaturation;',
    'uniform float gradientShift;',
    'uniform float interactionSize;',
    'uniform vec3 color1, color2, color3, color4, color5, color6, color7;',
    'uniform vec4 blend, fade, maxBlend;',
    'varying vec2 vUv;',
    'varying vec4 vClipPosition;',
    'vec3 toLuma(vec3 c) { float f=dot(c,vec3(0.2126,0.7152,0.0722)); return vec3(f); }',
    'vec3 sat(vec3 c,float s) { return mix(toLuma(c),c,s); }',
    'float noise(vec2 p) { return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }',
    'float snoise(vec2 p) {',
    '  vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);',
    '  float a=noise(i),b=noise(i+vec2(1,0)),c=noise(i+vec2(0,1)),d=noise(i+vec2(1,1));',
    '  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);',
    '}',
    'vec3 grad(float t) {',
    '  t=clamp(t+gradientShift,0.0,1.0);',
    '  float p1=blend.x,p2=blend.y,p3=blend.z,p4=blend.w;',
    '  float p5=maxBlend.x,p6=maxBlend.y;',
    '  float f1=fade.x,f2=fade.y,f3=fade.z,f4=fade.w;',
    '  float f5=maxBlend.z,f6=maxBlend.w;',
    '  float b1=smoothstep(p1-f1*.5,p1+f1*.5,t);',
    '  float b2=smoothstep(p2-f2*.5,p2+f2*.5,t);',
    '  float b3=smoothstep(p3-f3*.5,p3+f3*.5,t);',
    '  float b4=smoothstep(p4-f4*.5,p4+f4*.5,t);',
    '  float b5=smoothstep(p5-f5*.5,p5+f5*.5,t);',
    '  float b6=smoothstep(p6-f6*.5,p6+f6*.5,t);',
    '  vec3 col=color1;',
    '  col=mix(col,color2,b1); col=mix(col,color3,b2);',
    '  col=mix(col,color4,b3); col=mix(col,color5,b4);',
    '  col=mix(col,color6,b5); col=mix(col,color7,b6);',
    '  return col;',
    '}',
    'void main() {',
    '  vec2 duv = vClipPosition.xy / vClipPosition.w;',
    '  duv = 0.5 + duv*0.5;',
    '  vec2 uv = vUv;',
    '  uv -= 0.5; uv /= scale; uv += 0.5; uv += offset;',
    '  float o = clamp(opacity,0.0,1.0);',
    '  float a = clamp(amount,0.0,1.0);',
    '  vec4 tex = texture2D(maskMap, uv);',
    '  float mask = tex.a;',
    '  vec3 draw = texture2D(drawMap, duv).rgb;',
    '  float heatDraw = draw.b * mask * interactionSize;',
    '  float na = snoise(uv*5.0 + vec2(time*1.0, time*1.2));',
    '  float wa = 0.5 + 0.5*sin(time*0.5 + uv.y*8.0);',
    '  heatDraw += 0.8 * mix(na, wa, 1.0);',
    '  float map = pow(heatDraw, power);',
    '  vec3 final = grad(map);',
    '  final = sat(final, colorSaturation);',
    '  final *= mask * (1.0 + map*1.5);',
    '  final = mix(vec3(0.0), final, o*a*effectIntensity);',
    '  final *= mask;',
    '  float alpha = mask * (o * a * effectIntensity);',
    '  gl_FragColor = vec4(final, alpha);',
    '}'
  ].join('\n');

  var drawVertexShader = [
    'precision highp float;',
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');

  var drawFragmentShader = [
    'precision highp float;',
    'uniform float uDraw;',
    'uniform vec3 uRadius;',
    'uniform vec3 uResolution;',
    'uniform vec2 uPosition;',
    'uniform vec4 uDirection;',
    'uniform float uSizeDamping;',
    'uniform float uFadeDamping;',
    'uniform sampler2D uTexture;',
    'varying vec2 vUv;',
    'void main() {',
    '  float aspect = uResolution.x / uResolution.y;',
    '  vec2 pos = uPosition; pos.y /= aspect;',
    '  vec2 uv = vUv; uv.y /= aspect;',
    '  float dist = distance(pos, uv) / ((uRadius.z * 1.5) / uResolution.x);',
    '  dist = smoothstep(uRadius.x, uRadius.y, dist);',
    '  vec3 dir = uDirection.xyz * uDirection.w;',
    '  vec2 offset = vec2((-dir.x)*(1.0-dist), (dir.y)*(1.0-dist));',
    '  vec4 color = texture2D(uTexture, vUv + (offset * 0.01));',
    '  color *= uFadeDamping;',
    '  color.r += offset.x; color.g += offset.y;',
    '  color.rg = clamp(color.rg,-1.0,1.0);',
    '  color.b += uDraw * (1.0 - dist);',
    '  gl_FragColor = vec4(color.rgb, 1.0);',
    '}'
  ].join('\n');

  // ─── DrawRenderer ────────────────────────────────────────────────────────────

  function DrawRenderer(size, options) {
    var T = window.THREE;
    this.options = options || {};
    this.camera = new T.OrthographicCamera(
      CAMERA_CONFIG.LEFT, CAMERA_CONFIG.RIGHT,
      CAMERA_CONFIG.TOP,  CAMERA_CONFIG.BOTTOM,
      CAMERA_CONFIG.NEAR, CAMERA_CONFIG.FAR
    );
    this.camera.position.z = CAMERA_CONFIG.POSITION_Z;

    var rtOpts = {
      type: T.HalfFloatType,
      format: T.RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false,
      magFilter: T.LinearFilter,
      minFilter: T.LinearFilter
    };

    this.renderTargetA = new T.WebGLRenderTarget(size, size, rtOpts);
    this.renderTargetB = new T.WebGLRenderTarget(size, size, rtOpts);

    var rv = DRAW_RENDERER.UNIFORMS.RADIUS_VECTOR;
    this.uniforms = {
      uRadius:     { value: new T.Vector3(rv[0], rv[1], rv[2]) },
      uPosition:   { value: new T.Vector2(0, 0) },
      uDirection:  { value: new T.Vector4(0, 0, 0, 0) },
      uResolution: { value: new T.Vector3(0, 0, 0) },
      uTexture:    { value: null },
      uSizeDamping:{ value: DRAW_RENDERER.UNIFORMS.SIZE_DAMPING },
      uFadeDamping:{ value: DRAW_RENDERER.UNIFORMS.FADE_DAMPING },
      uDraw:       { value: 0 }
    };

    this.material = new T.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: drawVertexShader,
      fragmentShader: drawFragmentShader,
      depthTest: false,
      transparent: true
    });

    this.scene = new T.Scene();
    this.mesh = new T.Mesh(new T.PlaneGeometry(1, 1), this.material);
    this.scene.add(this.mesh);
  }

  DrawRenderer.prototype.updateRadius = function(px) {
    this.uniforms.uRadius.value.z = px || 0;
  };

  DrawRenderer.prototype.updateDraw = function(v) {
    this.uniforms.uDraw.value = v || 0;
  };

  DrawRenderer.prototype.updatePosition = function(pos, normalized) {
    var x = pos.x, y = pos.y;
    if (normalized) { x = 0.5*pos.x+0.5; y = 0.5*pos.y+0.5; }
    this.uniforms.uPosition.value.set(x, y);
  };

  DrawRenderer.prototype.updateDirection = function(dir) {
    this.uniforms.uDirection.value.set(
      dir.x, dir.y, 0,
      DRAW_RENDERER.UNIFORMS.DIRECTION_MULTIPLIER
    );
  };

  DrawRenderer.prototype.resize = function(w, h) {
    var ratio = h / 1000;
    var radius = (isTouchDevice() ? 350 : 220) * ratio;
    this.updateRadius(radius);
    this.uniforms.uResolution.value.set(w, h, 1);
  };

  DrawRenderer.prototype.getTexture = function() {
    return this.renderTargetB.texture;
  };

  DrawRenderer.prototype.render = function(renderer) {
    this.uniforms.uTexture.value = this.renderTargetB.texture;
    var prev = renderer.getRenderTarget();
    renderer.setRenderTarget(this.renderTargetA);
    if (renderer.autoClear) renderer.clear();
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(prev);
    var tmp = this.renderTargetA;
    this.renderTargetA = this.renderTargetB;
    this.renderTargetB = tmp;
  };

  DrawRenderer.prototype.dispose = function() {
    this.material.dispose();
    this.renderTargetA.dispose();
    this.renderTargetB.dispose();
    this.mesh.geometry.dispose();
  };

  // ─── ThermalMaterial ─────────────────────────────────────────────────────────

  function ThermalMaterial(config) {
    var T = window.THREE;
    var colors = THERMAL_PALETTE.map(hexToRGB);
    var gc = GRADIENT_CONFIG;

    this.uniforms = {
      blendVideo:        { value: 0 },
      drawMap:           { value: config.drawTexture },
      textureMap:        { value: config.drawTexture },
      maskMap:           { value: config.maskTexture },
      scale:             { value: [1, 1] },
      offset:            { value: [0, 0] },
      opacity:           { value: 1 },
      amount:            { value: 0 },
      color1:            { value: colors[0] },
      color2:            { value: colors[1] },
      color3:            { value: colors[2] },
      color4:            { value: colors[3] },
      color5:            { value: colors[4] },
      color6:            { value: colors[5] },
      color7:            { value: colors[6] },
      blend:             { value: gc.BLEND_POINTS.slice() },
      fade:              { value: gc.FADE_RANGES.slice() },
      maxBlend:          { value: gc.MAX_BLEND.slice() },
      power:             { value: 0.8 },
      rnd:               { value: 0 },
      heat:              { value: [0, 0, 0, 1.02] },
      stretch:           { value: [1, 1, 0, 0] },
      effectIntensity:   { value: 1.0 },
      colorSaturation:   { value: 1.3 },
      gradientShift:     { value: 0.0 },
      interactionSize:   { value: 1.0 },
      time:              { value: 0.0 },
      glowRadius:        { value: 0.02 },
      glowIntensity:     { value: 0.7 },
      blurAmount:        { value: 0.005 },
      animationSpeed:    { value: 1.0 },
      animationIntensity:{ value: 0.5 },
      waveFrequency:     { value: 8.0 },
      pulseSpeed:        { value: 2.0 },
      baseAnimationLevel:{ value: 0.3 },
      animationBlendMode:{ value: 1.0 }
    };

    this.material = new T.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: thermalVertexShader,
      fragmentShader: thermalFragmentShader,
      depthTest: false,
      transparent: true
    });
  }

  ThermalMaterial.prototype.getMaterial = function() { return this.material; };
  ThermalMaterial.prototype.getUniforms = function() { return this.uniforms; };

  ThermalMaterial.prototype.updateUniforms = function(u) {
    if (u.opacity   !== undefined) this.uniforms.opacity.value   = u.opacity;
    if (u.amount    !== undefined) this.uniforms.amount.value    = u.amount;
    if (u.power     !== undefined) this.uniforms.power.value     = u.power;
    if (u.blendVideo!== undefined) this.uniforms.blendVideo.value= u.blendVideo;
    if (u.effectIntensity !== undefined) this.uniforms.effectIntensity.value = u.effectIntensity;
    if (u.colorSaturation !== undefined) this.uniforms.colorSaturation.value = u.colorSaturation;
    if (u.randomValue !== undefined) this.uniforms.rnd.value = u.randomValue;
  };

  ThermalMaterial.prototype.updateTime = function(t) {
    this.uniforms.time.value = t;
  };

  ThermalMaterial.prototype.updateFromParameters = function(p) {
    this.updateUniforms({
      effectIntensity: p.effectIntensity,
      colorSaturation: p.colorSaturation,
      power:           p.contrastPower,
      blendVideo:      p.videoBlendAmount
    });
  };

  ThermalMaterial.prototype.dispose = function() {
    this.material.dispose();
  };

  // ─── InteractionManager ──────────────────────────────────────────────────────

  function InteractionManager(config) {
    var T = window.THREE;
    this.container    = config.container;
    this.hitContainer = config.hitContainer || config.container;
    this.onPositionUpdate    = config.onPositionUpdate;
    this.onInteractionChange = config.onInteractionChange;
    this.mouseState = {
      position: new T.Vector3(0,0,0),
      target:   new T.Vector3(0,0,0)
    };
    this.interactionState = { hold: false, heatUp: 0, lastNX: 0.5, lastNY: 0.5 };
    this._cleanups = [];
    this._setupEvents();
  }

  InteractionManager.prototype._setupEvents = function() {
    var self = this;
    var hit  = this.hitContainer;

    this._cleanups.push(
      addEvt(hit,    'pointermove',  function(e){ self._onMove(e); }),
      addEvt(hit,    'pointerdown',  function(e){ self._onMove(e); self._setHold(true); }),
      addEvt(hit,    'pointerenter', function(e){ self._onMove(e); }),
      addEvt(hit,    'pointerup',    function(){ self._setHold(false); }),
      addEvt(hit,    'pointerleave', function(){ self._setHold(false); }),
      addEvt(window, 'pointermove',  function(e){ self._onGlobal(e); }, { passive: true })
    );
  };

  InteractionManager.prototype._onMove = function(e) {
    var bounds = this.hitContainer.getBoundingClientRect();
    var ndc    = screenToNDC(e.clientX, e.clientY, bounds);
    var delta  = calcMoveDelta(e.clientX, e.clientY,
                   this.interactionState.lastNX,
                   this.interactionState.lastNY, bounds);
    this.mouseState.target.set(ndc.x, ndc.y, 0);
    this.onPositionUpdate(this.mouseState.target, delta);
    this.interactionState.lastNX = bounds.width  > 0 ? (e.clientX-bounds.left)/bounds.width  : 0.5;
    this.interactionState.lastNY = bounds.height > 0 ? (e.clientY-bounds.top) /bounds.height : 0.5;
    this._setHold(true);
  };

  InteractionManager.prototype._onGlobal = function(e) {
    var bounds = this.container.getBoundingClientRect();
    var ndc    = screenToNDC(e.clientX, e.clientY, bounds);
    var delta  = calcMoveDelta(e.clientX, e.clientY,
                   this.interactionState.lastNX,
                   this.interactionState.lastNY, bounds);
    this.mouseState.target.set(ndc.x, ndc.y, 0);
    this.onPositionUpdate(this.mouseState.target, delta);
    this.interactionState.lastNX = bounds.width  > 0 ? (e.clientX-bounds.left)/bounds.width  : 0.5;
    this.interactionState.lastNY = bounds.height > 0 ? (e.clientY-bounds.top) /bounds.height : 0.5;
    this._setHold(true);
  };

  InteractionManager.prototype._setHold = function(v) {
    if (this.interactionState.hold !== v) {
      this.interactionState.hold = v;
      this.onInteractionChange(v);
    }
  };

  InteractionManager.prototype.getMouseState       = function() { return this.mouseState; };
  InteractionManager.prototype.getInteractionState = function() { return this.interactionState; };

  InteractionManager.prototype.updateMousePosition = function(factor) {
    this.mouseState.position.lerp(this.mouseState.target, factor);
  };

  InteractionManager.prototype.dispose = function() {
    this._cleanups.forEach(function(fn){ fn(); });
    this._cleanups = [];
  };

  // ─── ThermalEffectEngine ─────────────────────────────────────────────────────

  function ThermalEffectEngine(container, toothCanvas) {
    var T = window.THREE;
    this.container   = container;
    this.toothCanvas = toothCanvas;
    this.heatUp      = 0;
    this.parameters  = Object.assign({}, DEFAULT_PARAMETERS);
    this.animationId = null;
    this.lastTime    = 0;

    this.animationValues = {
      blendVideo: { value: 1, target: 1 },
      amount:     { value: 0, target: 1 },
      mouse: {
        position: new T.Vector3(0,0,0),
        target:   new T.Vector3(0,0,0)
      },
      move: { value: 1, target: 1 },
      scrollAnimation: {
        opacity: { value: 1, target: 1 },
        scale:   { value: 1, target: 1 },
        power:   { value: 0.8, target: 0.8 }
      }
    };

    // Renderer
    this.renderer = new T.WebGLRenderer({ alpha: true, antialias: false });
    this.renderer.setClearColor(0x000000, 0);
    if (T.SRGBColorSpace) this.renderer.outputColorSpace = T.SRGBColorSpace;

    // Scene & camera
    this.scene  = new T.Scene();
    this.camera = new T.OrthographicCamera(
      CAMERA_CONFIG.LEFT, CAMERA_CONFIG.RIGHT,
      CAMERA_CONFIG.TOP,  CAMERA_CONFIG.BOTTOM,
      CAMERA_CONFIG.NEAR, CAMERA_CONFIG.FAR
    );
    this.camera.position.z = CAMERA_CONFIG.POSITION_Z;

    // Setup
    var rect = container.getBoundingClientRect();
    this.renderer.setSize(rect.width || 96, rect.height || 96);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(this.renderer.domElement);

    // Resize handler
    var self = this;
    this._resizeHandler = function() {
      var r = self.container.getBoundingClientRect();
      self.renderer.setSize(r.width, r.height);
      self._onResize(r.width, r.height);
    };
    window.addEventListener('resize', this._resizeHandler);
  }

  ThermalEffectEngine.prototype.init = function() {
    var T = window.THREE;
    this.drawRenderer = new DrawRenderer(256, { radiusRatio: 1000, isMobile: isTouchDevice() });

    // Use CanvasTexture — no async loading needed
    this.maskTexture  = new T.CanvasTexture(this.toothCanvas);
    this.maskTexture.wrapS = this.maskTexture.wrapT = T.RepeatWrapping;
    this.maskTexture.needsUpdate = true;

    this.thermalMaterial = new ThermalMaterial({
      drawTexture: this.drawRenderer.getTexture(),
      maskTexture: this.maskTexture
    });

    // glowRadius based on texture size
    var uniforms = this.thermalMaterial.getUniforms();
    if (uniforms.glowRadius)   uniforms.glowRadius.value   = 10 / 256;
    if (uniforms.glowIntensity) uniforms.glowIntensity.value = 0.7;

    this.heatMesh = new T.Mesh(
      new T.PlaneGeometry(1, 1),
      this.thermalMaterial.getMaterial()
    );
    this.heatMesh.position.set(0, 0, 0);
    this.scene.add(this.heatMesh);

    var self = this;
    this.interactionManager = new InteractionManager({
      container:    this.container,
      hitContainer: this.container,
      onPositionUpdate: function(pos, dir) {
        self.animationValues.mouse.target.copy(pos);
        self.drawRenderer.updateDirection(dir);
      },
      onInteractionChange: function(active) {
        self.animationValues.move.target  = active ? INTERACTION.HOLD_MOVE_TARGET  : INTERACTION.RELEASE_MOVE_TARGET;
        self.animationValues.scrollAnimation.power.target = active ? INTERACTION.HOLD_POWER_TARGET : INTERACTION.RELEASE_POWER_TARGET;
      }
    });

    var rect = this.container.getBoundingClientRect();
    this._onResize(rect.width || 96, rect.height || 96);
    this._startLoop();
  };

  ThermalEffectEngine.prototype._startLoop = function() {
    var self = this;
    function animate(now) {
      var dt = (now - self.lastTime) / 1000;
      self.lastTime = now;
      self._update(dt);
      self._render();
      self.animationId = requestAnimationFrame(animate);
    }
    this.animationId = requestAnimationFrame(animate);
  };

  ThermalEffectEngine.prototype._update = function(dt) {
    this._updateAnimValues(dt);
    this._updateHeat(dt);
    this._updateMaterial();
    if (this.heatMesh) {
      var sc = this.animationValues.scrollAnimation.scale.value;
      this.heatMesh.scale.set(sc, sc, sc);
    }
    this.drawRenderer.updateDirection({ x:0, y:0 });
    this.thermalMaterial.updateTime(this.lastTime / 1000);
  };

  ThermalEffectEngine.prototype._updateAnimValues = function(dt) {
    var av = this.animationValues;
    av.mouse.position.lerp(av.mouse.target, lerpSpeed(ANIMATION.MOUSE_INTERPOLATION_SPEED, dt));
    av.move.value = lerp(av.move.value, av.move.target, lerpSpeed(ANIMATION.MOVEMENT_INTERPOLATION_SPEED, dt));
    av.scrollAnimation.power.value = clamp(
      lerp(av.scrollAnimation.power.value, av.scrollAnimation.power.target, lerpSpeed(ANIMATION.POWER_INTERPOLATION_SPEED, dt)),
      ANIMATION.POWER_MIN, ANIMATION.POWER_MAX
    );
    av.scrollAnimation.opacity.value = lerp(
      av.scrollAnimation.opacity.value,
      av.scrollAnimation.opacity.target * av.move.value,
      lerpSpeed(ANIMATION.SCROLL_INTERPOLATION_SPEED, dt)
    );
    av.scrollAnimation.scale.value = lerp(
      av.scrollAnimation.scale.value,
      av.scrollAnimation.scale.target,
      lerpSpeed(ANIMATION.SCROLL_INTERPOLATION_SPEED, dt)
    );
    if (av.amount.value < 0.99999) {
      av.amount.value = lerp(av.amount.value, av.amount.target, ANIMATION.FADE_IN_SPEED * dt * ANIMATION.TARGET_FPS);
    }
  };

  ThermalEffectEngine.prototype._updateHeat = function(dt) {
    var istate = this.interactionManager.getInteractionState();
    var mstate = this.interactionManager.getMouseState();
    this.drawRenderer.updatePosition(mstate.position, true);
    if (istate.hold) {
      this.heatUp += this.parameters.heatSensitivity * dt * ANIMATION.TARGET_FPS;
      this.heatUp = Math.min(this.heatUp, ANIMATION.HEAT_MAX_VALUE);
    }
    this.drawRenderer.updateDraw(this.heatUp);
    this.heatUp *= this.parameters.heatDecay;
    if (this.heatUp < INTERACTION.HEAT_CLEANUP_THRESHOLD) this.heatUp = 0;
    this.interactionManager.updateMousePosition(lerpSpeed(ANIMATION.MOUSE_INTERPOLATION_SPEED, 1/60));
  };

  ThermalEffectEngine.prototype._updateMaterial = function() {
    var av = this.animationValues;
    this.thermalMaterial.updateUniforms({
      opacity:    av.scrollAnimation.opacity.value,
      amount:     av.amount.value,
      power:      this.parameters.contrastPower,
      blendVideo: this.parameters.videoBlendAmount,
      randomValue: Math.random()
    });
    this.thermalMaterial.updateFromParameters(this.parameters);
  };

  ThermalEffectEngine.prototype._render = function() {
    var rect = this.container.getBoundingClientRect();
    this.drawRenderer.resize(rect.width || 96, rect.height || 96);
    this.drawRenderer.render(this.renderer);
    this.renderer.autoClear = true;
    this.renderer.render(this.scene, this.camera);
  };

  ThermalEffectEngine.prototype._onResize = function(w, h) {
    var T = window.THREE;
    var ar = w / h;
    var cw, ch;
    if (ar >= 1) { ch = 1; cw = ar; }
    else         { cw = 1; ch = 1/ar; }
    this.camera.left   = -cw/2; this.camera.right = cw/2;
    this.camera.top    =  ch/2; this.camera.bottom = -ch/2;
    this.camera.updateProjectionMatrix();
  };

  ThermalEffectEngine.prototype.dispose = function() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    window.removeEventListener('resize', this._resizeHandler);
    if (this.drawRenderer) this.drawRenderer.dispose();
    if (this.interactionManager) this.interactionManager.dispose();
    if (this.thermalMaterial) this.thermalMaterial.dispose();
    if (this.heatMesh) {
      if (this.heatMesh.geometry) this.heatMesh.geometry.dispose();
      this.scene.remove(this.heatMesh);
    }
    if (this.maskTexture) this.maskTexture.dispose();
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  };

  // ─── Text Canvas Generator ───────────────────────────────────────────────────

  /**
   * Draws the given text in white on a transparent canvas.
   * Used as the alpha mask for the thermal shader on the "Yeniden" headline.
   */
  function createTextCanvas(text) {
    var cv  = document.createElement('canvas');
    var ctx = cv.getContext('2d');

    // Measure at a large size, then fit canvas to text
    var fontSize = 130;
    ctx.font = 'bold ' + fontSize + 'px Inter, Arial, sans-serif';
    var metrics  = ctx.measureText(text);
    var textW    = Math.ceil(metrics.width) + 20;
    var textH    = Math.ceil(fontSize * 1.3);

    cv.width  = textW;
    cv.height = textH;

    // Re-apply font after resize (canvas reset clears it)
    ctx.font         = 'bold ' + fontSize + 'px Inter, Arial, sans-serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = 'white';
    ctx.fillText(text, textW / 2, textH / 2);

    return cv;
  }

  // ─── Boot ─────────────────────────────────────────────────────────────────────

  function boot() {
    if (typeof window.THREE === 'undefined') {
      console.warn('[thermal-teeth] Three.js not found — skipping thermal effect.');
      return;
    }

    // Header teeth (left = rotten, right = healthy)
    var leftEl  = document.getElementById('thermal-left');
    var rightEl = document.getElementById('thermal-right');
    if (leftEl && rightEl) {
      var rottenCanvas  = createRottenToothCanvas();
      var healthyCanvas = createHealthyToothCanvas();
      new ThermalEffectEngine(leftEl,  rottenCanvas).init();
      new ThermalEffectEngine(rightEl, healthyCanvas).init();
    }

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
